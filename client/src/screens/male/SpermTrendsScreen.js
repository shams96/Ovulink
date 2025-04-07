import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { format, parseISO, subMonths } from 'date-fns';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

const { width } = Dimensions.get('window');

/**
 * SpermTrendsScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - SpermTrendsScreen component
 */
const SpermTrendsScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const [timeRange, setTimeRange] = useState('6months'); // '3months', '6months', '1year'
  const [chartType, setChartType] = useState('line'); // 'line', 'bar'
  
  // Placeholder data - in a real app, this would come from Redux
  const spermLogs = [
    {
      date: '2025-04-01',
      count: 55,
      motility: 60,
      morphology: 15,
      volume: 3.5,
    },
    {
      date: '2025-03-01',
      count: 48,
      motility: 55,
      morphology: 12,
      volume: 3.2,
    },
    {
      date: '2025-02-01',
      count: 40,
      motility: 50,
      morphology: 10,
      volume: 2.8,
    },
    {
      date: '2025-01-01',
      count: 35,
      motility: 45,
      morphology: 8,
      volume: 2.5,
    },
    {
      date: '2024-12-01',
      count: 30,
      motility: 40,
      morphology: 6,
      volume: 2.0,
    },
    {
      date: '2024-11-01',
      count: 25,
      motility: 35,
      morphology: 4,
      volume: 1.8,
    },
    {
      date: '2024-10-01',
      count: 20,
      motility: 30,
      morphology: 3,
      volume: 1.5,
    },
  ];
  
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
  
  // Filter logs based on time range
  const getFilteredLogs = () => {
    const now = new Date();
    let cutoffDate;
    
    if (timeRange === '3months') {
      cutoffDate = subMonths(now, 3);
    } else if (timeRange === '6months') {
      cutoffDate = subMonths(now, 6);
    } else if (timeRange === '1year') {
      cutoffDate = subMonths(now, 12);
    }
    
    return spermLogs.filter(log => parseISO(log.date) >= cutoffDate);
  };
  
  const filteredLogs = getFilteredLogs();
  
  // Prepare chart data
  const prepareChartData = (parameter) => {
    const logs = [...filteredLogs].reverse();
    const labels = logs.map(log => format(parseISO(log.date), 'MMM'));
    const values = logs.map(log => log[parameter]);
    
    // Add reference lines
    const datasets = [
      {
        data: values,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ];
    
    // Add low threshold line
    if (referenceRanges[parameter]?.low) {
      datasets.push({
        data: Array(values.length).fill(referenceRanges[parameter].low),
        color: (opacity = 1) => theme.colors.error + '80',
        strokeWidth: 1,
        strokeDasharray: [5, 5],
      });
    }
    
    // Add normal threshold line
    if (referenceRanges[parameter]?.normal) {
      datasets.push({
        data: Array(values.length).fill(referenceRanges[parameter].normal),
        color: (opacity = 1) => theme.colors.success + '80',
        strokeWidth: 1,
        strokeDasharray: [5, 5],
      });
    }
    
    return {
      labels,
      datasets,
    };
  };
  
  // Calculate improvement percentage
  const calculateImprovement = (parameter) => {
    if (filteredLogs.length < 2) return null;
    
    const oldest = filteredLogs[filteredLogs.length - 1][parameter];
    const newest = filteredLogs[0][parameter];
    
    const percentChange = ((newest - oldest) / oldest) * 100;
    return percentChange;
  };
  
  // Get status color
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
  
  // Get improvement color
  const getImprovementColor = (value) => {
    if (value > 10) {
      return theme.colors.success;
    } else if (value < -10) {
      return theme.colors.error;
    } else {
      return theme.colors.textSecondary;
    }
  };
  
  // Get latest values
  const getLatestValue = (parameter) => {
    if (filteredLogs.length === 0) return null;
    return filteredLogs[0][parameter];
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
          <Text style={styles.title}>Sperm Trends</Text>
        </View>
        
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.timeRangeLabel}>Time Range:</Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: '3months', label: '3 Months' },
              { value: '6months', label: '6 Months' },
              { value: '1year', label: '1 Year' },
            ]}
            style={styles.timeRangeButtons}
          />
        </View>
        
        {/* Chart Type Selector */}
        <View style={styles.chartTypeContainer}>
          <Text style={styles.chartTypeLabel}>Chart Type:</Text>
          <SegmentedButtons
            value={chartType}
            onValueChange={setChartType}
            buttons={[
              { value: 'line', label: 'Line', icon: 'chart-line' },
              { value: 'bar', label: 'Bar', icon: 'chart-bar' },
            ]}
            style={styles.chartTypeButtons}
          />
        </View>
        
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Title title="Current Status" />
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Count</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: getStatusColor('count', getLatestValue('count')) },
                  ]}
                >
                  {getLatestValue('count')} {referenceRanges.count.unit}
                </Text>
                {calculateImprovement('count') !== null && (
                  <Chip
                    style={[
                      styles.improvementChip,
                      {
                        backgroundColor:
                          getImprovementColor(calculateImprovement('count')) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.improvementText,
                        { color: getImprovementColor(calculateImprovement('count')) },
                      ]}
                    >
                      {calculateImprovement('count') > 0 ? '+' : ''}
                      {calculateImprovement('count').toFixed(1)}%
                    </Text>
                  </Chip>
                )}
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Motility</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: getStatusColor('motility', getLatestValue('motility')) },
                  ]}
                >
                  {getLatestValue('motility')} {referenceRanges.motility.unit}
                </Text>
                {calculateImprovement('motility') !== null && (
                  <Chip
                    style={[
                      styles.improvementChip,
                      {
                        backgroundColor:
                          getImprovementColor(calculateImprovement('motility')) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.improvementText,
                        { color: getImprovementColor(calculateImprovement('motility')) },
                      ]}
                    >
                      {calculateImprovement('motility') > 0 ? '+' : ''}
                      {calculateImprovement('motility').toFixed(1)}%
                    </Text>
                  </Chip>
                )}
              </View>
            </View>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Morphology</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: getStatusColor('morphology', getLatestValue('morphology')) },
                  ]}
                >
                  {getLatestValue('morphology')} {referenceRanges.morphology.unit}
                </Text>
                {calculateImprovement('morphology') !== null && (
                  <Chip
                    style={[
                      styles.improvementChip,
                      {
                        backgroundColor:
                          getImprovementColor(calculateImprovement('morphology')) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.improvementText,
                        { color: getImprovementColor(calculateImprovement('morphology')) },
                      ]}
                    >
                      {calculateImprovement('morphology') > 0 ? '+' : ''}
                      {calculateImprovement('morphology').toFixed(1)}%
                    </Text>
                  </Chip>
                )}
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Volume</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: getStatusColor('volume', getLatestValue('volume')) },
                  ]}
                >
                  {getLatestValue('volume')} {referenceRanges.volume.unit}
                </Text>
                {calculateImprovement('volume') !== null && (
                  <Chip
                    style={[
                      styles.improvementChip,
                      {
                        backgroundColor:
                          getImprovementColor(calculateImprovement('volume')) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.improvementText,
                        { color: getImprovementColor(calculateImprovement('volume')) },
                      ]}
                    >
                      {calculateImprovement('volume') > 0 ? '+' : ''}
                      {calculateImprovement('volume').toFixed(1)}%
                    </Text>
                  </Chip>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Count Chart */}
        <Card style={styles.chartCard}>
          <Card.Title title="Sperm Count Trend" />
          <Card.Content>
            {filteredLogs.length > 0 ? (
              chartType === 'line' ? (
                <LineChart
                  data={prepareChartData('count')}
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
                  yAxisSuffix=" M/mL"
                />
              ) : (
                <BarChart
                  data={{
                    labels: filteredLogs.map(log => format(parseISO(log.date), 'MMM')).reverse(),
                    datasets: [
                      {
                        data: filteredLogs.map(log => log.count).reverse(),
                      },
                    ],
                  }}
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
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  fromZero={false}
                  yAxisSuffix=" M/mL"
                />
              )
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data available for selected time range</Text>
              </View>
            )}
            
            <View style={styles.chartLegendContainer}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Count</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.error + '80' }]} />
                <Text style={styles.legendText}>Low Threshold ({referenceRanges.count.low} M/mL)</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.success + '80' }]} />
                <Text style={styles.legendText}>Normal Threshold ({referenceRanges.count.normal} M/mL)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Motility Chart */}
        <Card style={styles.chartCard}>
          <Card.Title title="Motility Trend" />
          <Card.Content>
            {filteredLogs.length > 0 ? (
              chartType === 'line' ? (
                <LineChart
                  data={prepareChartData('motility')}
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
                  yAxisSuffix="%"
                />
              ) : (
                <BarChart
                  data={{
                    labels: filteredLogs.map(log => format(parseISO(log.date), 'MMM')).reverse(),
                    datasets: [
                      {
                        data: filteredLogs.map(log => log.motility).reverse(),
                      },
                    ],
                  }}
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
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  fromZero={false}
                  yAxisSuffix="%"
                />
              )
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data available for selected time range</Text>
              </View>
            )}
            
            <View style={styles.chartLegendContainer}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Motility</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.error + '80' }]} />
                <Text style={styles.legendText}>Low Threshold ({referenceRanges.motility.low}%)</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.success + '80' }]} />
                <Text style={styles.legendText}>Normal Threshold ({referenceRanges.motility.normal}%)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Morphology Chart */}
        <Card style={styles.chartCard}>
          <Card.Title title="Morphology Trend" />
          <Card.Content>
            {filteredLogs.length > 0 ? (
              chartType === 'line' ? (
                <LineChart
                  data={prepareChartData('morphology')}
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
                  yAxisSuffix="%"
                />
              ) : (
                <BarChart
                  data={{
                    labels: filteredLogs.map(log => format(parseISO(log.date), 'MMM')).reverse(),
                    datasets: [
                      {
                        data: filteredLogs.map(log => log.morphology).reverse(),
                      },
                    ],
                  }}
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
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  fromZero={false}
                  yAxisSuffix="%"
                />
              )
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data available for selected time range</Text>
              </View>
            )}
            
            <View style={styles.chartLegendContainer}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Morphology</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.error + '80' }]} />
                <Text style={styles.legendText}>Low Threshold ({referenceRanges.morphology.low}%)</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.success + '80' }]} />
                <Text style={styles.legendText}>Normal Threshold ({referenceRanges.morphology.normal}%)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Volume Chart */}
        <Card style={styles.chartCard}>
          <Card.Title title="Volume Trend" />
          <Card.Content>
            {filteredLogs.length > 0 ? (
              chartType === 'line' ? (
                <LineChart
                  data={prepareChartData('volume')}
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
                  yAxisSuffix=" mL"
                />
              ) : (
                <BarChart
                  data={{
                    labels: filteredLogs.map(log => format(parseISO(log.date), 'MMM')).reverse(),
                    datasets: [
                      {
                        data: filteredLogs.map(log => log.volume).reverse(),
                      },
                    ],
                  }}
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
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  fromZero={false}
                  yAxisSuffix=" mL"
                />
              )
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data available for selected time range</Text>
              </View>
            )}
            
            <View style={styles.chartLegendContainer}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={styles.legendText}>Volume</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.error + '80' }]} />
                <Text style={styles.legendText}>Low Threshold ({referenceRanges.volume.low} mL)</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.colors.success + '80' }]} />
                <Text style={styles.legendText}>Normal Threshold ({referenceRanges.volume.normal} mL)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Analysis Card */}
        <Card style={styles.analysisCard}>
          <Card.Title title="Analysis" />
          <Card.Content>
            <Text style={styles.analysisText}>
              {filteredLogs.length > 1 ? (
                calculateImprovement('count') > 10 &&
                calculateImprovement('motility') > 10 &&
                calculateImprovement('morphology') > 10 ? (
                  "Your sperm health has shown significant improvement across all parameters. Continue with your current lifestyle changes and treatments."
                ) : calculateImprovement('count') < -10 ||
                  calculateImprovement('motility') < -10 ||
                  calculateImprovement('morphology') < -10 ? (
                  "Some parameters are showing a decline. Consider consulting with a healthcare provider to discuss potential causes and interventions."
                ) : (
                  "Your sperm health parameters are relatively stable. Maintain a healthy lifestyle with regular exercise, balanced diet, and stress management to support optimal fertility."
                )
              ) : (
                "More data points are needed to provide a meaningful trend analysis. Continue tracking your sperm health regularly."
              )}
            </Text>
            
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SpermHealth')}
              style={styles.logButton}
              icon="plus"
            >
              Log New Test
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
  timeRangeContainer: {
    marginBottom: spacing.md,
  },
  timeRangeLabel: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  timeRangeButtons: {
    marginBottom: spacing.sm,
  },
  chartTypeContainer: {
    marginBottom: spacing.md,
  },
  chartTypeLabel: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  chartTypeButtons: {
    marginBottom: spacing.sm,
  },
  summaryCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.subtitle2,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h5,
    marginBottom: spacing.xs,
  },
  improvementChip: {
    height: 24,
  },
  improvementText: {
    ...typography.caption,
    fontWeight: 'bold',
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
    flexDirection: 'column',
    marginTop: spacing.sm,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  analysisCard: {
    marginBottom: spacing.xl,
    borderRadius: 12,
    ...shadows.medium,
  },
  analysisText: {
    ...typography.body1,
    marginBottom: spacing.md,
  },
  logButton: {
    borderRadius: 8,
  },
});
