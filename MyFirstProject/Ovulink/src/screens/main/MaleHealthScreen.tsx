import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { colors } from '../../theme';
import SpermQualityChart from '../../components/charts/SpermQualityChart';

const MaleHealthScreen: React.FC = () => {
  const { spermTests } = useSelector((state: RootState) => state.maleHealth);
  const { logs } = useSelector((state: RootState) => state.dailyLog);
  const { user } = useSelector((state: RootState) => state.auth);

  const hasSpermTests = spermTests.length > 0;
  const userId = user?.id || '';
  
  // Get the most recent log for the current user
  const userLogs = Object.values(logs).filter(log => log.userId === userId);
  const latestLog = userLogs.length > 0 
    ? userLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Male Fertility</Text>
      </View>

      <ScrollView style={styles.content}>
        <SpermQualityChart spermTests={spermTests} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Test Results</Text>
          {hasSpermTests ? (
            <View style={styles.spermTestCard}>
              <Text style={styles.testDate}>
                Date: {new Date(spermTests[0].date).toLocaleDateString()}
              </Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Count:</Text>
                <Text style={styles.resultValue}>{spermTests[0].count} million/ml</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Motility:</Text>
                <Text style={styles.resultValue}>{spermTests[0].motility}%</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Morphology:</Text>
                <Text style={styles.resultValue}>{spermTests[0].morphology}%</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Volume:</Text>
                <Text style={styles.resultValue}>{spermTests[0].volume} ml</Text>
              </View>
              
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.addButtonText}>Add New Test Results</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No sperm test results available. Add your first test to track your sperm health over time.
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Test Results</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle Factors</Text>
          {latestLog ? (
            <View style={styles.lifestyleCard}>
              <Text style={styles.cardTitle}>Today's Log</Text>
              <View style={styles.factorRow}>
                <Ionicons name="bed-outline" size={24} color={colors.text} />
                <View style={styles.factorInfo}>
                  <Text style={styles.factorLabel}>Sleep</Text>
                  <Text style={styles.factorValue}>
                    {latestLog.sleep.duration} hours ({latestLog.sleep.quality})
                  </Text>
                </View>
              </View>
              <View style={styles.factorRow}>
                <Ionicons name="fitness-outline" size={24} color={colors.text} />
                <View style={styles.factorInfo}>
                  <Text style={styles.factorLabel}>Exercise</Text>
                  <Text style={styles.factorValue}>
                    {latestLog.exercise.duration} min ({latestLog.exercise.intensity})
                  </Text>
                </View>
              </View>
              <View style={styles.factorRow}>
                <Ionicons name="water-outline" size={24} color={colors.text} />
                <View style={styles.factorInfo}>
                  <Text style={styles.factorLabel}>Hydration</Text>
                  <Text style={styles.factorValue}>
                    {latestLog.nutrition.water} glasses
                  </Text>
                </View>
              </View>
              <View style={styles.factorRow}>
                <Ionicons name="thermometer-outline" size={24} color={colors.text} />
                <View style={styles.factorInfo}>
                  <Text style={styles.factorLabel}>Stress Level</Text>
                  <Text style={styles.factorValue}>{latestLog.stress}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No lifestyle data available. Log your daily activities to see how they affect your fertility.
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.addButtonText}>Log Today's Activities</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Improvement Program</Text>
          <View style={styles.programCard}>
            <Text style={styles.cardTitle}>8-Week Fertility Boost</Text>
            <Text style={styles.programText}>
              Follow our personalized program to improve your sperm health through targeted lifestyle changes.
            </Text>
            <TouchableOpacity style={styles.programButton}>
              <Text style={styles.programButtonText}>View Program</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.male,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  spermTestCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  testDate: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.text,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.male,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  lifestyleCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  factorLabel: {
    fontSize: 14,
    color: colors.text,
  },
  factorValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  programCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  programText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 15,
  },
  programButton: {
    backgroundColor: colors.male,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  programButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MaleHealthScreen;
