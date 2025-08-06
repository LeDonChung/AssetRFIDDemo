import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { DataTable } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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
export const InventoryScreen = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    id: 'RFID-001',
    temperature: 25,
    firmware: '8.2',
    currentMode: modes[0],
    power: 5,
    baud: 115200,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isSaveConfiguration, setIsSaveConfiguration] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<any[]>([
    {
      id: 'log-1',
      message: 'Device initialized',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [devices, setDevices] = useState<any[]>([
    {
      id: 'RFID-001',
      name: 'RFID Reader #1',
    },
    {
      id: 'RFID-002',
      name: 'RFID Reader #2',
    },
    {
      id: 'RFID-003',
      name: 'RFID Reader #3',
    },
    {
      id: 'RFID-004',
      name: 'RFID Reader #4',
    },
    {
      id: 'RFID-005',
      name: 'RFID Reader #5',
    },
    {
      id: 'RFID-006',
      name: 'RFID Reader #6',
    },
  ]);
  const count = useSelector((state: RootState) => state.couter.value);
  const dispatch = useDispatch();
  const handlerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };
  const handlerStop = () => {
    setIsScanning(false);
  };
  const handlerScanDevice = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLogs(prevLogs => [
        {
          id: `log-${prevLogs.length + 1}`,
          message: 'Scan completed',
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
  return (
    <FlatList
      data={[]}
      renderItem={() => <></>}
      ListEmptyComponent={
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: 10,
            flex: 1,
            backgroundColor: '#fff',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 10,
            }}
          >
            Inventory {count}
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
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={handlerScan}
                style={{
                  flex: 1,
                  marginRight: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: '#16a34a',
                  justifyContent: 'center',
                }}
              >
                {isScanning ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                  </>
                ) : (
                  <>
                    <IconFeather
                      style={{ color: '#fff', marginRight: 10 }}
                      name="play-circle"
                    />
                    <Text style={{ color: '#fff' }}>Start Scan</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlerStop}
                style={{
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingVertical: 10,
                  backgroundColor: '#dc2626',
                }}
              >
                <IconFeather
                  style={{ color: '#fff', marginRight: 10 }}
                  name="minus-circle"
                />
                <Text style={{ color: '#fff' }}>Stop Scan</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginVertical: 10,
                flex: 1,
                width: '100%',
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Scan Status</Text>
                <Text
                  style={{
                    padding: 5,
                    textAlign: 'center',
                    borderRadius: 5,
                    backgroundColor: '#bbf7d0',
                  }}
                >
                  Scanning
                </Text>
              </View>
              <Text style={{ marginTop: 10 }}>RFID Tag Detected: 0</Text>
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
              Detected Asset
            </Text>

            <View style={{ width: '100%', backgroundColor: '#fff' }}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>RFID</DataTable.Title>
                  <DataTable.Title>Asset Name</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell>John</DataTable.Cell>
                  <DataTable.Cell>john@kindacode.com</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>Bob</DataTable.Cell>
                  <DataTable.Cell>test@test.com</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>Mei</DataTable.Cell>
                  <DataTable.Cell>mei@kindacode.com</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </View>
          </View>
        </View>
      }
    />
  );
};
