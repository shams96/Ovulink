import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Cycle, DailyLog } from '../../types';
import { colors } from '../../theme';

interface SymptomsChartProps {
  cycle: Cycle | null;
  logs: Record<string, DailyLog>;
  userId: string;
}

const SymptomsChart: React.FC<SymptomsChartProps> = ({ cycle, logs, userId }) => {
  // If no cycle data, return placeholder
  if (!cycle) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Symptoms Frequency</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No cycle data available. Start tracking your cycle to see symptom patterns.
          </Text>
        </View>
      </View>
    );
  }

  // Get all logs for the current user in the current cycle
  const userLogs = Object.values(logs).filter(log => 
    log.userId === userId && 
    new Date(log.date) >= new Date(cycle.startDate) && 
    (!cycle.endDate || new Date(log.date) <= new Date(cycle.endDate))
  );
  
  if (userLogs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Symptoms Frequency</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No symptom data available for this cycle. Log your symptoms daily to see patterns.
          </Text>
        </View>
      </View>
    );
  }

  // Count symptoms frequency
  const symptomsCount: Record<string, number> = {};
  userLogs.forEach(log => {
    if (log.symptoms && log.symptoms.length > 0) {
      log.symptoms.forEach(symptom => {
        symptomsCount[symptom] = (symptomsCount[symptom] || 0) + 1;
      });
    }
  });

  // If no symptoms logged, return placeholder
  if (Object.keys(symptomsCount).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Symptoms Frequency</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No symptoms have been logged for this cycle. Track your symptoms to see patterns.
          </Text>
        </View>
      </View>
    );
  }

  // Sort symptoms by frequency (descending)
  const sortedSymptoms = Object.entries(symptomsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // Take top 8 symptoms

  // Prepare data for chart
  const labels = sortedSymptoms.map(([symptom]) => {
    // Truncate long symptom names
    return symptom.length > 10 ? symptom.substring(0, 8) + '...' : symptom;
  });
  
  const data = sortedSymptoms.map(([_, count]) => count);

  const chartData = {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(124, 131, 253, ${opacity})`, // Using male color
    labelColor: (opacity = 1) => colors.text,
    barPercentage: 0.7,
    propsForLabels: {
      fontSize: 9,
      rotation: 45,
    },
  };

  // Calculate percentage of days each symptom occurred
  const totalDays = userLogs.length;
  const percentages = sortedSymptoms.map(([symptom, count]) => ({
    symptom,
    percentage: Math.round((count / totalDays) * 100),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptoms Frequency</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          segments={4}
          yAxisLabel=""
          yAxisSuffix=" days"
        />
      </View>
      
      <Text style={styles.subtitleText}>Percentage of Days with Symptom</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.percentageContainer}>
        {percentages.map(({ symptom, percentage }) => (
          <View key={symptom} style={styles.percentageItem}>
            <Text style={styles.percentageValue}>{percentage}%</Text>
            <Text style={styles.percentageLabel}>{symptom}</Text>
          </View>
        ))}
      </ScrollView>
      
      <Text style={styles.infoText}>
        Tracking symptoms consistently can help identify patterns related to your cycle and overall health.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 10,
    paddingRight: 20,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 15,
    marginBottom: 10,
  },
  percentageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  percentageItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  percentageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.male,
  },
  percentageLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  placeholderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SymptomsChart;
