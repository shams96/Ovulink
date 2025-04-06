import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalizedRecommendation } from '../services/aiService';
import { colors } from '../theme';

interface RecommendationsCardProps {
  recommendations: PersonalizedRecommendation[];
  onViewMore?: () => void;
  maxItems?: number;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ 
  recommendations, 
  onViewMore,
  maxItems = 3
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>AI Recommendations</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No personalized recommendations available yet. Continue tracking your health data to receive insights.
          </Text>
        </View>
      </View>
    );
  }

  // Sort recommendations by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Limit the number of recommendations shown
  const displayRecommendations = sortedRecommendations.slice(0, maxItems);
  const hasMoreRecommendations = sortedRecommendations.length > maxItems;

  // Get icon for recommendation type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lifestyle':
        return 'sunny-outline' as const;
      case 'nutrition':
        return 'nutrition-outline' as const;
      case 'exercise':
        return 'fitness-outline' as const;
      case 'medical':
        return 'medkit-outline' as const;
      default:
        return 'information-circle-outline' as const;
    }
  };

  // Get color for priority
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.info;
      default:
        return colors.text;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Recommendations</Text>
        <Ionicons name="bulb" size={20} color={colors.primary} />
      </View>

      <ScrollView style={styles.recommendationsList}>
        {displayRecommendations.map((recommendation, index) => (
          <View 
            key={`${recommendation.title}-${index}`} 
            style={[
              styles.recommendationItem,
              index < displayRecommendations.length - 1 && styles.itemBorder
            ]}
          >
            <View style={styles.recommendationHeader}>
              <View style={styles.typeContainer}>
                <Ionicons 
                  name={getTypeIcon(recommendation.type)} 
                  size={18} 
                  color={colors.text} 
                />
                <Text style={styles.typeText}>{recommendation.type}</Text>
              </View>
              <View 
                style={[
                  styles.priorityBadge, 
                  { backgroundColor: getPriorityColor(recommendation.priority) }
                ]}
              >
                <Text style={styles.priorityText}>{recommendation.priority}</Text>
              </View>
            </View>
            
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            
            {recommendation.sources && recommendation.sources.length > 0 && (
              <TouchableOpacity style={styles.sourcesButton}>
                <Text style={styles.sourcesText}>View Sources</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {hasMoreRecommendations && onViewMore && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
          <Text style={styles.viewMoreText}>View All Recommendations</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  recommendationsList: {
    maxHeight: 300,
  },
  recommendationItem: {
    marginBottom: 15,
    paddingBottom: 15,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  sourcesButton: {
    alignSelf: 'flex-start',
  },
  sourcesText: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  viewMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});

export default RecommendationsCard;
