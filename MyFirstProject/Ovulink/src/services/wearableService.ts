import { Platform } from 'react-native';
import { DailyLog } from '../types';

// Supported wearable device types
export enum WearableDeviceType {
  TEMPERATURE_TRACKER = 'temperature_tracker',
  FITNESS_TRACKER = 'fitness_tracker',
  SLEEP_TRACKER = 'sleep_tracker',
  FERTILITY_MONITOR = 'fertility_monitor',
}

// Device connection status
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

// Device information
export interface WearableDevice {
  id: string;
  name: string;
  type: WearableDeviceType;
  manufacturer: string;
  model: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  lastSyncDate?: string;
  connectionStatus: ConnectionStatus;
}

// Device data
export interface WearableData {
  deviceId: string;
  timestamp: string;
  dataType: 'temperature' | 'heartRate' | 'steps' | 'sleep' | 'activity' | 'other';
  value: number | string | object;
  unit?: string;
}

// Mock devices for development
const mockDevices: WearableDevice[] = [
  {
    id: 'temp-tracker-001',
    name: 'Ava Bracelet',
    type: WearableDeviceType.TEMPERATURE_TRACKER,
    manufacturer: 'Ava',
    model: 'Bracelet 2.0',
    firmwareVersion: '3.1.2',
    batteryLevel: 78,
    lastSyncDate: new Date().toISOString(),
    connectionStatus: ConnectionStatus.DISCONNECTED,
  },
  {
    id: 'fitness-tracker-001',
    name: 'Fitbit Charge 5',
    type: WearableDeviceType.FITNESS_TRACKER,
    manufacturer: 'Fitbit',
    model: 'Charge 5',
    firmwareVersion: '1.2.0',
    batteryLevel: 65,
    lastSyncDate: new Date().toISOString(),
    connectionStatus: ConnectionStatus.DISCONNECTED,
  },
  {
    id: 'fertility-monitor-001',
    name: 'Tempdrop Sensor',
    type: WearableDeviceType.FERTILITY_MONITOR,
    manufacturer: 'Tempdrop',
    model: 'Sensor',
    firmwareVersion: '2.0.1',
    batteryLevel: 92,
    lastSyncDate: new Date().toISOString(),
    connectionStatus: ConnectionStatus.DISCONNECTED,
  },
];

// Store connected devices
let connectedDevices: WearableDevice[] = [];

// Check if Bluetooth is available
export const isBluetoothAvailable = async (): Promise<boolean> => {
  // In a real implementation, this would check if Bluetooth is available and enabled
  // For now, we'll just return true for iOS and Android
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// Request Bluetooth permissions
export const requestBluetoothPermissions = async (): Promise<boolean> => {
  // In a real implementation, this would request Bluetooth permissions
  // For now, we'll just return true
  return true;
};

// Scan for available devices
export const scanForDevices = async (): Promise<WearableDevice[]> => {
  // In a real implementation, this would scan for Bluetooth devices
  // For now, we'll return mock devices
  return mockDevices;
};

// Connect to a device
export const connectToDevice = async (deviceId: string): Promise<WearableDevice> => {
  // Find the device in the mock devices
  const device = mockDevices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }
  
  // Update the device's connection status
  const updatedDevice = {
    ...device,
    connectionStatus: ConnectionStatus.CONNECTED,
    lastSyncDate: new Date().toISOString(),
  };
  
  // Update the mock devices list
  const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
  mockDevices[deviceIndex] = updatedDevice;
  
  // Add to connected devices
  const existingIndex = connectedDevices.findIndex(d => d.id === deviceId);
  if (existingIndex >= 0) {
    connectedDevices[existingIndex] = updatedDevice;
  } else {
    connectedDevices.push(updatedDevice);
  }
  
  return updatedDevice;
};

// Disconnect from a device
export const disconnectFromDevice = async (deviceId: string): Promise<void> => {
  // Find the device in the mock devices
  const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
  
  if (deviceIndex >= 0) {
    // Update the device's connection status
    mockDevices[deviceIndex] = {
      ...mockDevices[deviceIndex],
      connectionStatus: ConnectionStatus.DISCONNECTED,
    };
  }
  
  // Remove from connected devices
  connectedDevices = connectedDevices.filter(d => d.id !== deviceId);
};

// Get connected devices
export const getConnectedDevices = (): WearableDevice[] => {
  return connectedDevices;
};

// Sync data from a device
export const syncDeviceData = async (deviceId: string): Promise<WearableData[]> => {
  // Find the device in the connected devices
  const device = connectedDevices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error(`Device with ID ${deviceId} is not connected`);
  }
  
  // Update the device's last sync date
  const deviceIndex = connectedDevices.findIndex(d => d.id === deviceId);
  connectedDevices[deviceIndex] = {
    ...device,
    lastSyncDate: new Date().toISOString(),
  };
  
  // Generate mock data based on device type
  const mockData: WearableData[] = [];
  const now = new Date();
  
  switch (device.type) {
    case WearableDeviceType.TEMPERATURE_TRACKER:
      // Generate temperature data for the last 24 hours
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - i);
        
        mockData.push({
          deviceId,
          timestamp: timestamp.toISOString(),
          dataType: 'temperature',
          value: 36.5 + (Math.random() * 0.8 - 0.4), // Random temperature between 36.1 and 36.9
          unit: '°C',
        });
      }
      break;
      
    case WearableDeviceType.FITNESS_TRACKER:
      // Generate heart rate and steps data
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - i);
        
        // Heart rate data
        mockData.push({
          deviceId,
          timestamp: timestamp.toISOString(),
          dataType: 'heartRate',
          value: 60 + Math.floor(Math.random() * 40), // Random heart rate between 60 and 100
          unit: 'bpm',
        });
        
        // Steps data
        mockData.push({
          deviceId,
          timestamp: timestamp.toISOString(),
          dataType: 'steps',
          value: Math.floor(Math.random() * 1000), // Random steps between 0 and 1000
          unit: 'steps',
        });
      }
      break;
      
    case WearableDeviceType.FERTILITY_MONITOR:
      // Generate temperature and other fertility data
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - i);
        
        // Temperature data
        mockData.push({
          deviceId,
          timestamp: timestamp.toISOString(),
          dataType: 'temperature',
          value: 36.5 + (Math.random() * 0.8 - 0.4), // Random temperature between 36.1 and 36.9
          unit: '°C',
        });
      }
      break;
      
    default:
      break;
  }
  
  return mockData;
};

// Convert wearable data to daily log format
export const convertToDailyLog = (
  data: WearableData[], 
  userId: string, 
  date: string
): Partial<DailyLog> => {
  // Filter data for the specified date
  const dateData = data.filter(d => {
    const dataDate = new Date(d.timestamp).toISOString().split('T')[0];
    return dataDate === date;
  });
  
  if (dateData.length === 0) {
    return {};
  }
  
  const partialLog: Partial<DailyLog> = {
    date,
    userId,
  };
  
  // Process temperature data
  const temperatureData = dateData.filter(d => d.dataType === 'temperature');
  if (temperatureData.length > 0) {
    // Use the earliest temperature reading of the day (typically morning)
    temperatureData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const morningTemp = temperatureData[0].value as number;
    
    // In a real app, you would add this to the cycle day data
    // For now, we'll just log it
    console.log(`Morning temperature for ${date}: ${morningTemp}°C`);
  }
  
  // Process heart rate data
  const heartRateData = dateData.filter(d => d.dataType === 'heartRate');
  if (heartRateData.length > 0) {
    // Calculate average heart rate
    const sum = heartRateData.reduce((acc, curr) => acc + (curr.value as number), 0);
    const avgHeartRate = sum / heartRateData.length;
    
    // In a real app, you would add this to the daily log
    console.log(`Average heart rate for ${date}: ${avgHeartRate.toFixed(0)} bpm`);
  }
  
  // Process steps data
  const stepsData = dateData.filter(d => d.dataType === 'steps');
  if (stepsData.length > 0) {
    // Calculate total steps
    const totalSteps = stepsData.reduce((acc, curr) => acc + (curr.value as number), 0);
    
    // Map to exercise data
    let intensity: 'none' | 'light' | 'moderate' | 'intense' = 'none';
    if (totalSteps > 10000) {
      intensity = 'intense';
    } else if (totalSteps > 7500) {
      intensity = 'moderate';
    } else if (totalSteps > 5000) {
      intensity = 'light';
    }
    
    partialLog.exercise = {
      duration: Math.round(totalSteps / 100), // Rough estimate: 100 steps per minute
      intensity,
      type: 'walking',
    };
  }
  
  // Process sleep data
  const sleepData = dateData.filter(d => d.dataType === 'sleep');
  if (sleepData.length > 0) {
    // In a real app, you would process sleep stages and quality
    // For now, we'll just use a mock value
    partialLog.sleep = {
      duration: 7.5, // Mock value
      quality: 'good', // Mock value
    };
  }
  
  return partialLog;
};

export default {
  isBluetoothAvailable,
  requestBluetoothPermissions,
  scanForDevices,
  connectToDevice,
  disconnectFromDevice,
  getConnectedDevices,
  syncDeviceData,
  convertToDailyLog,
};
