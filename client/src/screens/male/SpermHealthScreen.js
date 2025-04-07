import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Chip, SegmentedButtons, TextInput, FAB, Portal, Dialog, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * SpermHealthScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - SpermHealthScreen component
 */
const SpermHealthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoType, setInfoType] = useState('');
  
  // Sperm health tracking state
  const [spermData, setSpermData] = useState({
    count: '',
    motility: '',
    morphology: '',
    volume: '',
    notes: '',
  });
  const [errors, setErrors] = useState({
    count: '',
    motility: '',
    morphology: '',
    volume: '',
  });
  
  // Placeholder data - in a real app, this would come from Redux
  const spermLogs = [
    {
      date: '2025-04-01',
      count: 55,
      motility: 60,
      morphology: 15,
      volume: 3.5,
      notes: 'First test',
    },
    {
      date: '2025-03-01',
      count: 48,
      motility: 55,
      morphology: 12,
      volume: 3.2,
      notes: '',
    },
    {
      date: '2025-02-01',
      count: 40,
      motility: 50,
      morphology: 10,
      volume: 2.8,
      notes: 'After starting supplements',
    },
    {
      date: '2025-01-01',
      count: 35,
      motility: 45,
      morphology: 8,
      volume: 2.5,
      notes: 'Initial test',
    },
  ];
  
  // Get log for selected date
  const getSelectedDateLog = () => {
    return spermLogs.find(log => log.date === selectedDate);
  };
  
  const selectedDateLog = getSelectedDateLog();
  
  // Reference ranges
  const referenceRanges = {
    count: {
      unit: 'million/mL',
      low: 15,
      normal: 40,
      high: 200,
    },
    motility: {
      unit: '%',
      low: 40,
      normal: 50,
      high: 100,
    },
    morphology: {
      unit: '%',
      low: 4,
      normal: 15,
      high: 100,
    },
    volume: {
      unit: 'mL',
      low: 1.5,
      normal: 3.0,
      high: 6.0,
    },
  };
  
  const handleLogSperm = () => {
    setSpermData({
      count: selectedDateLog ? selectedDateLog.count.toString() : '',
      motility: selectedDateLog ? selectedDateLog.motility.toString() : '',
      morphology: selectedDateLog ? selectedDateLog.morphology.toString() : '',
      volume: selectedDateLog ? selectedDateLog.volume.toString() : '',
      notes: selectedDateLog ? selectedDateLog.notes : '',
    });
    setErrors({
      count: '',
      motility: '',
      morphology: '',
      volume: '',
    });
    setShowLogDialog(true);
  };
  
  const validateForm = () => {
    const newErrors = {
      count: '',
      motility: '',
      morphology: '',
      volume: '',
    };
    let isValid = true;
    
    // Validate count
    if (!spermData.count) {
      newErrors.count = 'Count is required';
      isValid = false;
    } else if (isNaN(parseFloat(spermData.count))) {
      newErrors.count = 'Count must be a number';
      isValid = false;
    } else if (parseFloat(spermData.count) < 0) {
      newErrors.count = 'Count cannot be negative';
      isValid = false;
    }
    
    // Validate motility
    if (!spermData.motility) {
      newErrors.motility = 'Motility is required';
      isValid = false;
    } else if (isNaN(parseFloat(spermData.motility))) {
      newErrors.motility = 'Motility must be a number';
      isValid = false;
    } else if (parseFloat(spermData.motility) < 0 || parseFloat(spermData.motility) > 100) {
      newErrors.motility = 'Motility must be between 0 and 100';
      isValid = false;
    }
    
    // Validate morphology
    if (!spermData.morphology) {
      newErrors.morphology = 'Morphology is required';
      isValid = false;
    } else if (isNaN(parseFloat(spermData.morphology))) {
      newErrors.morphology = 'Morphology must be a number';
      isValid = false;
    } else if (parseFloat(spermData.morphology) < 0 || parseFloat(spermData.morphology) > 100) {
      newErrors.morphology = 'Morphology must be between 0 and 100';
      isValid = false;
    }
    
    // Validate volume
    if (!spermData.volume) {
      newErrors.volume = 'Volume is required';
      isValid = false;
    } else if (isNaN(parseFloat(spermData.volume))) {
      newErrors.volume = 'Volume must be a number';
      isValid = false;
    } else if (parseFloat(spermData.volume) < 0) {
      newErrors.volume = 'Volume cannot be negative';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSaveSperm = () => {
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would dispatch an action to save the sperm log
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowLogDialog(false);
      
      // Reset form
      setSpermData({
        count: '',
        motility: '',
        morphology: '',
        volume: '',
        notes: '',
      });
    }, 1000);
  };
  
  const showInfo = (type) => {
    setInfoType(type);
    setShowInfoDialog(true);
  };
  
  const getInfoContent = () => {
    switch (infoType) {
      case 'count':
        return {
          title: 'Sperm Count',
          content: 'Sperm count refers to the number of sperm per milliliter of semen. A normal sperm count is 15 million/mL or higher. Low sperm count (oligospermia) is below 15 million/mL. Very low or no sperm count (azoospermia) can indicate fertility issues.',
        };
      case 'motility':
        return {
          title: 'Sperm Motility',
          content: 'Motility refers to the percentage of sperm that can move forward normally. At least 40% of sperm should be motile, with at least 32% showing progressive motility (moving in straight lines or large circles).',
        };
      case 'morphology':
        return {
          title: 'Sperm Morphology',
          content: 'Morphology refers to the percentage of sperm with a normal shape. Normal sperm have an oval head with a long tail. At least 4% of sperm should have normal morphology according to strict criteria.',
        };
      case 'volume':
        return {
          title: 'Semen Volume',
          content: 'Semen volume is the total amount of fluid ejaculated. Normal volume ranges from 1.5 to 6 milliliters per ejaculation. Low volume may indicate blockage or problems with the seminal vesicles.',
        };
      default:
        return {
          title: '',
          content: '',
        };
    }
  };
  
  const getStatusColor = (parameter, value) => {
    const range = referenceRanges[parameter];
    if (!range) return theme.colors.textSecondary;
    
    if (value < range.low) {
      return theme.colors.error;
    } else if (value > range.high) {
      return theme.colors.warning;
    } else {
      return theme.colors.success;
    }
  };
  
  const getStatusText = (parameter, value) => {
    const range = referenceRanges[parameter];
    if (!range) return '';
    
    if (value < range.low) {
      return 'Low';
    } else if (value > range.high) {
      return 'High';
    } else {
      return 'Normal';
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
          <Text style={styles.title}>Sperm Health</Text>
        </View>
        
        {/* Selected Date Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.detailsTitle}>
              {selectedDateLog
                ? format(parseISO(selectedDateLog.date), 'MMMM d, yyyy')
                : 'No Data Available'}
            </Text>
            
            {selectedDateLog ? (
              <View style={styles.logDetails}>
                <View style={styles.parametersContainer}>
                  <View style={styles.parameterItem}>
                    <View style={styles.parameterHeader}>
                      <Text style={styles.parameterLabel}>Count</Text>
                      <TouchableOpacity onPress={() => showInfo('count')}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.parameterValue, { color: getStatusColor('count', selectedDateLog.count) }]}>
                      {selectedDateLog.count} {referenceRanges.count.unit}
                    </Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor('count', selectedDateLog.count) + '40' },
                      ]}
                    >
                      {getStatusText('count', selectedDateLog.count)}
                    </Chip>
                  </View>
                  
                  <View style={styles.parameterItem}>
                    <View style={styles.parameterHeader}>
                      <Text style={styles.parameterLabel}>Motility</Text>
                      <TouchableOpacity onPress={() => showInfo('motility')}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.parameterValue, { color: getStatusColor('motility', selectedDateLog.motility) }]}>
                      {selectedDateLog.motility} {referenceRanges.motility.unit}
                    </Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor('motility', selectedDateLog.motility) + '40' },
                      ]}
                    >
                      {getStatusText('motility', selectedDateLog.motility)}
                    </Chip>
                  </View>
                </View>
                
                <View style={styles.parametersContainer}>
                  <View style={styles.parameterItem}>
                    <View style={styles.parameterHeader}>
                      <Text style={styles.parameterLabel}>Morphology</Text>
                      <TouchableOpacity onPress={() => showInfo('morphology')}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.parameterValue, { color: getStatusColor('morphology', selectedDateLog.morphology) }]}>
                      {selectedDateLog.morphology} {referenceRanges.morphology.unit}
                    </Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor('morphology', selectedDateLog.morphology) + '40' },
                      ]}
                    >
                      {getStatusText('morphology', selectedDateLog.morphology)}
                    </Chip>
                  </View>
                  
                  <View style={styles.parameterItem}>
                    <View style={styles.parameterHeader}>
                      <Text style={styles.parameterLabel}>Volume</Text>
                      <TouchableOpacity onPress={() => showInfo('volume')}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.parameterValue, { color: getStatusColor('volume', selectedDateLog.volume) }]}>
                      {selectedDateLog.volume} {referenceRanges.volume.unit}
                    </Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor('volume', selectedDateLog.volume) + '40' },
                      ]}
                    >
                      {getStatusText('volume', selectedDateLog.volume)}
                    </Chip>
                  </View>
                </View>
                
                {selectedDateLog.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{selectedDateLog.notes}</Text>
                  </View>
                )}
                
                <Button
                  mode="outlined"
                  onPress={handleLogSperm}
                  style={styles.editLogButton}
                  icon="pencil"
                >
                  Edit Log
                </Button>
              </View>
            ) : (
              <View style={styles.noLogContainer}>
                <Text style={styles.noLogText}>No sperm health data logged for this date.</Text>
                <Button
                  mode="contained"
                  onPress={handleLogSperm}
                  style={styles.logButton}
                  icon="plus"
                >
                  Log Sperm Health
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* History Card */}
        <Card style={styles.historyCard}>
          <Card.Title title="History" />
          <Card.Content>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
              {spermLogs.map((log) => (
                <TouchableOpacity
                  key={log.date}
                  style={[
                    styles.historyItem,
                    selectedDate === log.date && styles.selectedHistoryItem,
                  ]}
                  onPress={() => setSelectedDate(log.date)}
                >
                  <Text style={styles.historyDate}>
                    {format(parseISO(log.date), 'MMM d, yyyy')}
                  </Text>
                  <View style={styles.historyDetails}>
                    <View style={styles.historyDetail}>
                      <Text style={styles.historyDetailLabel}>Count:</Text>
                      <Text style={[styles.historyDetailValue, { color: getStatusColor('count', log.count) }]}>
                        {log.count}
                      </Text>
                    </View>
                    <View style={styles.historyDetail}>
                      <Text style={styles.historyDetailLabel}>Motility:</Text>
                      <Text style={[styles.historyDetailValue, { color: getStatusColor('motility', log.motility) }]}>
                        {log.motility}%
                      </Text>
                    </View>
                    <View style={styles.historyDetail}>
                      <Text style={styles.historyDetailLabel}>Morphology:</Text>
                      <Text style={[styles.historyDetailValue, { color: getStatusColor('morphology', log.morphology) }]}>
                        {log.morphology}%
                      </Text>
                    </View>
                    <View style={styles.historyDetail}>
                      <Text style={styles.historyDetailLabel}>Volume:</Text>
                      <Text style={[styles.historyDetailValue, { color: getStatusColor('volume', log.volume) }]}>
                        {log.volume} mL
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('SpermTrends')}
              style={styles.trendsButton}
              icon="chart-line"
            >
              View Trends
            </Button>
          </Card.Content>
        </Card>
        
        {/* Reference Ranges Card */}
        <Card style={styles.rangesCard}>
          <Card.Title title="Reference Ranges" />
          <Card.Content>
            <View style={styles.rangeItem}>
              <View style={styles.rangeHeader}>
                <Text style={styles.rangeTitle}>Sperm Count</Text>
                <TouchableOpacity onPress={() => showInfo('count')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.rangeValues}>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.error }]}>Low: &lt; {referenceRanges.count.low} {referenceRanges.count.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.success }]}>Normal: {referenceRanges.count.low}-{referenceRanges.count.high} {referenceRanges.count.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.warning }]}>High: &gt; {referenceRanges.count.high} {referenceRanges.count.unit}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.rangeItem}>
              <View style={styles.rangeHeader}>
                <Text style={styles.rangeTitle}>Motility</Text>
                <TouchableOpacity onPress={() => showInfo('motility')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.rangeValues}>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.error }]}>Low: &lt; {referenceRanges.motility.low} {referenceRanges.motility.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.success }]}>Normal: {referenceRanges.motility.low}-{referenceRanges.motility.high} {referenceRanges.motility.unit}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.rangeItem}>
              <View style={styles.rangeHeader}>
                <Text style={styles.rangeTitle}>Morphology</Text>
                <TouchableOpacity onPress={() => showInfo('morphology')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.rangeValues}>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.error }]}>Low: &lt; {referenceRanges.morphology.low} {referenceRanges.morphology.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.success }]}>Normal: {referenceRanges.morphology.low}-{referenceRanges.morphology.high} {referenceRanges.morphology.unit}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.rangeItem}>
              <View style={styles.rangeHeader}>
                <Text style={styles.rangeTitle}>Volume</Text>
                <TouchableOpacity onPress={() => showInfo('volume')}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.rangeValues}>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.error }]}>Low: &lt; {referenceRanges.volume.low} {referenceRanges.volume.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.success }]}>Normal: {referenceRanges.volume.low}-{referenceRanges.volume.high} {referenceRanges.volume.unit}</Text>
                </View>
                <View style={styles.rangeValue}>
                  <Text style={[styles.rangeValueText, { color: theme.colors.warning }]}>High: &gt; {referenceRanges.volume.high} {referenceRanges.volume.unit}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Title title="Sperm Health Tips" />
          <Card.Content>
            <View style={styles.tipItem}>
              <Ionicons name="nutrition-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Maintain a balanced diet rich in antioxidants, zinc, folate, and vitamins C and E to support sperm health.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="fitness-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Regular moderate exercise can improve sperm quality. However, excessive exercise may have the opposite effect.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="thermometer-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Avoid excessive heat to the testicles from hot tubs, saunas, or tight clothing, as heat can reduce sperm production.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Stay hydrated and limit alcohol consumption to maintain healthy semen volume and quality.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleLogSperm}
        color="white"
      />
      
      {/* Log Sperm Dialog */}
      <Portal>
        <Dialog visible={showLogDialog} onDismiss={() => setShowLogDialog(false)}>
          <Dialog.Title>
            Log Sperm Health for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.dialogScrollContent}>
              <View style={styles.dialogInputContainer}>
                <Text style={styles.dialogInputLabel}>Count (million/mL)</Text>
                <TextInput
                  value={spermData.count}
                  onChangeText={(text) => {
                    setSpermData({ ...spermData, count: text });
                    if (errors.count) setErrors({ ...errors, count: '' });
                  }}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.dialogInput}
                  error={!!errors.count}
                />
                {errors.count ? (
                  <HelperText type="error" visible={!!errors.count}>
                    {errors.count}
                  </HelperText>
                ) : null}
              </View>
              
              <View style={styles.dialogInputContainer}>
                <Text style={styles.dialogInputLabel}>Motility (%)</Text>
                <TextInput
                  value={spermData.motility}
                  onChangeText={(text) => {
                    setSpermData({ ...spermData, motility: text });
                    if (errors.motility) setErrors({ ...errors, motility: '' });
                  }}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.dialogInput}
                  error={!!errors.motility}
                />
                {errors.motility ? (
                  <HelperText type="error" visible={!!errors.motility}>
                    {errors.motility}
                  </HelperText>
                ) : null}
              </View>
              
              <View style={styles.dialogInputContainer}>
                <Text style={styles.dialogInputLabel}>Morphology (%)</Text>
                <TextInput
                  value={spermData.morphology}
                  onChangeText={(text) => {
                    setSpermData({ ...spermData, morphology: text });
                    if (errors.morphology) setErrors({ ...errors, morphology: '' });
                  }}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.dialogInput}
                  error={!!errors.morphology}
                />
                {errors.morphology ? (
                  <HelperText type="error" visible={!!errors.morphology}>
                    {errors.morphology}
                  </HelperText>
                ) : null}
              </View>
              
              <View style={styles.dialogInputContainer}>
                <Text style={styles.dialogInputLabel}>Volume (mL)</Text>
                <TextInput
                  value={spermData.volume}
                  onChangeText={(text) => {
                    setSpermData({ ...spermData, volume: text });
                    if (errors.volume) setErrors({ ...errors, volume: '' });
                  }}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.dialogInput}
                  error={!!errors.volume}
                />
                {errors.volume ? (
                  <HelperText type="error" visible={!!errors.volume}>
                    {errors.volume}
                  </HelperText>
                ) : null}
              </View>
              
              <View style={styles.dialogInputContainer}>
                <Text style={styles.dialogInputLabel}>Notes</Text>
                <TextInput
                  value={spermData.notes}
                  onChangeText={(text) => setSpermData({ ...spermData, notes: text })}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.dialogInput}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowLogDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveSperm} loading={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
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
  parametersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  parameterItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  parameterLabel: {
    ...typography.subtitle1,
    marginRight: spacing.xs,
  },
  parameterValue: {
    ...typography.h6,
    marginBottom: spacing.xs,
  },
  statusChip: {
    height: 24,
    alignSelf: 'flex-start',
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
  historyCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  historyScroll: {
    marginBottom: spacing.md,
  },
  historyItem: {
    width: 200,
    padding: spacing.md,
    marginRight: spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    ...shadows.small,
  },
  selectedHistoryItem: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  historyDate: {
    ...typography.subtitle1,
    marginBottom: spacing.sm,
  },
  historyDetails: {
    marginBottom: spacing.xs,
  },
  historyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  historyDetailLabel: {
    ...typography.body2,
  },
  historyDetailValue: {
    ...typography.body2,
    fontWeight: 'bold',
  },
  trendsButton: {
    marginTop: spacing.sm,
  },
  rangesCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  rangeItem: {
    marginBottom: spacing.md,
  },
  rangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rangeTitle: {
    ...typography.subtitle1,
    marginRight: spacing.xs,
  },
  rangeValues: {
    marginLeft: spacing.md,
  },
  rangeValue: {
    marginBottom: spacing.xs,
  },
  rangeValueText: {
    ...typography.body2,
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
  dialogScrollContent: {
    paddingVertical: spacing.md,
  },
  dialogInputContainer: {
    marginBottom: spacing.md,
  },
  dialogInputLabel: {
    ...typography.subtitle2,
    marginBottom: spacing.xs,
  },
  dialogInput: {
    marginBottom: spacing.xs,
  },
  dialogText: {
    ...typography.body1,
  },
});
