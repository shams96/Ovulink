import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { SpermTest } from '../../types';
import { colors } from '../../theme';

interface SpermQualityChartProps {
  spermTests: SpermTest[];
}

type MetricType = 'count' | 'motility' | 'morphology' | 'volume';

const SpermQualityChart: React.FC<SpermQualityChartProps> = ({ spermTests }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('count');
  
  // If no sperm test data, return placeholder
  if (!spermTests || spermTests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sperm Quality Trends</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No sperm test data available. Add test results to track your sperm quality over time.
          </Text>
        </View>
      </View>
    );
  }

  // Sort tests by date
  const sortedTests = [...spermTests].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Take the last 10 tests (or fewer if not available)
  const recentTests = sortedTests.slice(-10);

  // Prepare data for chart
  const labels = recentTests.map(test => format(new Date(test.date), 'MM/dd'));
  
  // Get data based on selected metric
  const getData = () => {
    switch (selectedMetric) {
      case 'count':
        return recentTests.map(test => test.count);
      case 'motility':
        return recentTests.map(test => test.motility);
      case 'morphology':
        return recentTests.map(test => test.morphology);
      case 'volume':
        return recentTests.map(test => test.volume);
      default:
        return recentTests.map(test => test.count);
    }
  };

  const data = getData();

  // Get reference ranges and units based on selected metric
  const getMetricInfo = () => {
    switch (selectedMetric) {
      case 'count':
        return {
          name: 'Sperm Count',
          unit: 'million/ml',
          normalRange: '15-200',
          lowThreshold: 15,
        };
      case 'motility':
        return {
          name: 'Motility',
          unit: '%',
          normalRange: '40-100',
          lowThreshold: 40,
        };
      case 'morphology':
        return {
          name: 'Normal Morphology',
          unit: '%',
          normalRange: '4-100',
          lowThreshold: 4,
        };
      case 'volume':
        return {
          name: 'Semen Volume',
          unit: 'ml',
          normalRange: '1.5-6',
          lowThreshold: 1.5,
        };
      default:
        return {
          name: 'Sperm Count',
          unit: 'million/ml',
          normalRange: '15-200',
          lowThreshold: 15,
        };
    }
  };

  const metricInfo = getMetricInfo();
  
  // Calculate average and latest value
  const average = data.reduce((sum, val) => sum + val, 0) / data.length;
  const latest = data[data.length - 1];
  
  // Determine if latest value is in normal range
  const isNormal = latest >= metricInfo.lowThreshold;

  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => colors.male,
        strokeWidth: 2,
      },
      // Add a dataset for the reference line
      {
        data: Array(data.length).fill(metricInfo.lowThreshold),
        color: (opacity = 1) => `rgba(255, 82, 82, ${opacity * 0.7})`,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: selectedMetric === 'volume' ? 1 : 0,
    color: (opacity = 1) => colors.text,
    labelColor: (opacity = 1) => colors.text,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.male,
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
      <Text style={styles.title}>Sperm Quality Trends</Text>
      
      <View style={styles.metricSelector}>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'count' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('count')}
        >
          <Text style={[styles.metricButtonText, selectedMetric === 'count' && styles.selectedMetricText]}>
            Count
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'motility' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('motility')}
        >
          <Text style={[styles.metricButtonText, selectedMetric === 'motility' && styles.selectedMetricText]}>
            Motility
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'morphology' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('morphology')}
        >
          <Text style={[styles.metricButtonText, selectedMetric === 'morphology' && styles.selectedMetricText]}>
            Morphology
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'volume' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('volume')}
        >
          <Text style={[styles.metricButtonText, selectedMetric === 'volume' && styles.selectedMetricText]}>
            Volume
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero={false}
          yAxisSuffix={selectedMetric === 'motility' || selectedMetric === 'morphology' ? '%' : ''}
          yAxisInterval={1}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{metricInfo.name}:</Text>
          <Text style={[styles.statValue, !isNormal && styles.abnormalValue]}>
            {latest} {metricInfo.unit}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average:</Text>
          <Text style={styles.statValue}>
            {average.toFixed(selectedMetric === 'volume' ? 1 : 0)} {metricInfo.unit}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Normal Range:</Text>
          <Text style={styles.statValue}>{metricInfo.normalRange} {metricInfo.unit}</Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.male }]} />
          <Text style={styles.legendText}>{metricInfo.name}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Minimum Threshold</Text>
        </View>
      </View>
      
      <Text style={styles.infoText}>
        Regular testing can help monitor your reproductive health. Consult a healthcare provider for significant changes.
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
  metricSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedMetric: {
    backgroundColor: colors.male,
  },
  metricButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedMetricText: {
    color: 'white',
    fontWeight: 'bold',
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
    color: colors.text,
  },
  abnormalValue: {
    color: colors.error,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
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

export default SpermQualityChart;
