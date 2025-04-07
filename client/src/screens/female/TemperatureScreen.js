import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Button, TextInput, HelperText, FAB, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { format, addDays, subDays, parseISO } from 'date-fns';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

const { width } = Dimensions.get('window');

/**
 * TemperatureScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - TemperatureScreen component
 */
const TemperatureScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [temperatureData, setTemperatureData] = useState({
    temperature: '',
    time: format(new Date(), 'HH:mm'),
    notes: '',
  });
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'cycle'
  
  // Placeholder data - in a real app, this would come from Redux
  const bbtData = {
    logs: [
      { date: '2025-04-01', temperature: 36.5, time: '06:30', notes: '' },
      { date: '2025-04-02', temperature: 36.4, time: '06:45', notes: '' },
      { date: '2025-04-03', temperature: 36.5, time: '06:30', notes: '' },
      { date: '2025-04-04', temperature: 36.6, time: '06:15', notes: '' },
      { date: '2025-04-05', temperature: 36.5, time: '06:30', notes: '' },
      { date: '2025-04-06', temperature: 36.4, time: '06:30', notes: '' },
      { date: '2025-04-07', temperature: 36.5, time: '06:45', notes: '' },
      { date: '2025-04-08', temperature: 36.6, time: '06:30', notes: '' },
      { date: '2025-04-09', temperature: 36.7, time: '06:30', notes: '' },
      { date: '2025-04-10', temperature: 36.6, time: '06:15', notes: '' },
      { date: '2025-04-11', temperature: 36.7, time: '06:30', notes: '' },
      { date: '2025-04-12', temperature: 36.8, time: '06:30', notes: '' },
      { date: '2025-04-13', temperature: 36.9, time: '06:45', notes: '' },
      { date: '2025-04-14', temperature: 37.0, time: '06:30', notes: 'Possible ovulation' },
      { date: '2025-04-15', temperature: 37.1, time: '06:30', notes: '' },
      { date: '2025-04-16', temperature: 37.0, time: '06:15', notes: '' },
      { date: '2025-04-17', temperature: 37.1, time: '06:30', notes: '' },
      { date: '2025-04-18', temperature: 37.0, time: '06:30', notes: '' },
      { date: '2025-04-19', temperature: 37.1, time: '06:45', notes: '' },
      { date: '2025-04-20', temperature: 37.0, time: '06:30', notes: '' },
    ],
    cycleData: {
      periodDates: {
        start: '2025-04-01',
        end: '2025-04-05',
      },
      fertileWindow: {
        start: '2025-04-10',
        end: '2025-04-16',
      },
      ovulationDate: '2025-04-14',
    },
  };
  
  // Get log for selected date
  const getSelectedDateLog = () => {
    return bbtData.logs.find(log => log.date === selectedDate);
  };
  
  const selectedDateLog = getSelectedDateLog();
  
  // Prepare chart data
  const prepareChartData = () => {
    let startDate;
    let endDate = new Date();
    
    if (timeRange === 'week') {
      startDate = subDays(endDate, 7);
    } else if (timeRange === 'month') {
      startDate = subDays(endDate, 30);
    } else if (timeRange === 'cycle') {
      // Use current cycle data
      startDate = parseISO(bbtData.cycleData.periodDates.start);
      endDate = addDays(parseISO(bbtData.cycleData.periodDates.start), 28); // Assuming 28-day cycle
    }
    
    const filteredLogs = bbtData.logs.filter(log => {
      const logDate = parseISO(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
    
    // Sort logs by date
    filteredLogs.sort((a, b) => parseISO(a.date) - parseISO(b.date));
    
    const labels = filteredLogs.map(log => format(parseISO(log.date), 'MM/dd'));
    const temperatures = filteredLogs.map(log => log.temperature);
    
    // Add ovulation line
    const datasets = [
      {
        data: temperatures,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ];
    
    // Add coverline if in cycle view
    if (timeRange === 'cycle' && bbtData.cycleData.ovulationDate) {
      // Find pre-ovulation temperatures
      const ovulationIndex = filteredLogs.findIndex(log => log.date === bbtData.cycleData.ovulationDate);
      if (ovulationIndex > 0) {
        const preOvulationTemps = temperatures.slice(0, ovulationIndex);
        const coverlineTemp = Math.max(...preOvulationTemps) + 0.1;
        
        // Add coverline dataset
        datasets.push({
          data: Array(temperatures.length).fill(coverlineTemp),
          color: (opacity = 1) => theme.colors.ovulation,
          strokeWidth: 1,
          strokeDasharray: [5, 5],
        });
      }
    }
    
    return {
      labels,
      datasets,
    };
  };
  
  const handleLogTemperature = () => {
    setTemperatureData({
      temperature: selectedDateLog ? selectedDateLog.temperature.toString() : '',
      time: selectedDateLog ? selectedDateLog.time : format(new Date(), 'HH:mm'),
      notes: selectedDateLog ? selectedDateLog.notes : '',
    });
    setShowLogDialog(true);
  };
  
  const validateTemperature = (temp) => {
    if (!temp) {
      return 'Temperature is required';
    }
    
    const tempFloat = parseFloat(temp);
    if (isNaN(tempFloat)) {
      return 'Temperature must be a number';
    }
    
    if (tempFloat < 35 || tempFloat > 39) {
      return 'Temperature must be between 35°C and 39°C';
    }
    
    return '';
  };
  
  const handleSaveTemperature = () => {
    const validationError = validateTemperature(temperatureData.temperature);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // In a real app, this would dispatch an action to save the temperature log
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      setShowLogDialog(false);
      
      // Reset form
      setTemperatureData({
        temperature: '',
        time: format(new Date(), 'HH:mm'),
        notes: '',
      });
    }, 1000);
  };
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Basal Body Temperature</Text>
        </View>
        
        {/* Temperature Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Temperature Chart</Text>
              <View style={styles.timeRangeButtons}>
                <Button
                  mode={timeRange === 'week' ? 'contained' : 'text'}
                  onPress={() => setTimeRange('week')}
                  compact
                >
                  Week
                </Button>
                <Button
                  mode={timeRange === 'month' ? 'contained' : 'text'}
                  onPress={() => setTimeRange('month')}
                  compact
                >
                  Month
                </Button>
                <Button
                  mode={timeRange === 'cycle' ? 'contained' : 'text'}
                  onPress={() => setTimeRange('cycle')}
                  compact
                >
                  Cycle
                </Button>
              </View>
            </View>
            
            {bbtData.logs.length > 0 ? (
              <LineChart
                data={prepareChartData()}
                width={width - 2 * spacing.md - 2 * spacing.md}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.background,
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  decimalPlaces: 1,
                  color: (opacity = 1) => theme.colors.primary,
                  labelColor: (opacity = 1) => theme.colors.textPrimary,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: theme.colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
                fromZero={false}
                yAxisSuffix="°C"
                yAxisInterval={0.5}
                segments={4}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No temperature data available</Text>
              </View>
            )}
            
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Temperature</Text>
              </View>
              {timeRange === 'cycle' && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: theme.colors.ovulation }]} />
                  <Text style={styles.legendText}>Coverline</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
        
        {/* Selected Date Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.detailsTitle}>
              {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </Text>
            
            {selectedDateLog ? (
              <View style={styles.logDetails}>
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperatureLabel}>Temperature:</Text>
                  <Text style={styles.temperatureValue}>{selectedDateLog.temperature}°C</Text>
                </View>
                
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Time:</Text>
                  <Text style={styles.timeValue}>{selectedDateLog.time}</Text>
                </View>
                
                {selectedDateLog.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{selectedDateLog.notes}</Text>
                  </View>
                )}
                
                <Button
                  mode="outlined"
                  onPress={handleLogTemperature}
                  style={styles.editLogButton}
                  icon="pencil"
                >
                  Edit Log
                </Button>
              </View>
            ) : (
              <View style={styles.noLogContainer}>
                <Text style={styles.noLogText}>No temperature logged for this date.</Text>
                <Button
                  mode="contained"
                  onPress={handleLogTemperature}
                  style={styles.logButton}
                  icon="plus"
                >
                  Log Temperature
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Title title="BBT Tracking Tips" />
          <Card.Content>
            <View style={styles.tipItem}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Take your temperature at the same time each morning, before getting out of bed.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="bed-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Ensure you've had at least 3 hours of uninterrupted sleep before measuring.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="thermometer-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Use a basal thermometer that measures to 1/100th of a degree for accuracy.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="trending-up-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                A temperature rise of 0.2°C or more that stays elevated for 3 days indicates ovulation has occurred.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleLogTemperature}
        color="white"
      />
      
      {/* Log Temperature Dialog */}
      <Portal>
        <Dialog visible={showLogDialog} onDismiss={() => setShowLogDialog(false)}>
          <Dialog.Title>
            Log Temperature for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Temperature (°C)"
              value={temperatureData.temperature}
              onChangeText={(text) => {
                setTemperatureData({ ...temperatureData, temperature: text });
                setError('');
              }}
              mode="outlined"
              keyboardType="numeric"
              style={styles.dialogInput}
              error={!!error}
            />
            {error ? (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            ) : null}
            
            <TextInput
              label="Time"
              value={temperatureData.time}
              onChangeText={(text) => setTemperatureData({ ...temperatureData, time: text })}
              mode="outlined"
              style={styles.dialogInput}
              right={<TextInput.Icon icon="clock-outline" />}
            />
            
            <TextInput
              label="Notes"
              value={temperatureData.notes}
              onChangeText={(text) => setTemperatureData({ ...temperatureData, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveTemperature} loading={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h4,
  },
  chartCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.h5,
  },
  timeRangeButtons: {
    flexDirection: 'row',
  },
  chart: {
    marginVertical: spacing.md,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendLine: {
    width: 20,
    height: 2,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.caption,
  },
  detailsCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  detailsTitle: {
    ...typography.h5,
    marginBottom: spacing.md,
  },
  logDetails: {
    marginBottom: spacing.sm,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  temperatureLabel: {
    ...typography.subtitle1,
    marginRight: spacing.sm,
  },
  temperatureValue: {
    ...typography.h6,
    color: theme.colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeLabel: {
    ...typography.subtitle1,
    marginRight: spacing.sm,
  },
  timeValue: {
    ...typography.body1,
  },
  notesContainer: {
    marginBottom: spacing.md,
  },
  notesLabel: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.body2,
  },
  editLogButton: {
    marginTop: spacing.sm,
  },
  noLogContainer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  noLogText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  logButton: {
    borderRadius: 8,
  },
  tipsCard: {
    marginBottom: spacing.xl,
    borderRadius: 12,
    ...shadows.small,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  tipText: {
    ...typography.body2,
    flex: 1,
    marginLeft: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  dialogInput: {
    marginBottom: spacing.sm,
  },
});

export default TemperatureScreen;
