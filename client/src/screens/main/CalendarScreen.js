import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, FAB, Dialog, Portal, TextInput, HelperText, Checkbox } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, Agenda } from 'react-native-calendars';
import { format, parseISO, addDays } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * Calendar Screen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - Calendar Screen component
 */
const CalendarScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'agenda'
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showIntimacyDialog, setShowIntimacyDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    location: '',
    notes: '',
    isShared: true,
  });
  const [intimacyData, setIntimacyData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    isProtected: false,
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Placeholder data - in a real app, this would come from Redux
  const appointments = [
    { id: '1', title: 'Doctor Appointment', date: '2025-04-15', time: '14:30', location: '123 Medical Center', notes: 'Fertility consultation', isShared: true },
    { id: '2', title: 'Lab Test', date: '2025-04-20', time: '10:00', location: 'City Lab', notes: 'Hormone panel', isShared: true },
  ];
  
  const intimacyLogs = [
    { id: '1', date: '2025-04-10', time: '22:00', isProtected: false, notes: '' },
    { id: '2', date: '2025-04-12', time: '23:00', isProtected: false, notes: '' },
  ];
  
  const fertileWindow = {
    start: '2025-04-10',
    end: '2025-04-16',
  };
  
  const ovulationDate = '2025-04-14';
  const periodDates = {
    start: '2025-04-01',
    end: '2025-04-05',
  };
  const nextPeriodDate = '2025-04-29';
  
  // Prepare calendar marking data
  const prepareMarkedDates = () => {
    const markedDates = {};
    
    // Mark appointments
    appointments.forEach(appointment => {
      if (markedDates[appointment.date]) {
        markedDates[appointment.date].dots.push({
          key: `appointment-${appointment.id}`,
          color: theme.colors.primary,
        });
      } else {
        markedDates[appointment.date] = {
          dots: [
            {
              key: `appointment-${appointment.id}`,
              color: theme.colors.primary,
            },
          ],
        };
      }
    });
    
    // Mark intimacy logs
    intimacyLogs.forEach(log => {
      if (markedDates[log.date]) {
        markedDates[log.date].dots.push({
          key: `intimacy-${log.id}`,
          color: theme.colors.secondary,
        });
      } else {
        markedDates[log.date] = {
          dots: [
            {
              key: `intimacy-${log.id}`,
              color: theme.colors.secondary,
            },
          ],
        };
      }
    });
    
    // Mark period
    if (periodDates.start && periodDates.end) {
      // Mark start date
      if (markedDates[periodDates.start]) {
        markedDates[periodDates.start].periods = [
          {
            startingDay: true,
            color: theme.colors.period,
          },
        ];
      } else {
        markedDates[periodDates.start] = {
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
      if (markedDates[periodDates.end]) {
        markedDates[periodDates.end].periods = [
          {
            endingDay: true,
            color: theme.colors.period,
          },
        ];
      } else {
        markedDates[periodDates.end] = {
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
      let currentDate = addDays(parseISO(periodDates.start), 1);
      const end = parseISO(periodDates.end);
      
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
    if (fertileWindow.start && fertileWindow.end) {
      // Mark start date
      if (markedDates[fertileWindow.start]) {
        markedDates[fertileWindow.start].periods = [
          ...(markedDates[fertileWindow.start].periods || []),
          {
            startingDay: true,
            color: theme.colors.fertile,
          },
        ];
      } else {
        markedDates[fertileWindow.start] = {
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
      if (markedDates[fertileWindow.end]) {
        markedDates[fertileWindow.end].periods = [
          ...(markedDates[fertileWindow.end].periods || []),
          {
            endingDay: true,
            color: theme.colors.fertile,
          },
        ];
      } else {
        markedDates[fertileWindow.end] = {
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
      let currentDate = addDays(parseISO(fertileWindow.start), 1);
      const end = parseISO(fertileWindow.end);
      
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
    if (ovulationDate) {
      if (markedDates[ovulationDate]) {
        markedDates[ovulationDate].dots.push({
          key: 'ovulation',
          color: theme.colors.ovulation,
        });
      } else {
        markedDates[ovulationDate] = {
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
    if (nextPeriodDate) {
      if (markedDates[nextPeriodDate]) {
        markedDates[nextPeriodDate].dots.push({
          key: 'next-period',
          color: theme.colors.period,
        });
      } else {
        markedDates[nextPeriodDate] = {
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
  
  // Prepare agenda items
  const prepareAgendaItems = () => {
    const items = {};
    
    // Add appointments to items
    appointments.forEach(appointment => {
      if (!items[appointment.date]) {
        items[appointment.date] = [];
      }
      
      items[appointment.date].push({
        id: appointment.id,
        type: 'appointment',
        title: appointment.title,
        time: appointment.time,
        location: appointment.location,
        notes: appointment.notes,
        isShared: appointment.isShared,
      });
    });
    
    // Add intimacy logs to items
    intimacyLogs.forEach(log => {
      if (!items[log.date]) {
        items[log.date] = [];
      }
      
      items[log.date].push({
        id: log.id,
        type: 'intimacy',
        time: log.time,
        isProtected: log.isProtected,
        notes: log.notes,
      });
    });
    
    // Add fertility events
    if (ovulationDate) {
      if (!items[ovulationDate]) {
        items[ovulationDate] = [];
      }
      
      items[ovulationDate].push({
        id: 'ovulation',
        type: 'fertility',
        title: 'Ovulation Day',
        color: theme.colors.ovulation,
      });
    }
    
    if (fertileWindow.start) {
      if (!items[fertileWindow.start]) {
        items[fertileWindow.start] = [];
      }
      
      items[fertileWindow.start].push({
        id: 'fertile-start',
        type: 'fertility',
        title: 'Fertile Window Start',
        color: theme.colors.fertile,
      });
    }
    
    if (fertileWindow.end) {
      if (!items[fertileWindow.end]) {
        items[fertileWindow.end] = [];
      }
      
      items[fertileWindow.end].push({
        id: 'fertile-end',
        type: 'fertility',
        title: 'Fertile Window End',
        color: theme.colors.fertile,
      });
    }
    
    if (periodDates.start) {
      if (!items[periodDates.start]) {
        items[periodDates.start] = [];
      }
      
      items[periodDates.start].push({
        id: 'period-start',
        type: 'fertility',
        title: 'Period Start',
        color: theme.colors.period,
      });
    }
    
    if (periodDates.end) {
      if (!items[periodDates.end]) {
        items[periodDates.end] = [];
      }
      
      items[periodDates.end].push({
        id: 'period-end',
        type: 'fertility',
        title: 'Period End',
        color: theme.colors.period,
      });
    }
    
    if (nextPeriodDate) {
      if (!items[nextPeriodDate]) {
        items[nextPeriodDate] = [];
      }
      
      items[nextPeriodDate].push({
        id: 'next-period',
        type: 'fertility',
        title: 'Next Period (Predicted)',
        color: theme.colors.period,
      });
    }
    
    return items;
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };
  
  const handleAppointmentDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentData({
        ...appointmentData,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
  };
  
  const handleAppointmentTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAppointmentData({
        ...appointmentData,
        time: format(selectedTime, 'HH:mm'),
      });
    }
  };
  
  const handleIntimacyDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setIntimacyData({
        ...intimacyData,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
  };
  
  const handleIntimacyTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setIntimacyData({
        ...intimacyData,
        time: format(selectedTime, 'HH:mm'),
      });
    }
  };
  
  const handleSaveAppointment = () => {
    // Validate inputs
    if (!appointmentData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // In a real app, this would dispatch an action to save the appointment
    setTimeout(() => {
      setIsLoading(false);
      setShowAppointmentDialog(false);
      // Reset form
      setAppointmentData({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        location: '',
        notes: '',
        isShared: true,
      });
    }, 1000);
  };
  
  const handleSaveIntimacy = () => {
    setIsLoading(true);
    setError(null);
    
    // In a real app, this would dispatch an action to save the intimacy log
    setTimeout(() => {
      setIsLoading(false);
      setShowIntimacyDialog(false);
      // Reset form
      setIntimacyData({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        isProtected: false,
        notes: '',
      });
    }, 1000);
  };
  
  const renderAgendaItem = (item) => {
    if (item.type === 'appointment') {
      return (
        <Card style={styles.agendaItem}>
          <Card.Content>
            <View style={styles.agendaItemHeader}>
              <View style={styles.agendaItemType}>
                <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                <Text style={styles.agendaItemTypeText}>Appointment</Text>
              </View>
              {item.isShared && (
                <View style={styles.sharedBadge}>
                  <Ionicons name="people" size={12} color="white" />
                  <Text style={styles.sharedText}>Shared</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.agendaItemTitle}>{item.title}</Text>
            
            <View style={styles.agendaItemDetail}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.agendaItemDetailText}>{item.time}</Text>
            </View>
            
            {item.location ? (
              <View style={styles.agendaItemDetail}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.agendaItemDetailText}>{item.location}</Text>
              </View>
            ) : null}
            
            {item.notes ? (
              <View style={styles.agendaItemDetail}>
                <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.agendaItemDetailText}>{item.notes}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      );
    } else if (item.type === 'intimacy') {
      return (
        <Card style={styles.agendaItem}>
          <Card.Content>
            <View style={styles.agendaItemHeader}>
              <View style={styles.agendaItemType}>
                <Ionicons name="heart" size={16} color={theme.colors.secondary} />
                <Text style={styles.agendaItemTypeText}>Intimacy</Text>
              </View>
            </View>
            
            <View style={styles.agendaItemDetail}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.agendaItemDetailText}>{item.time}</Text>
            </View>
            
            <View style={styles.agendaItemDetail}>
              <Ionicons name="shield-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.agendaItemDetailText}>
                {item.isProtected ? 'Protected' : 'Unprotected'}
              </Text>
            </View>
            
            {item.notes ? (
              <View style={styles.agendaItemDetail}>
                <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.agendaItemDetailText}>{item.notes}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      );
    } else if (item.type === 'fertility') {
      return (
        <Card style={[styles.agendaItem, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
          <Card.Content>
            <View style={styles.agendaItemHeader}>
              <View style={styles.agendaItemType}>
                <Ionicons name="fitness" size={16} color={item.color} />
                <Text style={[styles.agendaItemTypeText, { color: item.color }]}>Fertility Event</Text>
              </View>
            </View>
            
            <Text style={styles.agendaItemTitle}>{item.title}</Text>
          </Card.Content>
        </Card>
      );
    }
    
    return null;
  };
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <Button
            mode={calendarView === 'month' ? 'contained' : 'outlined'}
            onPress={() => setCalendarView('month')}
            style={styles.toggleButton}
          >
            Month
          </Button>
          <Button
            mode={calendarView === 'agenda' ? 'contained' : 'outlined'}
            onPress={() => setCalendarView('agenda')}
            style={styles.toggleButton}
          >
            Agenda
          </Button>
        </View>
        
        {/* Calendar View */}
        {calendarView === 'month' ? (
          <ScrollView style={styles.scrollView}>
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
            
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Appointment</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
                <Text style={styles.legendText}>Intimacy</Text>
              </View>
            </View>
            
            {/* Selected Date Events */}
            <Card style={styles.eventsCard}>
              <Card.Content>
                <Text style={styles.eventsTitle}>
                  Events for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                </Text>
                
                {/* Appointments */}
                {appointments.filter(a => a.date === selectedDate).length > 0 ? (
                  <View style={styles.eventSection}>
                    <Text style={styles.eventSectionTitle}>Appointments</Text>
                    {appointments
                      .filter(a => a.date === selectedDate)
                      .map(appointment => (
                        <View key={appointment.id} style={styles.eventItem}>
                          <View style={styles.eventItemHeader}>
                            <Text style={styles.eventItemTitle}>{appointment.title}</Text>
                            {appointment.isShared && (
                              <View style={styles.sharedBadge}>
                                <Ionicons name="people" size={12} color="white" />
                                <Text style={styles.sharedText}>Shared</Text>
                              </View>
                            )}
                          </View>
                          
                          <View style={styles.eventItemDetail}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.eventItemDetailText}>{appointment.time}</Text>
                          </View>
                          
                          {appointment.location ? (
                            <View style={styles.eventItemDetail}>
                              <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                              <Text style={styles.eventItemDetailText}>{appointment.location}</Text>
                            </View>
                          ) : null}
                          
                          {appointment.notes ? (
                            <View style={styles.eventItemDetail}>
                              <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                              <Text style={styles.eventItemDetailText}>{appointment.notes}</Text>
                            </View>
                          ) : null}
                        </View>
                      ))}
                  </View>
                ) : null}
                
                {/* Intimacy Logs */}
                {intimacyLogs.filter(l => l.date === selectedDate).length > 0 ? (
                  <View style={styles.eventSection}>
                    <Text style={styles.eventSectionTitle}>Intimacy</Text>
                    {intimacyLogs
                      .filter(l => l.date === selectedDate)
                      .map(log => (
                        <View key={log.id} style={styles.eventItem}>
                          <View style={styles.eventItemDetail}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.eventItemDetailText}>{log.time}</Text>
                          </View>
                          
                          <View style={styles.eventItemDetail}>
                            <Ionicons name="shield-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.eventItemDetailText}>
                              {log.isProtected ? 'Protected' : 'Unprotected'}
                            </Text>
                          </View>
                          
                          {log.notes ? (
                            <View style={styles.eventItemDetail}>
                              <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                              <Text style={styles.eventItemDetailText}>{log.notes}</Text>
                            </View>
                          ) : null}
                        </View>
                      ))}
                  </View>
                ) : null}
                
                {/* Fertility Events */}
                {selectedDate === ovulationDate || 
                 selectedDate === fertileWindow.start || 
                 selectedDate === fertileWindow.end || 
                 selectedDate === periodDates.start || 
                 selectedDate === periodDates.end || 
                 selectedDate === nextPeriodDate ? (
                  <View style={styles.eventSection}>
                    <Text style={styles.eventSectionTitle}>Fertility Events</Text>
                    
                    {selectedDate === ovulationDate && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Ovulation Day</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedDate === fertileWindow.start && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Fertile Window Start</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedDate === fertileWindow.end && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Fertile Window End</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedDate === periodDates.start && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Period Start</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedDate === periodDates.end && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Period End</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedDate === nextPeriodDate && (
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemHeader}>
                          <Text style={styles.eventItemTitle}>Next Period (Predicted)</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : null}
                
                {appointments.filter(a => a.date === selectedDate).length === 0 &&
                 intimacyLogs.filter(l => l.date === selectedDate).length === 0 &&
                 selectedDate !== ovulationDate &&
                 selectedDate !== fertileWindow.start &&
                 selectedDate !== fertileWindow.end &&
                 selectedDate !== periodDates.start &&
                 selectedDate !== periodDates.end &&
                 selectedDate !== nextPeriodDate && (
                  <Text style={styles.noEventsText}>No events for this date</Text>
                )}
              </Card.Content>
            </Card>
          </ScrollView>
        ) : (
          <Agenda
            items={prepareAgendaItems()}
            selected={selectedDate}
            renderItem={renderAgendaItem}
            renderEmptyDate={() => (
              <View style={styles.emptyDate}>
                <Text style={styles.emptyDateText}>No events</Text>
              </View>
            )}
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
              agendaDayTextColor: theme.colors.textPrimary,
              agendaDayNumColor: theme.colors.textPrimary,
              agendaTodayColor: theme.colors.primary,
              agendaKnobColor: theme.colors.primary,
            }}
          />
        )}
      </View>
      
      {/* FAB */}
      <FAB.Group
        open={false}
        icon="plus"
        actions={[
          {
            icon: 'calendar',
            label: 'Add Appointment',
            onPress: () => setShowAppointmentDialog(true),
          },
          {
            icon: 'heart',
            label: 'Log Intimacy',
            onPress: () => setShowIntimacyDialog(true),
          },
        ]}
        fabStyle={{ backgroundColor: theme.colors.primary }}
      />
      
      {/* Appointment Dialog */}
      <Portal>
        <Dialog visible={showAppointmentDialog} onDismiss={() => setShowAppointmentDialog(false)}>
          <Dialog.Title>Add Appointment</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={appointmentData.title}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, title: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {format(new Date(appointmentData.date), 'MMMM d, yyyy')}
              </Text>
              <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={new Date(appointmentData.date)}
                mode="date"
                display="default"
                onChange={handleAppointmentDateChange}
              />
            )}
            
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {appointmentData.time}
              </Text>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={new Date(`${appointmentData.date}T${appointmentData.time}`)}
                mode="time"
                display="default"
                onChange={handleAppointmentTimeChange}
              />
            )}
            
            <TextInput
              label="Location"
              value={appointmentData.location}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, location: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            
            <TextInput
              label="Notes"
              value={appointmentData.notes}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
            
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={appointmentData.isShared ? 'checked' : 'unchecked'}
                onPress={() => setAppointmentData({ ...appointmentData, isShared: !appointmentData.isShared })}
              />
              <Text style={styles.checkboxLabel}>Share with partner</Text>
            </View>
            
            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAppointmentDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveAppointment} loading={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Intimacy Dialog */}
      <Portal>
        <Dialog visible={showIntimacyDialog} onDismiss={() => setShowIntimacyDialog(false)}>
          <Dialog.Title>Log Intimacy</Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {format(new Date(intimacyData.date), 'MMMM d, yyyy')}
              </Text>
              <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={new Date(intimacyData.date)}
                mode="date"
                display="default"
                onChange={handleIntimacyDateChange}
              />
            )}
            
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {intimacyData.time}
              </Text>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={new Date(`${intimacyData.date}T${intimacyData.time}`)}
                mode="time"
                display="default"
                onChange={handleIntimacyTimeChange}
              />
            )}
            
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={intimacyData.isProtected ? 'checked' : 'unchecked'}
                onPress={() => setIntimacyData({ ...intimacyData, isProtected: !intimacyData.isProtected })}
              />
              <Text style={styles.checkboxLabel}>Protected</Text>
            </View>
            
            <TextInput
              label="Notes"
              value={intimacyData.notes}
              onChangeText={(text) => setIntimacyData({ ...intimacyData, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowIntimacyDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveIntimacy} loading={isLoading}>Save</Button>
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
  },
  viewToggle: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: theme.colors.background,
    ...shadows.small,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
  eventsCard: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 12,
    ...shadows.medium,
  },
  eventsTitle: {
    ...typography.h5,
    marginBottom: spacing.md,
  },
  eventSection: {
    marginBottom: spacing.md,
  },
  eventSectionTitle: {
    ...typography.subtitle1,
    marginBottom: spacing.sm,
  },
  eventItem: {
    padding: spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  eventItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventItemTitle: {
    ...typography.subtitle1,
  },
  eventItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventItemDetailText: {
    ...typography.body2,
    marginLeft: spacing.xs,
  },
  noEventsText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  agendaItem: {
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    ...shadows.small,
  },
  agendaItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  agendaItemType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agendaItemTypeText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  agendaItemTitle: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  agendaItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  agendaItemDetailText: {
    ...typography.body2,
    marginLeft: spacing.xs,
  },
  emptyDate: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDateText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sharedText: {
    ...typography.caption,
    color: 'white',
    marginLeft: 2,
  },
  dialogInput: {
    marginBottom: spacing.sm,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  datePickerButtonText: {
    ...typography.subtitle1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkboxLabel: {
    ...typography.body2,
    marginLeft: spacing.xs,
  },
});

export default CalendarScreen;
