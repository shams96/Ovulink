import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { RootState } from '../../store';
import { colors } from '../../theme';

const HomeScreen: React.FC = () => {
  const { user, partner } = useSelector((state: RootState) => state.auth);
  const { currentCycle } = useSelector((state: RootState) => state.cycle);
  const { spermTests } = useSelector((state: RootState) => state.maleHealth);
  const isMale = user?.gender === 'male';

  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  // Calculate fertility status (simplified for demo)
  const getFertilityStatus = () => {
    if (!currentCycle) return { status: 'Unknown', color: colors.neutral };

    if (currentCycle.predictedOvulationDate) {
      const ovulationDate = new Date(currentCycle.predictedOvulationDate);
      const diffDays = Math.round((ovulationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= -1 && diffDays <= 1) {
        return { status: 'Peak Fertility', color: colors.success };
      } else if (diffDays >= -3 && diffDays <= 3) {
        return { status: 'High Fertility', color: colors.info };
      } else if (diffDays >= -5 && diffDays <= 5) {
        return { status: 'Medium Fertility', color: colors.warning };
      }
    }

    return { status: 'Low Fertility', color: colors.neutral };
  };

  const fertilityStatus = getFertilityStatus();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.fertilitySummary}>
          <View style={[styles.fertilityBadge, { backgroundColor: fertilityStatus.color }]}>
            <Text style={styles.fertilityText}>{fertilityStatus.status}</Text>
          </View>
          
          {partner && (
            <View style={styles.partnerInfo}>
              <Ionicons name="people" size={20} color={colors.text} />
              <Text style={styles.partnerText}>
                Connected with {partner.name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <View style={styles.taskList}>
            <TouchableOpacity style={styles.task}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.primary} />
              <Text style={styles.taskText}>Log your daily health data</Text>
            </TouchableOpacity>
            
            {!isMale && (
              <TouchableOpacity style={styles.task}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.primary} />
                <Text style={styles.taskText}>Record basal body temperature</Text>
              </TouchableOpacity>
            )}
            
            {isMale && (
              <TouchableOpacity style={styles.task}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.primary} />
                <Text style={styles.taskText}>Complete your lifestyle checklist</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fertility Insights</Text>
          <View style={styles.insightCard}>
            {!isMale && currentCycle ? (
              <>
                <Text style={styles.insightTitle}>Cycle Day {
                  Math.floor((today.getTime() - new Date(currentCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                }</Text>
                <Text style={styles.insightText}>
                  {currentCycle.predictedOvulationDate 
                    ? `Predicted ovulation: ${format(new Date(currentCycle.predictedOvulationDate), 'MMMM d')}`
                    : 'Tracking your cycle will help predict ovulation'}
                </Text>
              </>
            ) : isMale && spermTests.length > 0 ? (
              <>
                <Text style={styles.insightTitle}>Sperm Health</Text>
                <Text style={styles.insightText}>
                  Last test: {format(new Date(spermTests[0].date), 'MMMM d')}
                </Text>
                <Text style={styles.insightText}>
                  Count: {spermTests[0].count} million/ml
                </Text>
              </>
            ) : (
              <Text style={styles.insightText}>
                Start tracking to see personalized insights
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educational Tip</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color={colors.warning} />
            <Text style={styles.tipText}>
              {isMale 
                ? "Did you know? Regular exercise can improve sperm quality, but excessive heat from activities like cycling may temporarily reduce sperm count."
                : "Did you know? Stress can affect your cycle length and regularity. Try incorporating relaxation techniques into your daily routine."}
            </Text>
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
    backgroundColor: colors.primary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  fertilitySummary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fertilityBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  fertilityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerText: {
    marginLeft: 8,
    color: colors.text,
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
  taskList: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default HomeScreen;
