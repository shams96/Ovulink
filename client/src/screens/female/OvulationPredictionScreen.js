import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Button, Chip, ProgressBar, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format, addDays, subDays, parseISO, differenceInDays } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

const { width } = Dimensions.get('window');

/**
 * OvulationPredictionScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - OvulationPredictionScreen component
 */
const OvulationPredictionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoType, setInfoType] = useState('');
  
  // Placeholder data - in a real app, this would come from Redux
  const cycleData = {
    currentCycle: {
      periodStart: '2025-04-01',
      periodEnd: '2025-04-05',
      fertileWindowStart: '2025-04-10',
      fertileWindowEnd: '2025-04-16',
      ovulationDate: '2025-04-14',
      nextPeriodStart: '2025-04-29',
    },
    cycleHistory: [
      {
        periodStart: '2025-03-04',
        periodEnd: '2025-03-08',
        cycleLength: 28,
        periodLength: 5,
      },
      {
        periodStart: '2025-02-05',
        periodEnd: '2025-02-09',
        cycleLength: 27,
        periodLength: 5,
      },
      {
        periodStart: '2025-01-07',
        periodEnd: '2025-01-12',
        cycleLength: 29,
        periodLength: 6,
      },
    ],
    averageCycleLength: 28,
    averagePeriodLength: 5,
    cycleVariation: 'regular', // 'regular', 'somewhat_irregular', 'irregular'
    predictionAccuracy: 0.85, // 0-1 scale
  };
  
  // Prepare calendar marking data
  const prepareMarkedDates = () => {
    const markedDates = {};
    const { currentCycle } = cycleData;
    
    // Mark period
    if (currentCycle.periodStart && currentCycle.periodEnd) {
      // Mark start date
      markedDates[currentCycle.periodStart] = {
        periods: [
          {
            startingDay: true,
            color: theme.colors.period,
          },
        ],
        dots: [],
      };
      
      // Mark end date
      markedDates[currentCycle.periodEnd] = {
        periods: [
          {
            endingDay: true,
            color: theme.colors.period,
          },
        ],
        dots: [],
      };
      
      // Mark days in between
      let currentDate = addDays(parseISO(currentCycle.periodStart), 1);
      const end = parseISO(currentCycle.periodEnd);
      
      while (currentDate < end) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        markedDates[dateString] = {
          periods: [
            {
              color: theme.colors.period,
            },
          ],
          dots: [],
        };
        currentDate = addDays(currentDate, 1);
      }
    }
    
    // Mark fertile window
    if (currentCycle.fertileWindowStart && currentCycle.fertileWindowEnd) {
      // Mark start date
      if (markedDates[currentCycle.fertileWindowStart]) {
        markedDates[currentCycle.fertileWindowStart].periods.push({
          startingDay: true,
          color: theme.colors.fertile,
        });
      } else {
        markedDates[currentCycle.fertileWindowStart] = {
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
      if (markedDates[currentCycle.fertileWindowEnd]) {
        markedDates[currentCycle.fertileWindowEnd].periods.push({
          endingDay: true,
          color: theme.colors.fertile,
        });
      } else {
        markedDates[currentCycle.fertileWindowEnd] = {
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
      let currentDate = addDays(parseISO(currentCycle.fertileWindowStart), 1);
      const end = parseISO(currentCycle.fertileWindowEnd);
      
      while (currentDate < end) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (markedDates[dateString]) {
          markedDates[dateString].periods.push({
            color: theme.colors.fertile,
          });
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
    if (currentCycle.ovulationDate) {
      if (markedDates[currentCycle.ovulationDate]) {
        markedDates[currentCycle.ovulationDate].dots.push({
          key: 'ovulation',
          color: theme.colors.ovulation,
        });
      } else {
        markedDates[currentCycle.ovulationDate] = {
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
    if (currentCycle.nextPeriodStart) {
      if (markedDates[currentCycle.nextPeriodStart]) {
        markedDates[currentCycle.nextPeriodStart].dots.push({
          key: 'next-period',
          color: theme.colors.period,
        });
      } else {
        markedDates[currentCycle.nextPeriodStart] = {
          dots: [
            {
              key: 'next-period',
              color: theme.colors.period,
            },
          ],
        };
      }
    }
    
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
  
  // Prepare cycle length chart data
  const prepareCycleLengthData = () => {
    const history = [...cycleData.cycleHistory].reverse();
    const labels = history.map((cycle, index) => `Cycle ${index + 1}`);
    const cycleLengths = history.map(cycle => cycle.cycleLength);
    
    return {
      labels,
      datasets: [
        {
          data: cycleLengths,
          color: (opacity = 1) => theme.colors.primary,
          strokeWidth: 2,
        },
        {
          data: Array(cycleLengths.length).fill(cycleData.averageCycleLength),
          color: (opacity = 1) => theme.colors.textSecondary,
          strokeWidth: 1,
          strokeDasharray: [5, 5],
        },
      ],
    };
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };
  
  const showInfo = (type) => {
    setInfoType(type);
    setShowInfoDialog(true);
  };
  
  const getInfoContent = () => {
    switch (infoType) {
      case 'ovulation':
        return {
          title: 'Ovulation',
          content: 'Ovulation is when your ovary releases an egg. This typically happens about 14 days before your next period starts. The egg can be fertilized for about 24 hours after ovulation.',
        };
      case 'fertile_window':
        return {
          title: 'Fertile Window',
          content: 'The fertile window is the time when pregnancy is possible. It includes the 5 days before ovulation and the day of ovulation. Sperm can survive up to 5 days in the female reproductive tract.',
        };
      case 'prediction_accuracy':
        return {
          title: 'Prediction Accuracy',
          content: 'Prediction accuracy is based on the regularity of your cycles and the amount of data available. More regular cycles and more historical data lead to more accurate predictions.',
        };
      default:
        return {
          title: '',
          content: '',
        };
    }
  };
  
  const getCycleStatus = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { currentCycle } = cycleData;
    
    if (today >= currentCycle.periodStart && today <= currentCycle.periodEnd) {
      return 'period';
    } else if (today >= currentCycle.fertileWindowStart && today <= currentCycle.fertileWindowEnd) {
      if (today === currentCycle.ovulationDate) {
        return 'ovulation';
      }
      return 'fertile';
    } else if (today > currentCycle.fertileWindowEnd && today < currentCycle.nextPeriodStart) {
      return 'luteal';
    } else {
      return 'follicular';
    }
  };
  
  const getCycleStatusText = () => {
    const status = getCycleStatus();
    switch (status) {
      case 'period':
        return 'You are on your period';
      case 'ovulation':
        return 'You are ovulating today';
      case 'fertile':
        return 'You are in your fertile window';
      case 'luteal':
        return 'You are in your luteal phase';
      case 'follicular':
        return 'You are in your follicular phase';
      default:
        return '';
    }
  };
  
  const getCycleStatusColor = () => {
    const status = getCycleStatus();
    switch (status) {
      case 'period':
        return theme.colors.period;
      case 'ovulation':
        return theme.colors.ovulation;
      case 'fertile':
        return theme.colors.fertile;
      case 'luteal':
        return theme.colors.luteal;
      case 'follicular':
        return theme.colors.follicular;
      default:
        return theme.colors.primary;
    }
  };
  
  const getDaysUntilNextEvent = () => {
    const today = new Date();
    const { currentCycle } = cycleData;
    
    if (format(today, 'yyyy-MM-dd') <= currentCycle.periodEnd) {
      // During period, next event is fertile window
      const daysUntil = differenceInDays(parseISO(currentCycle.fertileWindowStart), today);
      return {
        event: 'fertile window',
        days: daysUntil > 0 ? daysUntil : 0,
      };
    } else if (format(today, 'yyyy-MM-dd') < currentCycle.fertileWindowStart) {
      // Before fertile window
      const daysUntil = differenceInDays(parseISO(currentCycle.fertileWindowStart), today);
      return {
        event: 'fertile window',
        days: daysUntil,
      };
    } else if (format(today, 'yyyy-MM-dd') < currentCycle.ovulationDate) {
      // In fertile window, before ovulation
      const daysUntil = differenceInDays(parseISO(currentCycle.ovulationDate), today);
      return {
        event: 'ovulation',
        days: daysUntil,
      };
    } else if (format(today, 'yyyy-MM-dd') <= currentCycle.fertileWindowEnd) {
      // After ovulation, still in fertile window
      const daysUntil = differenceInDays(parseISO(currentCycle.nextPeriodStart), today);
      return {
        event: 'next period',
        days: daysUntil,
      };
    } else {
      // After fertile window
      const daysUntil = differenceInDays(parseISO(currentCycle.nextPeriodStart), today);
      return {
        event: 'next period',
        days: daysUntil,
      };
    }
  };
  
  const nextEvent = getDaysUntilNextEvent();
  
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
          <Text style={styles.title}>Ovulation Prediction</Text>
        </View>
        
        {/* Cycle Status Card */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Current Status</Text>
              <Chip
                style={[styles.statusChip, { backgroundColor: getCycleStatusColor() }]}
              >
                {getCycleStatusText()}
              </Chip>
            </View>
            
            <View style={styles.nextEventContainer}>
              <Text style={styles.nextEventText}>
                {nextEvent.days === 0
                  ? `Your ${nextEvent.event} is today`
                  : `${nextEvent.days} days until your ${nextEvent.event}`}
              </Text>
              <ProgressBar
                progress={1 - nextEvent.days / cycleData.averageCycleLength}
                color={getCycleStatusColor()}
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.predictionAccuracyContainer}>
              <View style={styles.predictionAccuracyHeader}>
                <Text style={styles.predictionAccuracyTitle}>Prediction Accuracy</Text>
                <TouchableOpacity onPress={() => showInfo('prediction_accuracy')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.predictionAccuracyContent}>
                <Text style={styles.predictionAccuracyValue}>
                  {Math.round(cycleData.predictionAccuracy * 100)}%
                </Text>
                <Text style={styles.predictionAccuracyDescription}>
                  {cycleData.cycleVariation === 'regular'
                    ? 'Your cycles are regular, leading to high prediction accuracy'
                    : cycleData.cycleVariation === 'somewhat_irregular'
                    ? 'Your cycles have some variation, affecting prediction accuracy'
                    : 'Your cycles are irregular, which may reduce prediction accuracy'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Calendar Card */}
        <Card style={styles.calendarCard}>
          <Card.Content>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Fertility Calendar</Text>
            </View>
            
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
          </Card.Content>
        </Card>
        
        {/* Key Dates Card */}
        <Card style={styles.datesCard}>
          <Card.Title title="Key Dates" />
          <Card.Content>
            <View style={styles.dateItem}>
              <View style={styles.dateItemHeader}>
                <Text style={styles.dateItemTitle}>Ovulation</Text>
                <TouchableOpacity onPress={() => showInfo('ovulation')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.dateItemValue}>
                {format(parseISO(cycleData.currentCycle.ovulationDate), 'MMMM d, yyyy')}
              </Text>
            </View>
            
            <View style={styles.dateItem}>
              <View style={styles.dateItemHeader}>
                <Text style={styles.dateItemTitle}>Fertile Window</Text>
                <TouchableOpacity onPress={() => showInfo('fertile_window')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.dateItemValue}>
                {format(parseISO(cycleData.currentCycle.fertileWindowStart), 'MMM d')} - {format(parseISO(cycleData.currentCycle.fertileWindowEnd), 'MMM d, yyyy')}
              </Text>
            </View>
            
            <View style={styles.dateItem}>
              <Text style={styles.dateItemTitle}>Next Period</Text>
              <Text style={styles.dateItemValue}>
                {format(parseISO(cycleData.currentCycle.nextPeriodStart), 'MMMM d, yyyy')}
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Cycle Length Chart */}
        <Card style={styles.chartCard}>
          <Card.Title title="Cycle Length History" />
          <Card.Content>
            {cycleData.cycleHistory.length > 0 ? (
              <LineChart
                data={prepareCycleLengthData()}
                width={width - 2 * spacing.md - 2 * spacing.md}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.background,
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  decimalPlaces: 0,
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
                yAxisSuffix=" days"
                yAxisInterval={1}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No cycle history available</Text>
              </View>
            )}
            
            <View style={styles.chartLegendContainer}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Cycle Length</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.textSecondary }]} />
                <Text style={styles.legendText}>Average ({cycleData.averageCycleLength} days)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Title title="Ovulation Tips" />
          <Card.Content>
            <View style={styles.tipItem}>
              <Ionicons name="thermometer-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Track your basal body temperature daily to confirm ovulation. A rise of 0.2°C or more indicates ovulation has occurred.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Monitor cervical mucus changes. Egg white-like mucus indicates high fertility.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="fitness-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Some women experience mild pelvic pain (mittelschmerz) during ovulation.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                The more regular your cycles, the more accurate the predictions will be.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Info Dialog */}
      <Portal>
        <Dialog visible={showInfoDialog} onDismiss={() => setShowInfoDialog(false)}>
          <Dialog.Title>{getInfoContent().title}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{getInfoContent().content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowInfoDialog(false)}>Close</Button>
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
  statusCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTitle: {
    ...typography.h5,
  },
  statusChip: {
    height: 30,
  },
  nextEventContainer: {
    marginBottom: spacing.md,
  },
  nextEventText: {
    ...typography.body1,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  predictionAccuracyContainer: {
    marginTop: spacing.md,
  },
  predictionAccuracyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  predictionAccuracyTitle: {
    ...typography.subtitle1,
    marginRight: spacing.xs,
  },
  predictionAccuracyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionAccuracyValue: {
    ...typography.h5,
    color: theme.colors.primary,
    marginRight: spacing.sm,
  },
  predictionAccuracyDescription: {
    ...typography.body2,
    flex: 1,
  },
  calendarCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  calendarHeader: {
    marginBottom: spacing.md,
  },
  calendarTitle: {
    ...typography.h5,
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
  legendLine: {
    width: 20,
    height: 2,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.caption,
  },
  datesCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  dateItem: {
    marginBottom: spacing.md,
  },
  dateItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateItemTitle: {
    ...typography.subtitle1,
    marginRight: spacing.xs,
  },
  dateItemValue: {
    ...typography.body1,
    color: theme.colors.primary,
  },
  chartCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
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
  chartLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
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
  dialogText: {
    ...typography.body1,
  },
});

export default OvulationPredictionScreen;
