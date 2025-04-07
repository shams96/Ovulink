import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, SegmentedButtons, TextInput, HelperText, FAB, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format, addDays, parseISO } from 'date-fns';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * CycleTrackingScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - CycleTrackingScreen component
 */
const CycleTrackingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logType, setLogType] = useState('period');
  
  // Period tracking state
  const [periodData, setPeriodData] = useState({
    flow: 'medium', // 'light', 'medium', 'heavy'
    symptoms: [],
    notes: '',
  });
  
  // Symptoms options
  const symptomOptions = [
    { label: 'Cramps', value: 'cramps' },
    { label: 'Headache', value: 'headache' },
    { label: 'Bloating', value: 'bloating' },
    { label: 'Fatigue', value: 'fatigue' },
    { label: 'Mood Swings', value: 'mood_swings' },
    { label: 'Breast Tenderness', value: 'breast_tenderness' },
    { label: 'Backache', value: 'backache' },
    { label: 'Nausea', value: 'nausea' },
  ];
  
  // Placeholder data - in a real app, this would come from Redux
  const cycleData = {
    periodDates: {
      start: '2025-04-01',
      end: '2025-04-05',
    },
    fertileWindow: {
      start: '2025-04-10',
      end: '2025-04-16',
    },
    ovulationDate: '2025-04-14',
    nextPeriodDate: '2025-04-29',
    averageCycleLength: 28,
    averagePeriodLength: 5,
    logs: [
      {
        date: '2025-04-01',
        type: 'period',
        data: {
          flow: 'medium',
          symptoms: ['cramps', 'fatigue'],
          notes: 'First day of period',
        },
      },
      {
        date: '2025-04-02',
        type: 'period',
        data: {
          flow: 'heavy',
          symptoms: ['cramps', 'headache'],
          notes: '',
        },
      },
      {
        date: '2025-04-03',
        type: 'period',
        data: {
          flow: 'heavy',
          symptoms: ['fatigue'],
          notes: '',
        },
      },
      {
        date: '2025-04-04',
        type: 'period',
        data: {
          flow: 'medium',
          symptoms: [],
          notes: '',
        },
      },
      {
        date: '2025-04-05',
        type: 'period',
        data: {
          flow: 'light',
          symptoms: [],
          notes: 'Last day of period',
        },
      },
    ],
  };
  
  // Prepare calendar marking data
  const prepareMarkedDates = () => {
    const markedDates = {};
    
    // Mark period
    if (cycleData.periodDates.start && cycleData.periodDates.end) {
      // Mark start date
      if (markedDates[cycleData.periodDates.start]) {
        markedDates[cycleData.periodDates.start].periods = [
          {
            startingDay: true,
            color: theme.colors.period,
          },
        ];
      } else {
        markedDates[cycleData.periodDates.start] = {
          periods: [
            {
              startingDay: true,
              color: theme.colors.period,
            },
          ],
          dots: [],
        };
      }
      
      // Mark end date
      if (markedDates[cycleData.periodDates.end]) {
        markedDates[cycleData.periodDates.end].periods = [
          {
            endingDay: true,
            color: theme.colors.period,
          },
        ];
      } else {
        markedDates[cycleData.periodDates.end] = {
          periods: [
            {
              endingDay: true,
              color: theme.colors.period,
            },
          ],
          dots: [],
        };
      }
      
      // Mark days in between
      let currentDate = addDays(parseISO(cycleData.periodDates.start), 1);
      const end = parseISO(cycleData.periodDates.end);
      
      while (currentDate < end) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (markedDates[dateString]) {
          markedDates[dateString].periods = [
            {
              color: theme.colors.period,
            },
          ];
        } else {
          markedDates[dateString] = {
            periods: [
              {
                color: theme.colors.period,
              },
            ],
            dots: [],
          };
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    
    // Mark fertile window
    if (cycleData.fertileWindow.start && cycleData.fertileWindow.end) {
      // Mark start date
      if (markedDates[cycleData.fertileWindow.start]) {
        markedDates[cycleData.fertileWindow.start].periods = [
          ...(markedDates[cycleData.fertileWindow.start].periods || []),
          {
            startingDay: true,
            color: theme.colors.fertile,
          },
        ];
      } else {
        markedDates[cycleData.fertileWindow.start] = {
          periods: [
            {
              startingDay: true,
              color: theme.colors.fertile,
            },
          ],
          dots: [],
        };
      }
      
      // Mark end date
      if (markedDates[cycleData.fertileWindow.end]) {
        markedDates[cycleData.fertileWindow.end].periods = [
          ...(markedDates[cycleData.fertileWindow.end].periods || []),
          {
            endingDay: true,
            color: theme.colors.fertile,
          },
        ];
      } else {
        markedDates[cycleData.fertileWindow.end] = {
          periods: [
            {
              endingDay: true,
              color: theme.colors.fertile,
            },
          ],
          dots: [],
        };
      }
      
      // Mark days in between
      let currentDate = addDays(parseISO(cycleData.fertileWindow.start), 1);
      const end = parseISO(cycleData.fertileWindow.end);
      
      while (currentDate < end) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (markedDates[dateString]) {
          markedDates[dateString].periods = [
            ...(markedDates[dateString].periods || []),
            {
              color: theme.colors.fertile,
            },
          ];
        } else {
          markedDates[dateString] = {
            periods: [
              {
                color: theme.colors.fertile,
              },
            ],
            dots: [],
          };
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    
    // Mark ovulation date
    if (cycleData.ovulationDate) {
      if (markedDates[cycleData.ovulationDate]) {
        markedDates[cycleData.ovulationDate].dots.push({
          key: 'ovulation',
          color: theme.colors.ovulation,
        });
      } else {
        markedDates[cycleData.ovulationDate] = {
          dots: [
            {
              key: 'ovulation',
              color: theme.colors.ovulation,
            },
          ],
        };
      }
    }
    
    // Mark next period date
    if (cycleData.nextPeriodDate) {
      if (markedDates[cycleData.nextPeriodDate]) {
        markedDates[cycleData.nextPeriodDate].dots.push({
          key: 'next-period',
          color: theme.colors.period,
        });
      } else {
        markedDates[cycleData.nextPeriodDate] = {
          dots: [
            {
              key: 'next-period',
              color: theme.colors.period,
            },
          ],
        };
      }
    }
    
    // Mark logs
    cycleData.logs.forEach(log => {
      if (markedDates[log.date]) {
        markedDates[log.date].dots.push({
          key: `log-${log.type}`,
          color: log.type === 'period' ? theme.colors.period : theme.colors.primary,
        });
      } else {
        markedDates[log.date] = {
          dots: [
            {
              key: `log-${log.type}`,
              color: log.type === 'period' ? theme.colors.period : theme.colors.primary,
            },
          ],
        };
      }
    });
    
    // Mark selected date
    if (markedDates[selectedDate]) {
      markedDates[selectedDate].selected = true;
      markedDates[selectedDate].selectedColor = theme.colors.primary + '40';
    } else {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary + '40',
        dots: [],
      };
    }
    
    return markedDates;
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };
  
  const handleLogPeriod = () => {
    setLogType('period');
    setShowLogDialog(true);
  };
  
  const handleSaveLog = () => {
    // In a real app, this would dispatch an action to save the log
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowLogDialog(false);
      
      // Reset form
      setPeriodData({
        flow: 'medium',
        symptoms: [],
        notes: '',
      });
    }, 1000);
  };
  
  const toggleSymptom = (symptom) => {
    if (periodData.symptoms.includes(symptom)) {
      setPeriodData({
        ...periodData,
        symptoms: periodData.symptoms.filter(s => s !== symptom),
      });
    } else {
      setPeriodData({
        ...periodData,
        symptoms: [...periodData.symptoms, symptom],
      });
    }
  };
  
  // Get log for selected date
  const getSelectedDateLog = () => {
    return cycleData.logs.find(log => log.date === selectedDate);
  };
  
  const selectedDateLog = getSelectedDateLog();
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cycle Tracking</Text>
        </View>
        
        {/* Cycle Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Cycle Length</Text>
                <Text style={styles.summaryValue}>{cycleData.averageCycleLength} days</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Period Length</Text>
                <Text style={styles.summaryValue}>{cycleData.averagePeriodLength} days</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Next Period</Text>
                <Text style={styles.summaryValue}>{format(new Date(cycleData.nextPeriodDate), 'MMM d')}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Calendar */}
        <Card style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDateSelect}
            markingType="multi-period"
            markedDates={prepareMarkedDates()}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: theme.colors.textPrimary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.textPrimary,
              textDisabledColor: theme.colors.textSecondary,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.textPrimary,
              indicatorColor: theme.colors.primary,
            }}
          />
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.period }]} />
              <Text style={styles.legendText}>Period</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.fertile }]} />
              <Text style={styles.legendText}>Fertile Window</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.ovulation }]} />
              <Text style={styles.legendText}>Ovulation</Text>
            </View>
          </View>
        </Card>
        
        {/* Selected Date Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.detailsTitle}>
              {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </Text>
            
            {selectedDateLog ? (
              <View style={styles.logDetails}>
                {selectedDateLog.type === 'period' && (
                  <>
                    <View style={styles.flowContainer}>
                      <Text style={styles.flowLabel}>Flow:</Text>
                      <Chip
                        style={[
                          styles.flowChip,
                          {
                            backgroundColor:
                              selectedDateLog.data.flow === 'light'
                                ? theme.colors.period + '80'
                                : selectedDateLog.data.flow === 'medium'
                                ? theme.colors.period + 'B0'
                                : theme.colors.period,
                          },
                        ]}
                      >
                        {selectedDateLog.data.flow.charAt(0).toUpperCase() + selectedDateLog.data.flow.slice(1)}
                      </Chip>
                    </View>
                    
                    {selectedDateLog.data.symptoms.length > 0 && (
                      <View style={styles.symptomsContainer}>
                        <Text style={styles.symptomsLabel}>Symptoms:</Text>
                        <View style={styles.symptomsChips}>
                          {selectedDateLog.data.symptoms.map(symptom => (
                            <Chip
                              key={symptom}
                              style={styles.symptomChip}
                            >
                              {symptomOptions.find(opt => opt.value === symptom)?.label || symptom}
                            </Chip>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    {selectedDateLog.data.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{selectedDateLog.data.notes}</Text>
                      </View>
                    )}
                  </>
                )}
                
                <Button
                  mode="outlined"
                  onPress={handleLogPeriod}
                  style={styles.editLogButton}
                  icon="pencil"
                >
                  Edit Log
                </Button>
              </View>
            ) : (
              <View style={styles.noLogContainer}>
                <Text style={styles.noLogText}>No data logged for this date.</Text>
                <Button
                  mode="contained"
                  onPress={handleLogPeriod}
                  style={styles.logButton}
                  icon="plus"
                >
                  Log Period
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Related Tracking */}
        <Card style={styles.relatedCard}>
          <Card.Title title="Related Tracking" />
          <Card.Content>
            <View style={styles.relatedButtons}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Temperature')}
                style={styles.relatedButton}
                icon="thermometer"
              >
                Temperature
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('CervicalMucus')}
                style={styles.relatedButton}
                icon="water"
              >
                Cervical Mucus
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('OvulationPrediction')}
                style={styles.relatedButton}
                icon="chart-line"
              >
                Ovulation
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleLogPeriod}
        color="white"
      />
      
      {/* Log Period Dialog */}
      <Portal>
        <Dialog visible={showLogDialog} onDismiss={() => setShowLogDialog(false)}>
          <Dialog.Title>Log Period for {format(new Date(selectedDate), 'MMMM d, yyyy')}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSectionTitle}>Flow</Text>
            <SegmentedButtons
              value={periodData.flow}
              onValueChange={(value) => setPeriodData({ ...periodData, flow: value })}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'medium', label: 'Medium' },
                { value: 'heavy', label: 'Heavy' },
              ]}
              style={styles.flowButtons}
            />
            
            <Text style={styles.dialogSectionTitle}>Symptoms</Text>
            <View style={styles.symptomsChips}>
              {symptomOptions.map(symptom => (
                <Chip
                  key={symptom.value}
                  selected={periodData.symptoms.includes(symptom.value)}
                  onPress={() => toggleSymptom(symptom.value)}
                  style={styles.symptomChip}
                  selectedColor={theme.colors.primary}
                >
                  {symptom.label}
                </Chip>
              ))}
            </View>
            
            <Text style={styles.dialogSectionTitle}>Notes</Text>
            <TextInput
              value={periodData.notes}
              onChangeText={(text) => setPeriodData({ ...periodData, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveLog} loading={isLoading}>Save</Button>
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
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
  },
  summaryCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h6,
  },
  calendarCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    padding: spacing.sm,
    ...shadows.medium,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  flowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  flowLabel: {
    ...typography.subtitle1,
    marginRight: spacing.sm,
  },
  flowChip: {
    height: 30,
  },
  symptomsContainer: {
    marginBottom: spacing.sm,
  },
  symptomsLabel: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  symptomsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomChip: {
    margin: spacing.xs,
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
  relatedCard: {
    marginBottom: spacing.xl,
    borderRadius: 12,
    ...shadows.small,
  },
  relatedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedButton: {
    marginBottom: spacing.sm,
    width: '48%',
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  dialogSectionTitle: {
    ...typography.subtitle1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  flowButtons: {
    marginBottom: spacing.md,
  },
  notesInput: {
    marginTop: spacing.xs,
  },
});

export default CycleTrackingScreen;
