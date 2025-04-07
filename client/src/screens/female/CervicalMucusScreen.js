import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Chip, SegmentedButtons, TextInput, FAB, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * CervicalMucusScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - CervicalMucusScreen component
 */
const CervicalMucusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  
  // Cervical mucus tracking state
  const [mucusData, setMucusData] = useState({
    type: 'dry', // 'dry', 'sticky', 'creamy', 'watery', 'egg_white'
    feeling: 'dry', // 'dry', 'moist', 'wet', 'slippery'
    notes: '',
  });
  
  // Placeholder data - in a real app, this would come from Redux
  const mucusLogs = [
    {
      date: '2025-04-01',
      type: 'sticky',
      feeling: 'dry',
      notes: 'Period day 1',
    },
    {
      date: '2025-04-05',
      type: 'sticky',
      feeling: 'moist',
      notes: 'End of period',
    },
    {
      date: '2025-04-08',
      type: 'creamy',
      feeling: 'moist',
      notes: '',
    },
    {
      date: '2025-04-10',
      type: 'watery',
      feeling: 'wet',
      notes: 'Beginning of fertile window',
    },
    {
      date: '2025-04-12',
      type: 'egg_white',
      feeling: 'slippery',
      notes: 'Most fertile',
    },
    {
      date: '2025-04-14',
      type: 'egg_white',
      feeling: 'slippery',
      notes: 'Ovulation day',
    },
    {
      date: '2025-04-16',
      type: 'creamy',
      feeling: 'moist',
      notes: 'End of fertile window',
    },
    {
      date: '2025-04-20',
      type: 'sticky',
      feeling: 'dry',
      notes: '',
    },
  ];
  
  // Get log for selected date
  const getSelectedDateLog = () => {
    return mucusLogs.find(log => log.date === selectedDate);
  };
  
  const selectedDateLog = getSelectedDateLog();
  
  // Type descriptions and colors
  const mucusTypes = {
    dry: {
      title: 'Dry',
      description: 'No visible cervical mucus. Vagina feels dry.',
      fertility: 'Low fertility',
      color: '#E0E0E0', // Light gray
    },
    sticky: {
      title: 'Sticky',
      description: 'Thick, white, and crumbly. May feel sticky or pasty.',
      fertility: 'Low fertility',
      color: '#F5F5F5', // Off-white
    },
    creamy: {
      title: 'Creamy',
      description: 'Smooth and creamy, like lotion. White or yellowish in color.',
      fertility: 'Medium fertility',
      color: '#FFF9C4', // Light yellow
    },
    watery: {
      title: 'Watery',
      description: 'Clear, stretchy, and wet. Similar to egg white but less stretchy.',
      fertility: 'High fertility',
      color: '#E1F5FE', // Light blue
    },
    egg_white: {
      title: 'Egg White',
      description: 'Clear, slippery, and very stretchy. Can stretch several inches without breaking.',
      fertility: 'Peak fertility',
      color: '#E8F5E9', // Light green
    },
  };
  
  const handleLogMucus = () => {
    setMucusData({
      type: selectedDateLog ? selectedDateLog.type : 'dry',
      feeling: selectedDateLog ? selectedDateLog.feeling : 'dry',
      notes: selectedDateLog ? selectedDateLog.notes : '',
    });
    setShowLogDialog(true);
  };
  
  const handleSaveMucus = () => {
    // In a real app, this would dispatch an action to save the mucus log
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowLogDialog(false);
      
      // Reset form
      setMucusData({
        type: 'dry',
        feeling: 'dry',
        notes: '',
      });
    }, 1000);
  };
  
  const getTypeTitle = (type) => {
    return mucusTypes[type]?.title || type;
  };
  
  const getFeelingTitle = (feeling) => {
    switch (feeling) {
      case 'dry':
        return 'Dry';
      case 'moist':
        return 'Moist';
      case 'wet':
        return 'Wet';
      case 'slippery':
        return 'Slippery';
      default:
        return feeling;
    }
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
          <Text style={styles.title}>Cervical Mucus</Text>
        </View>
        
        {/* Selected Date Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.detailsTitle}>
              {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </Text>
            
            {selectedDateLog ? (
              <View style={styles.logDetails}>
                <View style={styles.typeContainer}>
                  <Text style={styles.typeLabel}>Type:</Text>
                  <Chip
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor:
                          selectedDateLog.type === 'dry' || selectedDateLog.type === 'sticky'
                            ? theme.colors.lowFertility
                            : selectedDateLog.type === 'creamy'
                            ? theme.colors.mediumFertility
                            : theme.colors.highFertility,
                      },
                    ]}
                  >
                    {getTypeTitle(selectedDateLog.type)}
                  </Chip>
                </View>
                
                <View style={styles.feelingContainer}>
                  <Text style={styles.feelingLabel}>Feeling:</Text>
                  <Chip style={styles.feelingChip}>
                    {getFeelingTitle(selectedDateLog.feeling)}
                  </Chip>
                </View>
                
                {selectedDateLog.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{selectedDateLog.notes}</Text>
                  </View>
                )}
                
                <Button
                  mode="outlined"
                  onPress={handleLogMucus}
                  style={styles.editLogButton}
                  icon="pencil"
                >
                  Edit Log
                </Button>
              </View>
            ) : (
              <View style={styles.noLogContainer}>
                <Text style={styles.noLogText}>No cervical mucus data logged for this date.</Text>
                <Button
                  mode="contained"
                  onPress={handleLogMucus}
                  style={styles.logButton}
                  icon="plus"
                >
                  Log Cervical Mucus
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Date Selection */}
        <Card style={styles.dateSelectionCard}>
          <Card.Content>
            <Text style={styles.dateSelectionTitle}>Recent Logs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {mucusLogs.map((log) => (
                <TouchableOpacity
                  key={log.date}
                  style={[
                    styles.dateItem,
                    selectedDate === log.date && styles.selectedDateItem,
                  ]}
                  onPress={() => setSelectedDate(log.date)}
                >
                  <Text style={styles.dateItemDay}>
                    {format(parseISO(log.date), 'd')}
                  </Text>
                  <Text style={styles.dateItemMonth}>
                    {format(parseISO(log.date), 'MMM')}
                  </Text>
                  <View
                    style={[
                      styles.dateItemIndicator,
                      {
                        backgroundColor:
                          log.type === 'dry' || log.type === 'sticky'
                            ? theme.colors.lowFertility
                            : log.type === 'creamy'
                            ? theme.colors.mediumFertility
                            : theme.colors.highFertility,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
        
        {/* Mucus Types Guide */}
        <Card style={styles.typesCard}>
          <Card.Title title="Cervical Mucus Types" />
          <Card.Content>
            {Object.entries(mucusTypes).map(([key, data]) => (
              <View key={key} style={styles.typeGuideItem}>
                <View style={styles.typeGuideHeader}>
                  <Text style={styles.typeGuideTitle}>{data.title}</Text>
                  <Chip
                    style={[
                      styles.fertilityChip,
                      {
                        backgroundColor:
                          key === 'dry' || key === 'sticky'
                            ? theme.colors.lowFertility
                            : key === 'creamy'
                            ? theme.colors.mediumFertility
                            : theme.colors.highFertility,
                      },
                    ]}
                  >
                    {data.fertility}
                  </Chip>
                </View>
                
                <View style={styles.typeGuideContent}>
                  <View 
                    style={[
                      styles.typeColorCircle, 
                      { backgroundColor: data.color }
                    ]} 
                  />
                  <Text style={styles.typeDescription}>{data.description}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        
        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Title title="Tracking Tips" />
          <Card.Content>
            <View style={styles.tipItem}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Check your cervical mucus at the same time each day for consistency.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Observe mucus before and after urination by wiping with toilet paper.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="finger-print-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Test elasticity by seeing if it stretches between your fingers without breaking.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Egg white cervical mucus typically appears 1-2 days before ovulation.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleLogMucus}
        color="white"
      />
      
      {/* Log Mucus Dialog */}
      <Portal>
        <Dialog visible={showLogDialog} onDismiss={() => setShowLogDialog(false)}>
          <Dialog.Title>
            Log Cervical Mucus for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSectionTitle}>Type</Text>
            <SegmentedButtons
              value={mucusData.type}
              onValueChange={(value) => setMucusData({ ...mucusData, type: value })}
              buttons={[
                { value: 'dry', label: 'Dry' },
                { value: 'sticky', label: 'Sticky' },
                { value: 'creamy', label: 'Creamy' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={mucusData.type}
              onValueChange={(value) => setMucusData({ ...mucusData, type: value })}
              buttons={[
                { value: 'watery', label: 'Watery' },
                { value: 'egg_white', label: 'Egg White' },
              ]}
              style={styles.segmentedButtons}
            />
            
            <Text style={styles.dialogSectionTitle}>Feeling</Text>
            <SegmentedButtons
              value={mucusData.feeling}
              onValueChange={(value) => setMucusData({ ...mucusData, feeling: value })}
              buttons={[
                { value: 'dry', label: 'Dry' },
                { value: 'moist', label: 'Moist' },
                { value: 'wet', label: 'Wet' },
                { value: 'slippery', label: 'Slippery' },
              ]}
              style={styles.segmentedButtons}
            />
            
            <Text style={styles.dialogSectionTitle}>Notes</Text>
            <TextInput
              value={mucusData.notes}
              onChangeText={(text) => setMucusData({ ...mucusData, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveMucus} loading={isLoading}>Save</Button>
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeLabel: {
    ...typography.subtitle1,
    marginRight: spacing.sm,
  },
  typeChip: {
    height: 30,
  },
  feelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  feelingLabel: {
    ...typography.subtitle1,
    marginRight: spacing.sm,
  },
  feelingChip: {
    height: 30,
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
  dateSelectionCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  dateSelectionTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
  },
  dateScroll: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    marginRight: spacing.sm,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    ...shadows.small,
  },
  selectedDateItem: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  dateItemDay: {
    ...typography.h6,
  },
  dateItemMonth: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  dateItemIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
  typesCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  typeGuideItem: {
    marginBottom: spacing.md,
  },
  typeGuideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeGuideTitle: {
    ...typography.subtitle1,
  },
  fertilityChip: {
    height: 24,
  },
  typeGuideContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeColorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeDescription: {
    ...typography.body2,
    flex: 1,
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
  dialogSectionTitle: {
    ...typography.subtitle1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  segmentedButtons: {
    marginBottom: spacing.sm,
  },
  notesInput: {
    marginTop: spacing.xs,
  },
});

export default CervicalMucusScreen;
