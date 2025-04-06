import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import educationService, { 
  EducationalContent, 
  ArticleCategory, 
  ContentType, 
  ContentLevel 
} from '../services/educationService';

interface EducationLibraryProps {
  gender: 'male' | 'female';
  onContentSelect?: (content: EducationalContent) => void;
}

const EducationLibrary: React.FC<EducationLibraryProps> = ({ 
  gender,
  onContentSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<EducationalContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<EducationalContent[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<EducationalContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ContentLevel | null>(null);
  
  // Load content on mount
  useEffect(() => {
    const content = educationService.getAllContent();
    setAllContent(content);
    setFilteredContent(content);
    
    // Get recommended content based on gender
    const recommended = educationService.getRecommendedContent(gender);
    setRecommendedContent(recommended);
  }, [gender]);
  
  // Filter content when search query or filters change
  useEffect(() => {
    let result = allContent;
    
    // Apply search query filter
    if (searchQuery) {
      result = educationService.searchContent(searchQuery);
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(content => content.category === selectedCategory);
    }
    
    // Apply type filter
    if (selectedType) {
      result = result.filter(content => content.type === selectedType);
    }
    
    // Apply level filter
    if (selectedLevel) {
      result = result.filter(content => content.level === selectedLevel);
    }
    
    setFilteredContent(result);
  }, [searchQuery, selectedCategory, selectedType, selectedLevel, allContent]);
  
  // Handle content selection
  const handleContentPress = (content: EducationalContent) => {
    // Mark content as read
    educationService.markAsRead(content.id);
    
    // Update content in state
    setAllContent(prevContent => 
      prevContent.map(item => 
        item.id === content.id ? { ...item, isRead: true } : item
      )
    );
    
    if (onContentSelect) {
      onContentSelect(content);
    }
  };
  
  // Handle favorite toggle
  const handleToggleFavorite = (content: EducationalContent) => {
    const updatedContent = educationService.toggleFavorite(content.id);
    
    if (updatedContent) {
      // Update content in state
      setAllContent(prevContent => 
        prevContent.map(item => 
          item.id === content.id ? updatedContent : item
        )
      );
    }
  };
  
  // Get category name for display
  const getCategoryName = (category: ArticleCategory): string => {
    switch (category) {
      case ArticleCategory.FERTILITY_BASICS:
        return 'Fertility Basics';
      case ArticleCategory.CYCLE_TRACKING:
        return 'Cycle Tracking';
      case ArticleCategory.MALE_FERTILITY:
        return 'Male Fertility';
      case ArticleCategory.NUTRITION:
        return 'Nutrition';
      case ArticleCategory.LIFESTYLE:
        return 'Lifestyle';
      case ArticleCategory.MENTAL_HEALTH:
        return 'Mental Health';
      case ArticleCategory.MEDICAL:
        return 'Medical';
      case ArticleCategory.SUCCESS_STORIES:
        return 'Success Stories';
      default:
        return 'Unknown';
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.ARTICLE:
        return 'document-text-outline' as const;
      case ContentType.VIDEO:
        return 'videocam-outline' as const;
      case ContentType.INFOGRAPHIC:
        return 'image-outline' as const;
      case ContentType.QUIZ:
        return 'help-circle-outline' as const;
      case ContentType.INTERACTIVE:
        return 'game-controller-outline' as const;
      default:
        return 'document-outline' as const;
    }
  };
  
  // Get content level badge color
  const getLevelColor = (level: ContentLevel): string => {
    switch (level) {
      case ContentLevel.BEGINNER:
        return colors.success;
      case ContentLevel.INTERMEDIATE:
        return colors.warning;
      case ContentLevel.ADVANCED:
        return colors.error;
      default:
        return colors.neutral;
    }
  };
  
  // Render content item
  const renderContentItem = ({ item }: { item: EducationalContent }) => {
    return (
      <TouchableOpacity 
        style={styles.contentItem}
        onPress={() => handleContentPress(item)}
      >
        <View style={styles.contentHeader}>
          <View style={styles.contentTypeContainer}>
            <Ionicons 
              name={getContentTypeIcon(item.type)} 
              size={16} 
              color={colors.text} 
            />
            <Text style={styles.contentType}>{item.type}</Text>
          </View>
          
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons 
              name={item.isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={item.isFavorite ? colors.error : colors.text} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentMain}>
          {item.thumbnailUrl && (
            <Image 
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentAuthor}>By {item.author}</Text>
            
            <View style={styles.contentMeta}>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
              
              {item.readTime && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color={colors.text} />
                  <Text style={styles.metaText}>{item.readTime} min read</Text>
                </View>
              )}
              
              {item.videoLength && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color={colors.text} />
                  <Text style={styles.metaText}>{item.videoLength} min video</Text>
                </View>
              )}
              
              {item.isRead && (
                <View style={styles.readBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </View>
          </View>
        </View>
        
        <Text style={styles.contentDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render category filter item
  const renderCategoryItem = ({ item }: { item: ArticleCategory }) => {
    const isSelected = selectedCategory === item;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          isSelected && { backgroundColor: colors.primary }
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : item)}
      >
        <Text 
          style={[
            styles.filterText,
            isSelected && { color: 'white' }
          ]}
        >
          {getCategoryName(item)}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // Render content type filter item
  const renderTypeItem = ({ item }: { item: ContentType }) => {
    const isSelected = selectedType === item;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          isSelected && { backgroundColor: colors.primary }
        ]}
        onPress={() => setSelectedType(isSelected ? null : item)}
      >
        <Ionicons 
          name={getContentTypeIcon(item)} 
          size={16} 
          color={isSelected ? 'white' : colors.text} 
        />
        <Text 
          style={[
            styles.filterText,
            isSelected && { color: 'white' }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // Render content level filter item
  const renderLevelItem = ({ item }: { item: ContentLevel }) => {
    const isSelected = selectedLevel === item;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          isSelected && { backgroundColor: getLevelColor(item) }
        ]}
        onPress={() => setSelectedLevel(isSelected ? null : item)}
      >
        <Text 
          style={[
            styles.filterText,
            isSelected && { color: 'white' }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles, videos, and more..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Categories:</Text>
            <FlatList
              data={Object.values(ArticleCategory)}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Types:</Text>
            <FlatList
              data={Object.values(ContentType)}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Levels:</Text>
            <FlatList
              data={Object.values(ContentLevel)}
              renderItem={renderLevelItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>
      
      {searchQuery.length === 0 && !selectedCategory && !selectedType && !selectedLevel && (
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <FlatList
            data={recommendedContent}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          />
        </View>
      )}
      
      <View style={styles.contentListContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery.length > 0 
            ? `Search Results (${filteredContent.length})` 
            : selectedCategory || selectedType || selectedLevel 
              ? `Filtered Results (${filteredContent.length})`
              : 'All Content'
          }
        </Text>
        
        {filteredContent.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.neutral} />
            <Text style={styles.emptyText}>
              No content found. Try adjusting your search or filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredContent}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterSection: {
    marginRight: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  recommendedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  recommendedList: {
    paddingHorizontal: 15,
  },
  contentListContainer: {
    flex: 1,
  },
  contentList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  contentItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentType: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  contentMain: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  contentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  contentAuthor: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 5,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  levelText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 3,
  },
  readBadge: {
    backgroundColor: colors.success,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: colors.text,
  },
  moreTagsText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: colors.text,
    opacity: 0.7,
  },
});

export default EducationLibrary;
