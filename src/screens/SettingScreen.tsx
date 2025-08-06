import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Buffer } from 'buffer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { increment } from '../redux/slices/CouterSlice';
if (typeof global.Buffer === 'undefined') global.Buffer = Buffer;
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const regexTag = /^E2[0-9A-F]{22}$/;

const manager = new BleManager();

const dbms = [5, 10, 15, 20];
const baudRates = [38400, 115200];
const modes = [
  {
    id: 1,
    name: 'Mode 103: DSB',
  },
  {
    id: 2,
    name: 'Mode 241: PR-ASK',
  },
  {
    id: 3,
    name: 'Mode 244: PR-ASK',
  },
  {
    id: 4,
    name: 'Mode 284: PR-ASK',
  },
];
export const SettingScreen = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    id: 'RFID-001',
    temperature: 25,
    firmware: '8.2',
    currentMode: modes[0],
    power: 5,
    baud: 115200,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaveConfiguration, setIsSaveConfiguration] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<any[]>([
    {
      id: 'log-1',
      message: 'Device initialized',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [devices, setDevices] = useState<Device[]>([]);
  const requestPermissions = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };
  const handlerScanDevice = async () => {
    setDevices([]);
    setIsScanning(true);
    await requestPermissions();
    setLogs([
      {
        id: `log-${logs.length + 1}`,
        message: 'Scanning for devices...',
        timestamp: new Date().toLocaleTimeString(),
      },
      ...logs,
    ]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setLogs([
          {
            id: `log-${logs.length + 1}`,
            message: `Error scanning devices: ${error.message}`,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...logs,
        ]);
        setIsScanning(false);
        return;
      }

      if (device) {
        setDevices(prev => {
          if (!prev.some(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: `Scan completed. Found ${devices.length} devices.`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prevLogs,
      ]);
      setIsScanning(false);
    }, 5000);
  };

  const handlerSelectDevice = async (device: Device) => {
    try {
      setIsConnected(true);
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: `Connected to ${device.name ?? 'Unknown Device'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prevLogs,
      ]);

      const connected = await device.connect();
      const updated = await connected.requestMTU(517);
      await updated.discoverAllServicesAndCharacteristics();

      const services = await updated.services();
      const service = services.find(s => s.uuid.toLowerCase() === SERVICE_UUID);

      if (!service) {
        setLogs(prevLogs => [
          {
            id: `log-${prevLogs.length + 1}`,
            message: '❌ Không tìm thấy service UUID',
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevLogs,
        ]);
        return;
      }
      const characteristics = await service.characteristics();
      const characteristic = characteristics.find(
        c => c.uuid.toLowerCase() === CHARACTERISTIC_UUID,
      );

      if (!characteristic) {
        setLogs(prevLogs => [
          {
            id: `log-${prevLogs.length + 1}`,
            message: '❌ Không tìm thấy characteristic UUID',
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevLogs,
        ]);
        return;
      }

      let buffer = '';

      characteristic.monitor((error, characteristic) => {
        if (error) {
          console.error('❌ Lỗi khi nhận phản hồi:', error.message);
          return;
        }

        if (characteristic?.value) {
          const chunk = Buffer.from(characteristic.value, 'base64').toString();
          console.log('Nhận mảnh:', chunk);
          buffer += chunk;
          console.log('Tổng hợp:', buffer);
          if (buffer.trim().endsWith('}')) {
            try {
              const json = JSON.parse(buffer);
              console.log('JSON hợp lệ:', json);
              setLogs(prevLogs => [
                {
                  id: `log-${prevLogs.length + 1}`,
                  message: `Phản hồi: ${json.cmd} - ${JSON.stringify(json)}`,
                  timestamp: new Date().toLocaleTimeString(),
                },
                ...prevLogs,
              ]);
              buffer = '';
              if (json.cmd === 'get_reader_identifier') {
              } else if (json.cmd === 'cmd_get_firmware_version') {
              } else if (json.cmd === 'cmd_get_output_power') {
              } else if (json.cmd === 'cmd_get_reader_temperature') {
              } else if (json.cmd === 'cmd_set_output_power') {
              } else if (
                json.cmd === 'cmd_customized_session_target_inventory_start'
              ) {
                if (json && Array.isArray(json.tags)) {
                  console.log('📦 Nhận tag:', json.tags);

                  if (json.tags.length > 0) {
                    const validTags: string[] = json.tags
                      .map((tag: string) => (regexTag.test(tag) ? tag : null))
                      .filter(
                        (tag: string | null): tag is string => tag !== null,
                      );
                    // TODO
                  }
                }
              } else if (
                json.cmd === 'cmd_customized_session_target_inventory_stop'
              ) {
                console.log('📦 Lệnh tùy chỉnh dừng:', json);
              }
            } catch (err) {
              console.warn('⚠️ JSON lỗi, đang chờ thêm...');
            }
          }
        }
      });
    } catch (error) {
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: `Failed to connect to device: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prevLogs,
      ]);
    }
  };
  const handlerFetchInformationDevice = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: 'Device information fetched',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prevLogs,
      ]);
    }, 2000);
  };
  const handlerConfiguration = () => {
    setIsSaveConfiguration(true);
    setTimeout(() => {
      setIsSaveConfiguration(false);
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: 'Configuration saved successfully',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prevLogs,
      ]);
    }, 2000);
  };

  const count = useSelector((state: RootState) => state.couter.value);
  const dispatch = useDispatch();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          justifyContent: 'center',
          paddingHorizontal: 10,
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <Text
          onPress={() => dispatch(increment())}
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 10,
          }}
        >
          Setting Device {count}
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={handlerScanDevice}
            style={{
              width: 200,
              padding: 10,
              backgroundColor: '#4f46e5',
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              borderRadius: 10,
            }}
          >
            {isScanning ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="bluetooth" size={20} color="white" />
                <Text style={{ color: 'white', marginHorizontal: 5 }}>
                  Scan Device
                </Text>
              </>
            )}
          </TouchableOpacity>

          <FlatList
            style={{ width: '100%', maxHeight: 150, flex: 1 }}
            nestedScrollEnabled={true}
            ListEmptyComponent={
              <View style={{ alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>
                  No device found yet. Click Scan to discover devices.
                </Text>
              </View>
            }
            data={devices}
            keyExtractor={item => item?.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlerSelectDevice(item)}
                style={{
                  width: '100%',
                  padding: 10,
                  backgroundColor: '#fff',
                  marginBottom: 5,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                }}
              >
                <Text style={{ color: '#4f46e5' }}>
                  {item?.name ?? 'Unknown Device'} - {item?.id}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius: 10,
            height: 200,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 15,
              marginRight: 'auto',
            }}
          >
            Connection Logs
          </Text>

          <View style={{ flex: 1, width: '100%' }}>
            <FlatList
              nestedScrollEnabled={true}
              style={{ width: '100%', flex: 1, maxHeight: 350 }}
              ListEmptyComponent={
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ textAlign: 'left' }}>
                    No logs available. Select a device to view connection
                    history.
                  </Text>
                </View>
              }
              data={logs}
              keyExtractor={item => item?.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={handlerSelectDevice}
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#fff',
                    marginBottom: 5,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderColor: '#e5e7eb',
                    borderLeftWidth: 2,
                    borderLeftColor: '#4f46e5',
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ color: '#4f46e5' }}>{item?.timestamp}</Text>
                  <Text>{item?.message}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: 15,
                marginRight: 'auto',
              }}
            >
              Device Information
            </Text>
            <TouchableOpacity
              onPress={handlerFetchInformationDevice}
              style={{
                padding: 10,
                backgroundColor: '#4f46e5',
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 10,
              }}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Fetch
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%' }}>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Device ID</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.id}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Device Temperature</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.temperature} °C
              </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Firmware Version</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.firmware}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Current Mode</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.currentMode?.name}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Power</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.power} dBm
              </Text>
            </View>
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 1,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: '#000' }}>Baud Rate</Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {deviceInfo.baud} bps
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 15,
              marginRight: 'auto',
            }}
          >
            Configuration Settings
          </Text>

          <View style={{ width: '100%' }}>
            <View>
              <Text style={{ marginBottom: 10 }}>Power(dbm)</Text>
              <Picker
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  elevation: 1,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              >
                {dbms.map(dbm => (
                  <Picker.Item key={dbm} label={`${dbm} dBm`} value={dbm} />
                ))}
              </Picker>
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ marginBottom: 10 }}>Mode</Text>
              <Picker
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  elevation: 1,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              >
                {modes.map(mode => (
                  <Picker.Item
                    key={mode.id}
                    label={mode.name}
                    value={mode.id}
                  />
                ))}
              </Picker>
            </View>

            <View>
              <Text style={{ marginBottom: 10 }}>Baud Rate(bps)</Text>
              <Picker
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  elevation: 1,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              >
                {baudRates.map(baudRate => (
                  <Picker.Item
                    key={baudRate}
                    label={`${baudRate} bps`}
                    value={baudRate}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: '#4f46e5',
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={handlerConfiguration}
            >
              {isSaveConfiguration ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Save Configuration
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
