import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Chip, Searchbar, Divider, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * Education Screen component
 * @param {object} navigation - React Navigation object
 * @param {object} route - React Navigation route
 * @returns {JSX.Element} - Education Screen component
 */
const EducationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Placeholder data - in a real app, this would come from Redux
  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'fertility', name: 'Fertility' },
    { id: 'female-health', name: 'Female Health' },
    { id: 'male-health', name: 'Male Health' },
    { id: 'conception', name: 'Conception' },
    { id: 'pregnancy', name: 'Pregnancy' },
    { id: 'nutrition', name: 'Nutrition' },
  ];
  
  const articles = [
    {
      id: '1',
      title: 'Understanding Your Menstrual Cycle',
      summary: 'Learn about the phases of the menstrual cycle and how they affect fertility.',
      category: 'female-health',
      readTime: '5 min',
      imageUrl: 'https://example.com/images/menstrual-cycle.jpg',
      isFeatured: true,
    },
    {
      id: '2',
      title: 'Basal Body Temperature Tracking',
      summary: 'How to track your basal body temperature to predict ovulation.',
      category: 'fertility',
      readTime: '4 min',
      imageUrl: 'https://example.com/images/bbt-tracking.jpg',
      isFeatured: false,
    },
    {
      id: '3',
      title: 'Cervical Mucus Changes Throughout Your Cycle',
      summary: 'Understanding cervical mucus patterns to identify your fertile window.',
      category: 'fertility',
      readTime: '6 min',
      imageUrl: 'https://example.com/images/cervical-mucus.jpg',
      isFeatured: true,
    },
    {
      id: '4',
      title: 'Sperm Health and Fertility',
      summary: 'Factors that affect sperm health and how to improve it.',
      category: 'male-health',
      readTime: '7 min',
      imageUrl: 'https://example.com/images/sperm-health.jpg',
      isFeatured: true,
    },
    {
      id: '5',
      title: 'Nutrition for Fertility',
      summary: 'Foods and nutrients that support reproductive health.',
      category: 'nutrition',
      readTime: '8 min',
      imageUrl: 'https://example.com/images/fertility-nutrition.jpg',
      isFeatured: false,
    },
    {
      id: '6',
      title: 'Timing Intercourse for Conception',
      summary: 'Optimal timing for intercourse to increase chances of conception.',
      category: 'conception',
      readTime: '5 min',
      imageUrl: 'https://example.com/images/timing-intercourse.jpg',
      isFeatured: false,
    },
    {
      id: '7',
      title: 'Early Signs of Pregnancy',
      summary: 'Common early signs and symptoms of pregnancy.',
      category: 'pregnancy',
      readTime: '6 min',
      imageUrl: 'https://example.com/images/early-pregnancy.jpg',
      isFeatured: false,
    },
    {
      id: '8',
      title: 'Understanding Ovulation',
      summary: 'The science behind ovulation and its role in fertility.',
      category: 'fertility',
      readTime: '7 min',
      imageUrl: 'https://example.com/images/ovulation.jpg',
      isFeatured: false,
    },
  ];
  
  // Filter articles based on search query and selected category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get featured articles
  const featuredArticles = articles.filter(article => article.isFeatured);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleArticlePress = (articleId) => {
    // In a real app, this would navigate to the article detail screen
    navigation.navigate('ArticleDetail', { articleId });
  };
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Search Bar */}
        <Searchbar
          placeholder="Search articles"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => handleCategorySelect(category.id)}
              style={styles.categoryChip}
              selectedColor={theme.colors.primary}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>
        
        {/* Featured Articles */}
        {searchQuery === '' && selectedCategory === 'all' && (
          <>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            
            {featuredArticles.map(article => (
              <Card
                key={article.id}
                style={styles.featuredCard}
                onPress={() => handleArticlePress(article.id)}
              >
                <Card.Cover
                  source={{ uri: article.imageUrl }}
                  style={styles.featuredCardImage}
                  // Fallback to a solid color if image fails to load
                  onError={(e) => {
                    console.log('Featured image failed to load:', e.nativeEvent.error);
                  }}
                />
                <Card.Content style={styles.featuredCardContent}>
                  <View style={styles.articleMeta}>
                    <Chip style={styles.categoryTag}>
                      {categories.find(c => c.id === article.category)?.name}
                    </Chip>
                    <Text style={styles.readTime}>
                      <Ionicons name="time-outline" size={14} /> {article.readTime}
                    </Text>
                  </View>
                  <Text style={styles.featuredCardTitle}>{article.title}</Text>
                  <Text style={styles.featuredCardSummary}>{article.summary}</Text>
                </Card.Content>
              </Card>
            ))}
            
            <Divider style={styles.divider} />
          </>
        )}
        
        {/* All Articles */}
        <Text style={styles.sectionTitle}>
          {searchQuery !== '' ? 'Search Results' : 
           selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.name} Articles` : 
           'All Articles'}
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : filteredArticles.length === 0 ? (
          <Text style={styles.noResultsText}>No articles found</Text>
        ) : (
          <View style={styles.articlesGrid}>
            {filteredArticles.map(article => (
              <Card
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article.id)}
              >
                <Card.Cover
                  source={{ uri: article.imageUrl }}
                  style={styles.articleCardImage}
                  // Fallback to a solid color if image fails to load
                  onError={(e) => {
                    console.log('Article image failed to load:', e.nativeEvent.error);
                  }}
                />
                <Card.Content style={styles.articleCardContent}>
                  <View style={styles.articleMeta}>
                    <Text style={styles.categoryLabel}>
                      {categories.find(c => c.id === article.category)?.name}
                    </Text>
                    <Text style={styles.readTime}>
                      <Ionicons name="time-outline" size={14} /> {article.readTime}
                    </Text>
                  </View>
                  <Text style={styles.articleCardTitle}>{article.title}</Text>
                  <Text style={styles.articleCardSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
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
  searchBar: {
    marginBottom: spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    ...shadows.small,
  },
  categoriesContainer: {
    paddingBottom: spacing.md,
  },
  categoryChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h5,
    marginBottom: spacing.md,
  },
  featuredCard: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  featuredCardImage: {
    height: 200,
  },
  featuredCardContent: {
    padding: spacing.md,
  },
  featuredCardTitle: {
    ...typography.h5,
    marginBottom: spacing.xs,
  },
  featuredCardSummary: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  divider: {
    marginBottom: spacing.lg,
  },
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  articleCardImage: {
    height: 120,
  },
  articleCardContent: {
    padding: spacing.sm,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryTag: {
    height: 24,
    paddingHorizontal: spacing.xs,
  },
  categoryLabel: {
    ...typography.caption,
    color: theme.colors.primary,
  },
  readTime: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  articleCardTitle: {
    ...typography.subtitle1,
    marginBottom: spacing.xs,
  },
  articleCardSummary: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  loader: {
    marginTop: spacing.xl,
  },
  noResultsText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default EducationScreen;
