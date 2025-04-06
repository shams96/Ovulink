import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import aiService from '../services/aiService';

interface ApiCostDashboardProps {
  onUpdateLimit?: (newLimit: number) => void;
  onReset?: () => void;
}

const ApiCostDashboard: React.FC<ApiCostDashboardProps> = ({ 
  onUpdateLimit,
  onReset
}) => {
  const [apiUsage, setApiUsage] = useState({
    totalTokensUsed: 0,
    totalCostIncurred: 0,
    remainingBudget: 5,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fetch API usage data
  useEffect(() => {
    const usage = aiService.getApiUsage();
    setApiUsage(usage);
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(() => {
      const updatedUsage = aiService.getApiUsage();
      setApiUsage(updatedUsage);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate percentage of budget used
  const budgetUsedPercentage = Math.min(
    (apiUsage.totalCostIncurred / (apiUsage.totalCostIncurred + apiUsage.remainingBudget)) * 100,
    100
  );
  
  // Determine status color based on remaining budget
  const getStatusColor = () => {
    if (apiUsage.remainingBudget <= 0) {
      return colors.error;
    } else if (apiUsage.remainingBudget < 1) {
      return colors.warning;
    } else {
      return colors.success;
    }
  };
  
  const handleReset = () => {
    aiService.resetApiUsage();
    const usage = aiService.getApiUsage();
    setApiUsage(usage);
    if (onReset) onReset();
  };
  
  const handleUpdateLimit = (amount: number) => {
    const currentLimit = apiUsage.totalCostIncurred + apiUsage.remainingBudget;
    const newLimit = currentLimit + amount;
    
    if (newLimit > 0) {
      aiService.updateCostLimit(newLimit);
      const usage = aiService.getApiUsage();
      setApiUsage(usage);
      if (onUpdateLimit) onUpdateLimit(newLimit);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.titleContainer}>
          <Ionicons name="analytics-outline" size={20} color={colors.text} />
          <Text style={styles.title}>API Cost Dashboard</Text>
        </View>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: getStatusColor() }
            ]} 
          />
          <Text style={styles.statusText}>
            ${apiUsage.remainingBudget.toFixed(2)} remaining
          </Text>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={colors.text} 
          />
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${budgetUsedPercentage}%`, backgroundColor: getStatusColor() }
              ]} 
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Tokens Used:</Text>
              <Text style={styles.statValue}>{apiUsage.totalTokensUsed.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Cost:</Text>
              <Text style={styles.statValue}>${apiUsage.totalCostIncurred.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budget Limit:</Text>
              <Text style={styles.statValue}>
                ${(apiUsage.totalCostIncurred + apiUsage.remainingBudget).toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text style={styles.actionButtonText}>Reset Usage</Text>
            </TouchableOpacity>
            
            <View style={styles.limitButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.decreaseButton]}
                onPress={() => handleUpdateLimit(-1)}
              >
                <Text style={styles.actionButtonText}>-$1</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.increaseButton]}
                onPress={() => handleUpdateLimit(1)}
              >
                <Text style={styles.actionButtonText}>+$1</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.increaseButton]}
                onPress={() => handleUpdateLimit(5)}
              >
                <Text style={styles.actionButtonText}>+$5</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.infoText}>
            This dashboard tracks API usage costs during development. 
            The default limit is $5. Adjust as needed for your development budget.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 5,
  },
  content: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    marginBottom: 15,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: colors.error,
  },
  limitButtons: {
    flexDirection: 'row',
  },
  decreaseButton: {
    backgroundColor: colors.warning,
    marginRight: 5,
  },
  increaseButton: {
    backgroundColor: colors.success,
    marginRight: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ApiCostDashboard;
