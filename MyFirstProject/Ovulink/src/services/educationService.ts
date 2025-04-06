// Educational content service for fertility education

// Article categories
export enum ArticleCategory {
  FERTILITY_BASICS = 'fertility_basics',
  CYCLE_TRACKING = 'cycle_tracking',
  MALE_FERTILITY = 'male_fertility',
  NUTRITION = 'nutrition',
  LIFESTYLE = 'lifestyle',
  MENTAL_HEALTH = 'mental_health',
  MEDICAL = 'medical',
  SUCCESS_STORIES = 'success_stories',
}

// Content types
export enum ContentType {
  ARTICLE = 'article',
  VIDEO = 'video',
  INFOGRAPHIC = 'infographic',
  QUIZ = 'quiz',
  INTERACTIVE = 'interactive',
}

// Content difficulty levels
export enum ContentLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

// Educational content item
export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  type: ContentType;
  level: ContentLevel;
  author: string;
  publishDate: string;
  readTime?: number; // in minutes
  videoLength?: number; // in minutes
  thumbnailUrl?: string;
  contentUrl: string;
  tags: string[];
  isFavorite: boolean;
  isRead: boolean;
}

// Mock educational content
const mockEducationalContent: EducationalContent[] = [
  {
    id: 'article-001',
    title: 'Understanding Your Menstrual Cycle',
    description: 'A comprehensive guide to the four phases of the menstrual cycle and how they affect fertility.',
    category: ArticleCategory.FERTILITY_BASICS,
    type: ContentType.ARTICLE,
    level: ContentLevel.BEGINNER,
    author: 'Dr. Sarah Johnson',
    publishDate: '2025-01-15',
    readTime: 8,
    thumbnailUrl: 'https://example.com/images/menstrual-cycle.jpg',
    contentUrl: 'https://example.com/articles/understanding-menstrual-cycle',
    tags: ['menstrual cycle', 'fertility basics', 'hormones', 'ovulation'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'article-002',
    title: 'Basal Body Temperature Tracking: A Complete Guide',
    description: 'Learn how to accurately track your basal body temperature and interpret the data for fertility awareness.',
    category: ArticleCategory.CYCLE_TRACKING,
    type: ContentType.ARTICLE,
    level: ContentLevel.INTERMEDIATE,
    author: 'Emma Williams, Fertility Educator',
    publishDate: '2025-02-03',
    readTime: 12,
    thumbnailUrl: 'https://example.com/images/bbt-tracking.jpg',
    contentUrl: 'https://example.com/articles/bbt-tracking-guide',
    tags: ['BBT', 'temperature tracking', 'fertility awareness', 'ovulation'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'video-001',
    title: 'How to Improve Sperm Quality Naturally',
    description: 'This video covers evidence-based strategies to improve sperm count, motility, and morphology through lifestyle changes.',
    category: ArticleCategory.MALE_FERTILITY,
    type: ContentType.VIDEO,
    level: ContentLevel.BEGINNER,
    author: 'Dr. Michael Chen, Andrologist',
    publishDate: '2025-03-10',
    videoLength: 15,
    thumbnailUrl: 'https://example.com/images/sperm-quality-video.jpg',
    contentUrl: 'https://example.com/videos/improve-sperm-quality',
    tags: ['male fertility', 'sperm health', 'lifestyle', 'nutrition'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'article-003',
    title: 'Fertility-Boosting Foods: What to Eat When Trying to Conceive',
    description: 'A nutritionist\'s guide to the best foods and dietary patterns for supporting reproductive health.',
    category: ArticleCategory.NUTRITION,
    type: ContentType.ARTICLE,
    level: ContentLevel.BEGINNER,
    author: 'Lisa Martinez, Registered Dietitian',
    publishDate: '2025-02-22',
    readTime: 10,
    thumbnailUrl: 'https://example.com/images/fertility-foods.jpg',
    contentUrl: 'https://example.com/articles/fertility-boosting-foods',
    tags: ['nutrition', 'diet', 'fertility foods', 'antioxidants'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'infographic-001',
    title: 'Cervical Mucus Changes Throughout Your Cycle',
    description: 'Visual guide to identifying fertile cervical mucus and tracking changes throughout your menstrual cycle.',
    category: ArticleCategory.CYCLE_TRACKING,
    type: ContentType.INFOGRAPHIC,
    level: ContentLevel.INTERMEDIATE,
    author: 'Fertility Awareness Method Educators Association',
    publishDate: '2025-01-30',
    thumbnailUrl: 'https://example.com/images/cervical-mucus-infographic.jpg',
    contentUrl: 'https://example.com/infographics/cervical-mucus-changes',
    tags: ['cervical mucus', 'fertility signs', 'cycle tracking', 'fertile window'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'article-004',
    title: 'Managing Stress While Trying to Conceive',
    description: 'Practical strategies for reducing stress and its impact on fertility, including mindfulness techniques and lifestyle adjustments.',
    category: ArticleCategory.MENTAL_HEALTH,
    type: ContentType.ARTICLE,
    level: ContentLevel.BEGINNER,
    author: 'Dr. Rebecca Lee, Reproductive Psychologist',
    publishDate: '2025-03-15',
    readTime: 7,
    thumbnailUrl: 'https://example.com/images/stress-management.jpg',
    contentUrl: 'https://example.com/articles/managing-stress-ttc',
    tags: ['stress', 'mental health', 'mindfulness', 'fertility'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'video-002',
    title: 'Understanding Semen Analysis Results',
    description: 'A urologist explains how to interpret semen analysis results, what the parameters mean, and when to seek treatment.',
    category: ArticleCategory.MALE_FERTILITY,
    type: ContentType.VIDEO,
    level: ContentLevel.ADVANCED,
    author: 'Dr. James Wilson, Urologist',
    publishDate: '2025-02-18',
    videoLength: 22,
    thumbnailUrl: 'https://example.com/images/semen-analysis-video.jpg',
    contentUrl: 'https://example.com/videos/semen-analysis-explained',
    tags: ['male fertility', 'semen analysis', 'sperm count', 'sperm motility'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'quiz-001',
    title: 'Test Your Fertility Knowledge',
    description: 'A comprehensive quiz to test your understanding of fertility basics, cycle tracking, and reproductive health.',
    category: ArticleCategory.FERTILITY_BASICS,
    type: ContentType.QUIZ,
    level: ContentLevel.INTERMEDIATE,
    author: 'Ovulink Education Team',
    publishDate: '2025-03-01',
    thumbnailUrl: 'https://example.com/images/fertility-quiz.jpg',
    contentUrl: 'https://example.com/quizzes/fertility-knowledge',
    tags: ['quiz', 'fertility basics', 'education', 'self-assessment'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'article-005',
    title: 'Common Fertility Myths Debunked',
    description: 'A fact-based examination of popular fertility myths and misconceptions, with evidence-based explanations.',
    category: ArticleCategory.FERTILITY_BASICS,
    type: ContentType.ARTICLE,
    level: ContentLevel.BEGINNER,
    author: 'Dr. Emily Carter, Reproductive Endocrinologist',
    publishDate: '2025-01-25',
    readTime: 9,
    thumbnailUrl: 'https://example.com/images/fertility-myths.jpg',
    contentUrl: 'https://example.com/articles/fertility-myths-debunked',
    tags: ['myths', 'misconceptions', 'fertility facts', 'education'],
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'article-006',
    title: 'The Impact of Age on Fertility',
    description: 'An in-depth look at how age affects fertility in both men and women, with evidence-based information on what to expect.',
    category: ArticleCategory.MEDICAL,
    type: ContentType.ARTICLE,
    level: ContentLevel.INTERMEDIATE,
    author: 'Dr. Robert Thompson, Reproductive Medicine',
    publishDate: '2025-02-10',
    readTime: 15,
    thumbnailUrl: 'https://example.com/images/age-fertility.jpg',
    contentUrl: 'https://example.com/articles/age-impact-fertility',
    tags: ['age', 'fertility decline', 'reproductive aging', 'egg quality'],
    isFavorite: false,
    isRead: false,
  },
];

// Get all educational content
export const getAllContent = (): EducationalContent[] => {
  return mockEducationalContent;
};

// Get content by category
export const getContentByCategory = (category: ArticleCategory): EducationalContent[] => {
  return mockEducationalContent.filter(content => content.category === category);
};

// Get content by type
export const getContentByType = (type: ContentType): EducationalContent[] => {
  return mockEducationalContent.filter(content => content.type === type);
};

// Get content by level
export const getContentByLevel = (level: ContentLevel): EducationalContent[] => {
  return mockEducationalContent.filter(content => content.level === level);
};

// Search content by query
export const searchContent = (query: string): EducationalContent[] => {
  const lowerCaseQuery = query.toLowerCase();
  return mockEducationalContent.filter(content => 
    content.title.toLowerCase().includes(lowerCaseQuery) ||
    content.description.toLowerCase().includes(lowerCaseQuery) ||
    content.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};

// Get content by ID
export const getContentById = (id: string): EducationalContent | undefined => {
  return mockEducationalContent.find(content => content.id === id);
};

// Mark content as favorite
export const toggleFavorite = (id: string): EducationalContent | undefined => {
  const contentIndex = mockEducationalContent.findIndex(content => content.id === id);
  if (contentIndex >= 0) {
    mockEducationalContent[contentIndex] = {
      ...mockEducationalContent[contentIndex],
      isFavorite: !mockEducationalContent[contentIndex].isFavorite,
    };
    return mockEducationalContent[contentIndex];
  }
  return undefined;
};

// Mark content as read
export const markAsRead = (id: string): EducationalContent | undefined => {
  const contentIndex = mockEducationalContent.findIndex(content => content.id === id);
  if (contentIndex >= 0) {
    mockEducationalContent[contentIndex] = {
      ...mockEducationalContent[contentIndex],
      isRead: true,
    };
    return mockEducationalContent[contentIndex];
  }
  return undefined;
};

// Get favorite content
export const getFavoriteContent = (): EducationalContent[] => {
  return mockEducationalContent.filter(content => content.isFavorite);
};

// Get unread content
export const getUnreadContent = (): EducationalContent[] => {
  return mockEducationalContent.filter(content => !content.isRead);
};

// Get recommended content based on user profile
export const getRecommendedContent = (
  gender: 'male' | 'female',
  interests: ArticleCategory[] = []
): EducationalContent[] => {
  // Filter content based on gender
  let filteredContent = mockEducationalContent;
  
  if (gender === 'male') {
    // Prioritize male fertility content for male users
    filteredContent = [
      ...mockEducationalContent.filter(content => content.category === ArticleCategory.MALE_FERTILITY),
      ...mockEducationalContent.filter(content => content.category !== ArticleCategory.MALE_FERTILITY),
    ];
  } else {
    // Prioritize cycle tracking and female-specific content for female users
    filteredContent = [
      ...mockEducationalContent.filter(content => 
        content.category === ArticleCategory.CYCLE_TRACKING || 
        content.category === ArticleCategory.FERTILITY_BASICS
      ),
      ...mockEducationalContent.filter(content => 
        content.category !== ArticleCategory.CYCLE_TRACKING && 
        content.category !== ArticleCategory.FERTILITY_BASICS
      ),
    ];
  }
  
  // Further prioritize content based on user interests
  if (interests.length > 0) {
    filteredContent = [
      ...filteredContent.filter(content => interests.includes(content.category)),
      ...filteredContent.filter(content => !interests.includes(content.category)),
    ];
  }
  
  // Return top 5 recommended content
  return filteredContent.slice(0, 5);
};

export default {
  getAllContent,
  getContentByCategory,
  getContentByType,
  getContentByLevel,
  searchContent,
  getContentById,
  toggleFavorite,
  markAsRead,
  getFavoriteContent,
  getUnreadContent,
  getRecommendedContent,
};
