import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, addDays } from 'date-fns';
import { Cycle, CycleDay } from '../types';
import { colors } from '../theme';

interface CalendarViewProps {
  cycle: Cycle | null;
  onDayPress?: (day: DateData) => void;
  selectedDate?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  cycle, 
  onDayPress,
  selectedDate 
}) => {
  const [markedDates, setMarkedDates] = useState<any>({});
  
  useEffect(() => {
    if (!cycle) return;
    
    const newMarkedDates: any = {};
    
    // Mark period days
    if (cycle.days) {
      cycle.days.forEach(day => {
        if (day.menstruation && day.menstruation !== 'none') {
          const dotColor = day.menstruation === 'heavy' 
            ? colors.error 
            : day.menstruation === 'medium' 
              ? '#FF7F7F' 
              : '#FFC0CB';
          
          newMarkedDates[day.date] = {
            ...newMarkedDates[day.date],
            periods: {key: 'period', color: dotColor, selectedDotColor: 'white'},
          };
        }
        
        // Mark ovulation test positive days
        if (day.ovulationTest === 'positive') {
          newMarkedDates[day.date] = {
            ...newMarkedDates[day.date],
            dots: [...(newMarkedDates[day.date]?.dots || []), {key: 'ovulation', color: colors.success, selectedDotColor: 'white'}],
          };
        }
      });
    }
    
    // Mark predicted ovulation
    if (cycle.predictedOvulationDate) {
      const ovulationDate = cycle.predictedOvulationDate;
      
      // Mark fertile window (5 days before and 1 day after ovulation)
      for (let i = -5; i <= 1; i++) {
        const date = format(addDays(new Date(ovulationDate), i), 'yyyy-MM-dd');
        const isOvulationDay = i === 0;
        
        newMarkedDates[date] = {
          ...newMarkedDates[date],
          customStyles: {
            container: {
              backgroundColor: isOvulationDay ? colors.success : 'rgba(76, 175, 80, 0.2)',
              borderRadius: isOvulationDay ? 0 : 0,
            },
            text: {
              color: isOvulationDay ? 'white' : colors.text,
              fontWeight: isOvulationDay ? 'bold' : 'normal',
            }
          }
        };
      }
    }
    
    // Mark predicted period
    if (cycle.predictedPeriodDate) {
      const periodDate = cycle.predictedPeriodDate;
      
      // Mark predicted period (5 days)
      for (let i = 0; i < 5; i++) {
        const date = format(addDays(new Date(periodDate), i), 'yyyy-MM-dd');
        
        // Only mark future dates that don't already have period markings
        if (!newMarkedDates[date]?.periods) {
          newMarkedDates[date] = {
            ...newMarkedDates[date],
            customStyles: {
              container: {
                backgroundColor: 'rgba(255, 82, 82, 0.2)',
              },
              text: {
                color: colors.text,
              }
            }
          };
        }
      }
    }
    
    // Mark selected date
    if (selectedDate) {
      newMarkedDates[selectedDate] = {
        ...newMarkedDates[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    }
    
    setMarkedDates(newMarkedDates);
  }, [cycle, selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.text,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: '#d9e1e8',
          dotColor: colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          indicatorColor: colors.primary,
        }}
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]} />
          <Text style={styles.legendText}>Fertile Window</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 82, 82, 0.2)' }]} />
          <Text style={styles.legendText}>Predicted Period</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '48%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
  },
});

export default CalendarView;
