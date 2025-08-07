/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const lstPower = [
    {is: 1, name: '5 dbm (Short Range)', value: 5},
    {is: 2, name: '15 dbm', value: 15},
    {is: 3, name: '25 dbm (Recommended)', value: 25},
    {is: 4, name: '33 dbm (Long Range)', value: 33},
]

export const AlertModeScreen = () => {
    const [isWarningMode, setIsWarningMode] = useState(false);
    const [isSettingConnect, setIsSettingConnect] = useState(false);
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
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginVertical: 10,
                    }}
                >
                    Warning Mode
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
                    <Image
                        source={require('../../assets/img/warning-mode.png')}
                        style={{
                            width: '100%',
                            height: 350,
                            marginBottom: 10,
                            borderRadius: 10,
                        }}
                    />

                    <View style={{ width: '100%' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                textAlign: 'center',
                                color: '#333',
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Enable Warning Mode
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                                color: '#333',
                                marginBottom: 15,
                            }}
                        >
                            This mode will activate continuous scanning and alerting for unauthorized RFID tags.
                        </Text>
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
                        Connection
                    </Text>

                    <View style={{ width: '100%' }}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ marginBottom: 10 }}>Wifi name</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <TextInput
                                    placeholder="Enter wifi name"
                                    placeholderTextColor="#999"
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ marginBottom: 10 }}>Password</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <TextInput
                                    placeholder="Enter wifi password"
                                    placeholderTextColor="#999"
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                    }}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ marginBottom: 10 }}>Host</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <TextInput
                                    placeholder="Enter host address"
                                    placeholderTextColor="#999"
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                    }}
                                />
                            </View>
                        </View>
                        
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ marginBottom: 10 }}>Port</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <TextInput
                                    placeholder="Enter port"
                                    placeholderTextColor="#999"
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            width: '100%',
                            padding: 10,
                            backgroundColor: '#16a34a',
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            borderRadius: 10,
                        }}
                        onPress={() => { }}
                    >
                        {isSettingConnect ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>
                                    Connect
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
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
                                {lstPower.map(dbm => (
                                    <Picker.Item key={dbm.id} label={dbm.name} value={dbm.value} />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity
                            style={{
                                width: '100%',
                                padding: 10,
                                backgroundColor: '#dc2626',
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                borderRadius: 10,
                            }}
                            onPress={() => { }}
                        >
                            {isWarningMode ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="warning" size={20} color="white" style={{ marginRight: 5 }} />
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                                        Save Power Settings
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
