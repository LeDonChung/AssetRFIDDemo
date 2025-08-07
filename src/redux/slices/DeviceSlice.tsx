import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device } from 'react-native-ble-plx';
import { MODES } from '../../utils/Mode';

interface DeviceInfoState {
  id?: string;
  temperature?: number;
  firmware: string;
  currentMode: {
    id?: number;
    name?: string;
    code?: string;
  };
  power?: number;
}
const initialState: { deviceInfo: DeviceInfoState; device: Device } = {
  deviceInfo: {
    id: 'RFID-001',
    temperature: 25,
    firmware: '8.2',
    currentMode: MODES[0],
    power: 5,
  },
  device: {} as Device,
};

export const DeviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDeviceInfo: (state, action: PayloadAction<Partial<DeviceInfoState>>) => {
      state.deviceInfo = { ...state.deviceInfo, ...action.payload };
    },
    setDevice: (state, action: PayloadAction<Device>) => {
      state.device = action.payload;
    },
  },
});

export const { setDeviceInfo, setDevice } = DeviceSlice.actions;

export default DeviceSlice.reducer;
