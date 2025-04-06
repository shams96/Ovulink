import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format, subDays } from 'date-fns';
import { Cycle } from '../../types';
import { colors } from '../../theme';

interface TemperatureChartProps {
  cycle: Cycle | null;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ cycle }) => {
  // If no cycle data, return placeholder
  if (!cycle || !cycle.days.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Basal Body Temperature</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No temperature data available. Record your temperature daily to see trends.
          </Text>
        </View>
      </View>
    );
  }

  // Filter days with temperature data
  const daysWithTemp = cycle.days.filter(day => day.temperature !== undefined);
  
  if (daysWithTemp.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Basal Body Temperature</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No temperature data available for this cycle. Record your temperature daily to see trends.
          </Text>
        </View>
      </View>
    );
  }

  // Sort days by date
  const sortedDays = [...daysWithTemp].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for chart
  const labels = sortedDays.map(day => format(new Date(day.date), 'MM/dd'));
  const temperatures = sortedDays.map(day => day.temperature || 0);

  // Calculate min and max for y-axis
  const minTemp = Math.min(...temperatures) - 0.1;
  const maxTemp = Math.max(...temperatures) + 0.1;

  // Determine if ovulation has occurred (simplified)
  const hasOvulation = cycle.predictedOvulationDate !== undefined;
  
  // Prepare vertical line for ovulation day if available
  let ovulationIndex = -1;
  if (hasOvulation && cycle.predictedOvulationDate) {
    const ovulationDate = cycle.predictedOvulationDate;
    ovulationIndex = sortedDays.findIndex(day => day.date === ovulationDate);
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: temperatures,
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
      // Add a dataset for the coverline if needed
      {
        data: Array(temperatures.length).fill(hasOvulation ? temperatures[ovulationIndex] : 0),
        color: (opacity = 1) => hasOvulation ? `rgba(76, 175, 80, ${opacity})` : 'transparent',
        strokeWidth: hasOvulation ? 1 : 0,
        strokeDashArray: [5, 5],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.text,
    labelColor: (opacity = 1) => colors.text,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basal Body Temperature</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero={false}
          yAxisSuffix="°F"
          yAxisInterval={0.5}
          segments={4}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          yLabelsOffset={10}
          hidePointsAtIndex={
            temperatures.map((_, index) => 
              index !== ovulationIndex && index % 2 !== 0 ? index : -1
            ).filter(i => i !== -1)
          }
        />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Temperature</Text>
        </View>
        {hasOvulation && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
        )}
      </View>
      <Text style={styles.infoText}>
        Track your basal body temperature daily, immediately upon waking, for the most accurate results.
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
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

export default TemperatureChart;
