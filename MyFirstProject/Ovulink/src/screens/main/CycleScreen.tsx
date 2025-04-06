import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../../store';
import { colors } from '../../theme';
import CalendarView from '../../components/CalendarView';
import TemperatureChart from '../../components/charts/TemperatureChart';
import CycleLengthChart from '../../components/charts/CycleLengthChart';
import SymptomsChart from '../../components/charts/SymptomsChart';
import { DateData } from 'react-native-calendars';

const CycleScreen: React.FC = () => {
  const { currentCycle, cycles } = useSelector((state: RootState) => state.cycle);
  const { logs } = useSelector((state: RootState) => state.dailyLog);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const userId = user?.id || '';
  
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cycle Tracking</Text>
      </View>

      <ScrollView style={styles.content}>
        <CalendarView 
          cycle={currentCycle}
          onDayPress={handleDayPress}
          selectedDate={selectedDate}
        />
        
        {currentCycle ? (
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleTitle}>Current Cycle</Text>
            <Text style={styles.cycleText}>
              Started on: {new Date(currentCycle.startDate).toLocaleDateString()}
            </Text>
            {currentCycle.predictedOvulationDate && (
              <Text style={styles.cycleText}>
                Predicted ovulation: {new Date(currentCycle.predictedOvulationDate).toLocaleDateString()}
              </Text>
            )}
            {currentCycle.predictedPeriodDate && (
              <Text style={styles.cycleText}>
                Next period: {new Date(currentCycle.predictedPeriodDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.emptyCycle}>
            <Text style={styles.emptyText}>
              No cycle data available. Start tracking your cycle to see predictions and insights.
            </Text>
          </View>
        )}

        <TemperatureChart cycle={currentCycle} />
        
        <CycleLengthChart cycles={cycles} />
        
        <SymptomsChart 
          cycle={currentCycle}
          logs={logs}
          userId={userId}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cycleInfo: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cycleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  cycleText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  emptyCycle: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  placeholderCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default CycleScreen;
