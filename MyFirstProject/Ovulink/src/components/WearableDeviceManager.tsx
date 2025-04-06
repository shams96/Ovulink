import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import wearableService, { WearableDevice, ConnectionStatus, WearableDeviceType } from '../services/wearableService';

interface WearableDeviceManagerProps {
  onDeviceConnected?: (device: WearableDevice) => void;
  onDeviceDisconnected?: (deviceId: string) => void;
  onDataSynced?: (deviceId: string) => void;
}

const WearableDeviceManager: React.FC<WearableDeviceManagerProps> = ({
  onDeviceConnected,
  onDeviceDisconnected,
  onDataSynced,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<WearableDevice[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [autoSync, setAutoSync] = useState(false);

  // Check Bluetooth availability and permissions on mount
  useEffect(() => {
    const checkBluetoothStatus = async () => {
      try {
        const isAvailable = await wearableService.isBluetoothAvailable();
        setBluetoothAvailable(isAvailable);
        
        if (isAvailable) {
          const hasPermissions = await wearableService.requestBluetoothPermissions();
          setPermissionsGranted(hasPermissions);
        }
      } catch (error) {
        console.error('Error checking Bluetooth status:', error);
      }
    };
    
    checkBluetoothStatus();
    
    // Get already connected devices
    setConnectedDevices(wearableService.getConnectedDevices());
  }, []);

  // Start scanning for devices
  const handleStartScan = async () => {
    if (!bluetoothAvailable || !permissionsGranted) {
      Alert.alert(
        'Bluetooth Not Available',
        'Please make sure Bluetooth is enabled and permissions are granted.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsScanning(true);
    
    try {
      const devices = await wearableService.scanForDevices();
      setAvailableDevices(devices);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices. Please try again.');
      console.error('Error scanning for devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a device
  const handleConnectDevice = async (deviceId: string) => {
    try {
      const device = await wearableService.connectToDevice(deviceId);
      
      // Update connected devices list
      setConnectedDevices(wearableService.getConnectedDevices());
      
      // Update available devices list
      setAvailableDevices(prevDevices => 
        prevDevices.map(d => d.id === deviceId ? device : d)
      );
      
      if (onDeviceConnected) {
        onDeviceConnected(device);
      }
      
      // Auto sync if enabled
      if (autoSync) {
        handleSyncData(deviceId);
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to the device. Please try again.');
      console.error('Error connecting to device:', error);
    }
  };

  // Disconnect from a device
  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await wearableService.disconnectFromDevice(deviceId);
      
      // Update connected devices list
      setConnectedDevices(wearableService.getConnectedDevices());
      
      // Update available devices list
      setAvailableDevices(prevDevices => 
        prevDevices.map(d => {
          if (d.id === deviceId) {
            return { ...d, connectionStatus: ConnectionStatus.DISCONNECTED };
          }
          return d;
        })
      );
      
      if (onDeviceDisconnected) {
        onDeviceDisconnected(deviceId);
      }
    } catch (error) {
      Alert.alert('Disconnection Error', 'Failed to disconnect from the device. Please try again.');
      console.error('Error disconnecting from device:', error);
    }
  };

  // Sync data from a device
  const handleSyncData = async (deviceId: string) => {
    setIsSyncing(deviceId);
    
    try {
      const data = await wearableService.syncDeviceData(deviceId);
      
      // Update connected devices list to reflect last sync date
      setConnectedDevices(wearableService.getConnectedDevices());
      
      if (onDataSynced) {
        onDataSynced(deviceId);
      }
      
      Alert.alert('Sync Complete', `Successfully synced data from device. ${data.length} data points retrieved.`);
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync data from the device. Please try again.');
      console.error('Error syncing data from device:', error);
    } finally {
      setIsSyncing(null);
    }
  };

  // Get device type icon
  const getDeviceTypeIcon = (type: WearableDeviceType) => {
    switch (type) {
      case WearableDeviceType.TEMPERATURE_TRACKER:
        return 'thermometer-outline' as const;
      case WearableDeviceType.FITNESS_TRACKER:
        return 'fitness-outline' as const;
      case WearableDeviceType.SLEEP_TRACKER:
        return 'bed-outline' as const;
      case WearableDeviceType.FERTILITY_MONITOR:
        return 'pulse-outline' as const;
      default:
        return 'hardware-chip-outline' as const;
    }
  };

  // Render a device item
  const renderDeviceItem = ({ item }: { item: WearableDevice }) => {
    const isConnected = item.connectionStatus === ConnectionStatus.CONNECTED;
    
    return (
      <View style={styles.deviceItem}>
        <View style={styles.deviceInfo}>
          <Ionicons 
            name={getDeviceTypeIcon(item.type)} 
            size={24} 
            color={isConnected ? colors.primary : colors.text} 
          />
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceModel}>{item.manufacturer} {item.model}</Text>
            {item.batteryLevel !== undefined && (
              <View style={styles.batteryInfo}>
                <Ionicons 
                  name={item.batteryLevel > 20 ? 'battery-half-outline' : 'battery-dead-outline'} 
                  size={14} 
                  color={item.batteryLevel > 20 ? colors.success : colors.error} 
                />
                <Text style={styles.batteryText}>{item.batteryLevel}%</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.deviceActions}>
          {isConnected ? (
            <>
              <TouchableOpacity 
                style={[styles.deviceButton, styles.syncButton]}
                onPress={() => handleSyncData(item.id)}
                disabled={isSyncing === item.id}
              >
                {isSyncing === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="sync" size={16} color="white" />
                    <Text style={styles.buttonText}>Sync</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.deviceButton, styles.disconnectButton]}
                onPress={() => handleDisconnectDevice(item.id)}
                disabled={isSyncing === item.id}
              >
                <Ionicons name="close-circle" size={16} color="white" />
                <Text style={styles.buttonText}>Disconnect</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.deviceButton, styles.connectButton]}
              onPress={() => handleConnectDevice(item.id)}
            >
              <Ionicons name="bluetooth" size={16} color="white" />
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wearable Devices</Text>
        <View style={styles.autoSyncContainer}>
          <Text style={styles.autoSyncText}>Auto Sync</Text>
          <Switch
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setAutoSync}
            value={autoSync}
          />
        </View>
      </View>
      
      {!bluetoothAvailable && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            Bluetooth is not available on this device. Wearable device integration requires Bluetooth.
          </Text>
        </View>
      )}
      
      {bluetoothAvailable && !permissionsGranted && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            Bluetooth permissions are required to connect to wearable devices.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={() => wearableService.requestBluetoothPermissions().then(setPermissionsGranted)}
          >
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleStartScan}
          disabled={isScanning || !bluetoothAvailable || !permissionsGranted}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="search" size={18} color="white" />
              <Text style={styles.scanButtonText}>Scan for Devices</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {connectedDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          <FlatList
            data={connectedDevices}
            renderItem={renderDeviceItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.deviceList}
          />
        </View>
      )}
      
      {availableDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Devices</Text>
          <FlatList
            data={availableDevices.filter(d => d.connectionStatus !== ConnectionStatus.CONNECTED)}
            renderItem={renderDeviceItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.deviceList}
          />
        </View>
      )}
      
      {!isScanning && availableDevices.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="bluetooth" size={48} color={colors.neutral} />
          <Text style={styles.emptyText}>
            No devices found. Tap "Scan for Devices" to search for nearby wearable devices.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  autoSyncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoSyncText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scanContainer: {
    padding: 15,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  deviceList: {
    paddingHorizontal: 15,
  },
  deviceItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  deviceInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  deviceDetails: {
    flex: 1,
    marginLeft: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  deviceModel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 5,
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 5,
  },
  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deviceButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  connectButton: {
    backgroundColor: colors.primary,
  },
  syncButton: {
    backgroundColor: colors.info,
  },
  disconnectButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: colors.text,
    opacity: 0.7,
  },
});

export default WearableDeviceManager;
