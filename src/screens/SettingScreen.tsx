/* eslint-disable react-native/no-inline-styles */
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

    const handlerSelectDevice = (device: any) => {
        setSelectedDevice(device);
        setIsConnected(true);
        setLogs(prevLogs => [
            {
                id: `log-${prevLogs.length + 1}`,
                message: `Connected to ${device.name}`,
                timestamp: new Date().toLocaleTimeString(),
            },
            ...prevLogs,
        ]);
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
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                style={{
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginVertical: 10,
                    }}
                >
                    Setting Device
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
                                onPress={handlerSelectDevice}
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
                                <Text style={{ color: '#4f46e5' }}>{item?.name}</Text>
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
