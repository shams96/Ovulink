import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { RootState } from '../../store';
import { colors } from '../../theme';

const LogScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logs } = useSelector((state: RootState) => state.dailyLog);
  const isMale = user?.gender === 'male';
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
  
  // Get log for selected date if it exists
  const userId = user?.id || '';
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const dailyLog = logs[`${userId}-${dateString}`];
  
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Log</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <TouchableOpacity 
          onPress={handleNextDay}
          disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') 
              ? colors.neutral 
              : colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {dailyLog ? (
          <View style={styles.logContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sleep</Text>
              <View style={styles.sectionContent}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Duration:</Text>
                  <Text style={styles.dataValue}>{dailyLog.sleep.duration} hours</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Quality:</Text>
                  <Text style={styles.dataValue}>{dailyLog.sleep.quality}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Exercise</Text>
              <View style={styles.sectionContent}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Duration:</Text>
                  <Text style={styles.dataValue}>{dailyLog.exercise.duration} minutes</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Intensity:</Text>
                  <Text style={styles.dataValue}>{dailyLog.exercise.intensity}</Text>
                </View>
                {dailyLog.exercise.type && (
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Type:</Text>
                    <Text style={styles.dataValue}>{dailyLog.exercise.type}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.sectionContent}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Water:</Text>
                  <Text style={styles.dataValue}>{dailyLog.nutrition.water} glasses</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Alcohol:</Text>
                  <Text style={styles.dataValue}>{dailyLog.nutrition.alcohol} drinks</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Caffeine:</Text>
                  <Text style={styles.dataValue}>{dailyLog.nutrition.caffeine} servings</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Meal Quality:</Text>
                  <Text style={styles.dataValue}>{dailyLog.nutrition.mealQuality}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mood & Stress</Text>
              <View style={styles.sectionContent}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Mood:</Text>
                  <Text style={styles.dataValue}>{dailyLog.mood}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Stress Level:</Text>
                  <Text style={styles.dataValue}>{dailyLog.stress}</Text>
                </View>
              </View>
            </View>

            {dailyLog.supplements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Supplements</Text>
                <View style={styles.sectionContent}>
                  {dailyLog.supplements.map((supplement, index) => (
                    <Text key={index} style={styles.listItem}>{supplement}</Text>
                  ))}
                </View>
              </View>
            )}

            {dailyLog.symptoms.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Symptoms</Text>
                <View style={styles.sectionContent}>
                  {dailyLog.symptoms.map((symptom, index) => (
                    <Text key={index} style={styles.listItem}>{symptom}</Text>
                  ))}
                </View>
              </View>
            )}

            {dailyLog.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <View style={styles.sectionContent}>
                  <Text style={styles.notes}>{dailyLog.notes}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data logged for this day.</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.addButtonText}>Log Data for {format(selectedDate, 'MMM d')}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: colors.text,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  listItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    paddingLeft: 10,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default LogScreen;
