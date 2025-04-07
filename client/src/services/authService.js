import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for demo
const MOCK_FEMALE_USER = {
  id: '1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  gender: 'female',
  birthDate: '1990-01-01',
  height: 165,
  weight: 60,
  partnerLinked: true,
  partnerId: '2',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-04-01T00:00:00.000Z',
};

const MOCK_MALE_USER = {
  id: '2',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'male',
  birthDate: '1988-05-15',
  height: 180,
  weight: 75,
  partnerLinked: true,
  partnerId: '1',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-04-01T00:00:00.000Z',
};

const MOCK_TOKEN = 'mock-jwt-token-for-demo-purposes-only';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise} - Response with mock data
   */
  register: async (userData) => {
    await delay(500); // Simulate network delay
    
    // Determine which mock user to return based on gender
    const user = userData.gender === 'female' ? MOCK_FEMALE_USER : MOCK_MALE_USER;
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('token', MOCK_TOKEN);
    
    return {
      user,
      token: MOCK_TOKEN,
    };
  },
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with mock data
   */
  login: async (email, password) => {
    await delay(500); // Simulate network delay
    
    // Determine which mock user to return based on email
    const user = email.includes('jane') ? MOCK_FEMALE_USER : MOCK_MALE_USER;
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('token', MOCK_TOKEN);
    
    return {
      user,
      token: MOCK_TOKEN,
    };
  },
  
  /**
   * Login with Firebase
   * @param {string} idToken - Firebase ID token
   * @returns {Promise} - Response with mock data
   */
  loginWithFirebase: async (idToken) => {
    await delay(500); // Simulate network delay
    
    // For demo, always return female user
    const user = MOCK_FEMALE_USER;
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('token', MOCK_TOKEN);
    
    return {
      user,
      token: MOCK_TOKEN,
    };
  },
  
  /**
   * Get current user
   * @returns {Promise} - Response with mock data
   */
  getCurrentUser: async () => {
    await delay(300); // Simulate network delay
    
    // Check if token exists
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // For demo, always return female user
    return {
      user: MOCK_FEMALE_USER,
    };
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data
   * @returns {Promise} - Response with mock data
   */
  updateProfile: async (userData) => {
    await delay(500); // Simulate network delay
    
    // Merge userData with mock user
    const user = {
      ...MOCK_FEMALE_USER,
      ...userData,
    };
    
    return {
      user,
    };
  },
  
  /**
   * Refresh token
   * @returns {Promise} - Response with mock data
   */
  refreshToken: async () => {
    await delay(300); // Simulate network delay
    
    // Generate new mock token
    const newToken = MOCK_TOKEN + '-refreshed';
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('token', newToken);
    
    return {
      token: newToken,
    };
  },
  
  /**
   * Link partner
   * @param {string} partnerEmail - Partner email
   * @returns {Promise} - Response with mock data
   */
  linkPartner: async (partnerEmail) => {
    await delay(500); // Simulate network delay
    
    return {
      linkId: '12345',
      status: 'pending',
      partnerEmail,
    };
  },
  
  /**
   * Update partner link status
   * @param {string} linkId - Link ID
   * @param {string} status - Link status
   * @returns {Promise} - Response with mock data
   */
  updatePartnerLinkStatus: async (linkId, status) => {
    await delay(500); // Simulate network delay
    
    return {
      linkId,
      status,
      partnerEmail: 'partner@example.com',
    };
  },
  
  /**
   * Get partner links
   * @returns {Promise} - Response with mock data
   */
  getPartnerLinks: async () => {
    await delay(300); // Simulate network delay
    
    return {
      links: [
        {
          linkId: '12345',
          status: 'accepted',
          partnerEmail: 'partner@example.com',
        },
      ],
    };
  },
};

export default authService;
