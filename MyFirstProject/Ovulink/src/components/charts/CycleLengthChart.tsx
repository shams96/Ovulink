import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { Cycle } from '../../types';
import { colors } from '../../theme';

interface CycleLengthChartProps {
  cycles: Cycle[];
}

const CycleLengthChart: React.FC<CycleLengthChartProps> = ({ cycles }) => {
  // If no cycles data, return placeholder
  if (!cycles || cycles.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cycle Length History</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Not enough cycle data available. At least two completed cycles are needed to show cycle length trends.
          </Text>
        </View>
      </View>
    );
  }

  // Filter completed cycles (those with an end date)
  const completedCycles = cycles.filter(cycle => cycle.endDate);
  
  if (completedCycles.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cycle Length History</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Not enough completed cycles. At least two completed cycles are needed to show cycle length trends.
          </Text>
        </View>
      </View>
    );
  }

  // Sort cycles by start date
  const sortedCycles = [...completedCycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Take the last 6 cycles (or fewer if not available)
  const recentCycles = sortedCycles.slice(-6);

  // Calculate cycle lengths
  const cycleLengths = recentCycles.map(cycle => {
    const startDate = new Date(cycle.startDate);
    const endDate = new Date(cycle.endDate as string);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  });

  // Prepare labels (month/year of cycle start)
  const labels = recentCycles.map(cycle => format(new Date(cycle.startDate), 'MM/yy'));

  // Calculate average cycle length
  const averageCycleLength = Math.round(
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: cycleLengths,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 139, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    barPercentage: 0.7,
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cycle Length History</Text>
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
          segments={5}
          yAxisLabel=""
          yAxisSuffix=" days"
        />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average Cycle Length:</Text>
          <Text style={styles.statValue}>{averageCycleLength} days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Shortest Cycle:</Text>
          <Text style={styles.statValue}>{Math.min(...cycleLengths)} days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Longest Cycle:</Text>
          <Text style={styles.statValue}>{Math.max(...cycleLengths)} days</Text>
        </View>
      </View>
      <Text style={styles.infoText}>
        A regular cycle length typically ranges from 21 to 35 days. Significant variations may be worth discussing with your healthcare provider.
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
  statsContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
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

export default CycleLengthChart;
