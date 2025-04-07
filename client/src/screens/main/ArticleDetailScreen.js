import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Text, Card, Button, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * Article Detail Screen component
 * @param {object} navigation - React Navigation object
 * @param {object} route - React Navigation route
 * @returns {JSX.Element} - Article Detail Screen component
 */
const ArticleDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const { articleId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  // Placeholder data - in a real app, this would come from Redux
  const article = {
    id: articleId,
    title: 'Understanding Your Menstrual Cycle',
    category: 'female-health',
    readTime: '5 min',
    author: 'Dr. Sarah Johnson',
    date: 'April 2, 2025',
    imageUrl: 'https://example.com/images/menstrual-cycle.jpg',
    content: `
      <h2>Introduction</h2>
      <p>The menstrual cycle is a natural process that occurs in the female reproductive system. Understanding your menstrual cycle can help you track your fertility, predict your period, and identify any potential health issues.</p>
      
      <h2>Phases of the Menstrual Cycle</h2>
      <p>The menstrual cycle consists of four main phases:</p>
      
      <h3>1. Menstrual Phase (Days 1-5)</h3>
      <p>The menstrual phase begins on the first day of your period and typically lasts 3-7 days. During this phase, the uterine lining sheds, resulting in menstrual bleeding.</p>
      
      <h3>2. Follicular Phase (Days 1-13)</h3>
      <p>The follicular phase overlaps with the menstrual phase and continues until ovulation. During this phase, follicle-stimulating hormone (FSH) stimulates the growth of follicles in the ovaries, each containing an egg.</p>
      
      <h3>3. Ovulation Phase (Day 14)</h3>
      <p>Ovulation typically occurs around day 14 of a 28-day cycle. During ovulation, a mature egg is released from the ovary and travels through the fallopian tube toward the uterus. This is the most fertile time of the cycle.</p>
      
      <h3>4. Luteal Phase (Days 15-28)</h3>
      <p>The luteal phase begins after ovulation and lasts until the start of the next menstrual period. During this phase, the ruptured follicle transforms into the corpus luteum, which produces progesterone to prepare the uterine lining for potential implantation.</p>
      
      <h2>Hormonal Changes</h2>
      <p>Throughout the menstrual cycle, various hormones fluctuate to regulate the different phases:</p>
      <ul>
        <li><strong>Estrogen:</strong> Rises during the follicular phase, peaks just before ovulation, and then decreases during the luteal phase.</li>
        <li><strong>Progesterone:</strong> Increases after ovulation and remains elevated during the luteal phase.</li>
        <li><strong>Follicle-Stimulating Hormone (FSH):</strong> Stimulates follicle growth during the follicular phase.</li>
        <li><strong>Luteinizing Hormone (LH):</strong> Triggers ovulation when it surges around day 14.</li>
      </ul>
      
      <h2>Tracking Your Cycle</h2>
      <p>Tracking your menstrual cycle can help you understand your body better and identify patterns or irregularities. You can track various aspects of your cycle, including:</p>
      <ul>
        <li>Period start and end dates</li>
        <li>Flow intensity</li>
        <li>Symptoms (cramps, mood changes, etc.)</li>
        <li>Basal body temperature</li>
        <li>Cervical mucus changes</li>
      </ul>
      
      <h2>Signs of Fertility</h2>
      <p>Understanding the signs of fertility can help you identify your most fertile days if you're trying to conceive:</p>
      <ul>
        <li><strong>Cervical Mucus:</strong> Becomes clear, stretchy, and slippery around ovulation, resembling egg whites.</li>
        <li><strong>Basal Body Temperature:</strong> Rises slightly (0.2-0.5°C) after ovulation and remains elevated until your next period.</li>
        <li><strong>Ovulation Pain:</strong> Some women experience mild pain or discomfort on one side of the lower abdomen during ovulation.</li>
      </ul>
      
      <h2>When to Consult a Healthcare Provider</h2>
      <p>It's important to consult a healthcare provider if you experience:</p>
      <ul>
        <li>Irregular periods</li>
        <li>Very heavy or painful periods</li>
        <li>Periods that last longer than 7 days</li>
        <li>Missed periods (if you're not pregnant)</li>
        <li>Bleeding between periods</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Understanding your menstrual cycle is an essential aspect of women's health. By tracking your cycle and recognizing patterns, you can better understand your body, identify potential health issues, and make informed decisions about your reproductive health.</p>
    `,
    relatedArticles: [
      { id: '2', title: 'Basal Body Temperature Tracking' },
      { id: '3', title: 'Cervical Mucus Changes Throughout Your Cycle' },
      { id: '8', title: 'Understanding Ovulation' },
    ],
  };
  
  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'fertility', name: 'Fertility' },
    { id: 'female-health', name: 'Female Health' },
    { id: 'male-health', name: 'Male Health' },
    { id: 'conception', name: 'Conception' },
    { id: 'pregnancy', name: 'Pregnancy' },
    { id: 'nutrition', name: 'Nutrition' },
  ];
  
  useEffect(() => {
    // Simulate loading article data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [articleId]);
  
  const handleSaveArticle = () => {
    setIsSaved(!isSaved);
    // In a real app, this would dispatch an action to save/unsave the article
  };
  
  const handleShareArticle = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title}`,
        url: `https://ovulink.com/articles/${articleId}`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };
  
  const handleRelatedArticlePress = (relatedArticleId) => {
    navigation.push('ArticleDetail', { articleId: relatedArticleId });
  };
  
  // Convert HTML-like content to React Native components
  const renderContent = () => {
    // This is a simplified implementation
    // In a real app, you would use a proper HTML parser like react-native-render-html
    
    const contentSections = article.content
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    return contentSections.map((section, index) => {
      if (section.startsWith('<h2>') && section.endsWith('</h2>')) {
        const heading = section.replace('<h2>', '').replace('</h2>', '');
        return <Text key={index} style={styles.heading2}>{heading}</Text>;
      } else if (section.startsWith('<h3>') && section.endsWith('</h3>')) {
        const heading = section.replace('<h3>', '').replace('</h3>', '');
        return <Text key={index} style={styles.heading3}>{heading}</Text>;
      } else if (section.startsWith('<p>') && section.endsWith('</p>')) {
        const paragraph = section.replace('<p>', '').replace('</p>', '');
        return <Text key={index} style={styles.paragraph}>{paragraph}</Text>;
      } else if (section.startsWith('<ul>') && section.endsWith('</ul>')) {
        // Skip the ul tag, we'll handle list items separately
        return null;
      } else if (section.startsWith('<li>') && section.endsWith('</li>')) {
        const listItem = section.replace('<li>', '').replace('</li>', '');
        
        // Handle bold text in list items
        if (listItem.includes('<strong>')) {
          const parts = listItem.split(/<strong>|<\/strong>/);
          return (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemBullet}>•</Text>
              <Text style={styles.listItemText}>
                {parts.map((part, i) => 
                  i % 2 === 0 ? part : <Text key={i} style={{ fontWeight: 'bold' }}>{part}</Text>
                )}
              </Text>
            </View>
          );
        }
        
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemBullet}>•</Text>
            <Text style={styles.listItemText}>{listItem}</Text>
          </View>
        );
      }
      
      return <Text key={index}>{section}</Text>;
    }).filter(component => component !== null);
  };
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Article Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSaveArticle}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareArticle}
            >
              <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Article Image */}
        <Card style={styles.imageCard}>
          <Card.Cover
            source={{ uri: article.imageUrl }}
            style={styles.image}
            // Fallback to a solid color if image fails to load
            onError={(e) => {
              console.log('Image failed to load:', e.nativeEvent.error);
            }}
          />
        </Card>
        
        {/* Article Meta */}
        <View style={styles.meta}>
          <Chip style={styles.categoryChip}>
            {categories.find(c => c.id === article.category)?.name}
          </Chip>
          <Text style={styles.readTime}>
            <Ionicons name="time-outline" size={14} /> {article.readTime}
          </Text>
        </View>
        
        {/* Article Title */}
        <Text style={styles.title}>{article.title}</Text>
        
        {/* Article Author and Date */}
        <View style={styles.authorContainer}>
          <Text style={styles.author}>By {article.author}</Text>
          <Text style={styles.date}>{article.date}</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Article Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Related Articles */}
        <View style={styles.relatedArticlesContainer}>
          <Text style={styles.relatedArticlesTitle}>Related Articles</Text>
          
          {article.relatedArticles.map(relatedArticle => (
            <TouchableOpacity
              key={relatedArticle.id}
              style={styles.relatedArticle}
              onPress={() => handleRelatedArticlePress(relatedArticle.id)}
            >
              <Text style={styles.relatedArticleTitle}>{relatedArticle.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  imageCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  image: {
    height: 200,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryChip: {
    height: 28,
  },
  readTime: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  title: {
    ...typography.h4,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  author: {
    ...typography.subtitle2,
    color: theme.colors.textSecondary,
  },
  date: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  divider: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  content: {
    marginHorizontal: spacing.md,
  },
  heading2: {
    ...typography.h5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heading3: {
    ...typography.h6,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body1,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  listItemBullet: {
    ...typography.body1,
    marginRight: spacing.sm,
  },
  listItemText: {
    ...typography.body1,
    flex: 1,
    lineHeight: 24,
  },
  relatedArticlesContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  relatedArticlesTitle: {
    ...typography.h5,
    marginBottom: spacing.md,
  },
  relatedArticle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  relatedArticleTitle: {
    ...typography.subtitle1,
    flex: 1,
  },
});

export default ArticleDetailScreen;
