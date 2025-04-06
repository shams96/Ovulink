import { Cycle, DailyLog, SpermTest } from '../types';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1',
  apiKey: process.env.CLAUDE_API_KEY || '',
  model: 'claude-3-opus-20240229',
  maxTokens: 1000,
  costPerToken: 0.00001, // Example cost per token in USD
  costLimit: 5, // Maximum cost limit in USD
};

// Track API usage costs
let totalTokensUsed = 0;
let totalCostIncurred = 0;

interface ApiUsage {
  totalTokensUsed: number;
  totalCostIncurred: number;
  remainingBudget: number;
}

// Interface for prediction results
export interface FertilityPrediction {
  predictedOvulationDate: string;
  predictedPeriodDate: string;
  fertilityWindow: {
    startDate: string;
    endDate: string;
  };
  confidence: number;
  explanation: string;
}

export interface PersonalizedRecommendation {
  type: 'lifestyle' | 'nutrition' | 'exercise' | 'medical' | 'other';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  sources?: string[];
}

export interface SymptomAnalysis {
  possibleCauses: string[];
  recommendations: PersonalizedRecommendation[];
  shouldConsultDoctor: boolean;
}

/**
 * Tracks API usage and costs
 */
export const getApiUsage = (): ApiUsage => {
  return {
    totalTokensUsed,
    totalCostIncurred,
    remainingBudget: API_CONFIG.costLimit - totalCostIncurred,
  };
};

/**
 * Resets API usage tracking
 */
export const resetApiUsage = (): void => {
  totalTokensUsed = 0;
  totalCostIncurred = 0;
};

/**
 * Updates API cost limit
 */
export const updateCostLimit = (newLimit: number): void => {
  API_CONFIG.costLimit = newLimit;
};

/**
 * Checks if making an API call would exceed the cost limit
 */
const wouldExceedCostLimit = (estimatedTokens: number): boolean => {
  const estimatedCost = estimatedTokens * API_CONFIG.costPerToken;
  return totalCostIncurred + estimatedCost > API_CONFIG.costLimit;
};

/**
 * Tracks token usage and cost after an API call
 */
const trackUsage = (tokensUsed: number): void => {
  totalTokensUsed += tokensUsed;
  totalCostIncurred += tokensUsed * API_CONFIG.costPerToken;
};

/**
 * Makes a request to the Claude API
 */
const makeClaudeRequest = async (prompt: string, estimatedTokens = 1000): Promise<string> => {
  if (wouldExceedCostLimit(estimatedTokens)) {
    throw new Error('API cost limit would be exceeded. Please increase the limit or reset usage.');
  }
  
  if (!API_CONFIG.apiKey) {
    throw new Error('Claude API key is not configured. Please set the CLAUDE_API_KEY environment variable.');
  }
  
  try {
    // This is a mock implementation - in a real app, you would make an actual API call
    console.log(`Making Claude API request with prompt: ${prompt.substring(0, 100)}...`);
    
    // Simulate API response
    const response = `This is a simulated response from Claude API for the prompt: ${prompt.substring(0, 50)}...`;
    
    // Simulate token usage
    const tokensUsed = Math.floor(prompt.length / 4) + Math.floor(response.length / 4);
    trackUsage(tokensUsed);
    
    return response;
  } catch (error) {
    console.error('Error making Claude API request:', error);
    throw error;
  }
};

/**
 * Predicts fertility based on cycle data
 */
export const predictFertility = async (
  cycles: Cycle[],
  currentCycle: Cycle | null,
  recentLogs: DailyLog[]
): Promise<FertilityPrediction> => {
  if (!currentCycle) {
    throw new Error('Current cycle data is required for fertility prediction');
  }
  
  // Create a prompt for the AI model
  const prompt = `
    Based on the following cycle and health data, predict fertility information:
    
    Past Cycles: ${JSON.stringify(cycles.slice(-3))}
    Current Cycle: ${JSON.stringify(currentCycle)}
    Recent Health Logs: ${JSON.stringify(recentLogs.slice(-7))}
    
    Please provide:
    1. Predicted ovulation date
    2. Predicted next period date
    3. Fertility window (start and end dates)
    4. Confidence level (0-1)
    5. Brief explanation of the prediction
  `;
  
  // In a real implementation, you would parse the AI response
  // For now, we'll return mock data
  
  // Calculate average cycle length from past cycles
  const avgCycleLength = cycles.length > 1
    ? cycles.slice(-3).reduce((sum, cycle) => {
        if (cycle.endDate) {
          const start = new Date(cycle.startDate);
          const end = new Date(cycle.endDate);
          return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        return sum + 28; // Default to 28 days if endDate is not available
      }, 0) / Math.min(cycles.length, 3)
    : 28;
  
  // Calculate predicted ovulation (typically 14 days before next period)
  const cycleStartDate = new Date(currentCycle.startDate);
  const predictedOvulationDate = new Date(cycleStartDate);
  predictedOvulationDate.setDate(cycleStartDate.getDate() + Math.round(avgCycleLength - 14));
  
  // Calculate predicted period date
  const predictedPeriodDate = new Date(cycleStartDate);
  predictedPeriodDate.setDate(cycleStartDate.getDate() + Math.round(avgCycleLength));
  
  // Calculate fertility window (typically 5 days before ovulation and 1 day after)
  const fertilityWindowStart = new Date(predictedOvulationDate);
  fertilityWindowStart.setDate(predictedOvulationDate.getDate() - 5);
  
  const fertilityWindowEnd = new Date(predictedOvulationDate);
  fertilityWindowEnd.setDate(predictedOvulationDate.getDate() + 1);
  
  return {
    predictedOvulationDate: predictedOvulationDate.toISOString().split('T')[0],
    predictedPeriodDate: predictedPeriodDate.toISOString().split('T')[0],
    fertilityWindow: {
      startDate: fertilityWindowStart.toISOString().split('T')[0],
      endDate: fertilityWindowEnd.toISOString().split('T')[0],
    },
    confidence: 0.85,
    explanation: "Prediction based on your average cycle length and recent symptoms. The fertility window includes the 5 days before ovulation and the day of ovulation, when pregnancy is most likely to occur.",
  };
};

/**
 * Generates personalized recommendations based on user data
 */
export const getPersonalizedRecommendations = async (
  cycles: Cycle[],
  logs: DailyLog[],
  spermTests?: SpermTest[]
): Promise<PersonalizedRecommendation[]> => {
  // Create a prompt for the AI model
  const prompt = `
    Based on the following health data, provide personalized recommendations:
    
    Cycles: ${JSON.stringify(cycles.slice(-2))}
    Health Logs: ${JSON.stringify(logs.slice(-7))}
    ${spermTests ? `Sperm Tests: ${JSON.stringify(spermTests.slice(-2))}` : ''}
    
    Please provide 3-5 personalized recommendations to improve fertility health.
    For each recommendation, include:
    1. Type (lifestyle, nutrition, exercise, medical, other)
    2. Title
    3. Description
    4. Priority (high, medium, low)
    5. Sources (optional)
  `;
  
  // Mock recommendations
  return [
    {
      type: 'lifestyle',
      title: 'Improve Sleep Quality',
      description: 'Your logs show irregular sleep patterns. Aim for 7-8 hours of quality sleep each night to help regulate hormones that affect fertility.',
      priority: 'high',
      sources: ['https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4402098/']
    },
    {
      type: 'nutrition',
      title: 'Increase Water Intake',
      description: 'You\'re consistently logging less than 6 glasses of water daily. Proper hydration supports cervical mucus production and overall reproductive health.',
      priority: 'medium',
    },
    {
      type: 'exercise',
      title: 'Moderate Exercise Intensity',
      description: 'Your exercise intensity is often high. While exercise is beneficial, excessive high-intensity workouts can impact hormone levels. Consider balancing with moderate activities like walking or yoga.',
      priority: 'medium',
    },
    {
      type: 'medical',
      title: 'Consider Prenatal Vitamins',
      description: 'If you\'re actively trying to conceive, consider starting a prenatal vitamin with folic acid at least 3 months before conception.',
      priority: 'high',
      sources: ['https://www.cdc.gov/ncbddd/folicacid/recommendations.html']
    }
  ];
};

/**
 * Analyzes symptoms using NLP
 */
export const analyzeSymptoms = async (
  symptoms: string[],
  recentLogs: DailyLog[]
): Promise<SymptomAnalysis> => {
  // Create a prompt for the AI model
  const prompt = `
    Analyze the following symptoms and recent health logs:
    
    Symptoms: ${JSON.stringify(symptoms)}
    Recent Health Logs: ${JSON.stringify(recentLogs.slice(-7))}
    
    Please provide:
    1. Possible causes related to fertility
    2. Recommendations
    3. Whether the user should consult a doctor
  `;
  
  // Mock analysis
  return {
    possibleCauses: [
      'Hormonal fluctuations during your cycle',
      'Potential stress-related symptoms',
      'Common premenstrual symptoms'
    ],
    recommendations: [
      {
        type: 'lifestyle',
        title: 'Stress Management',
        description: 'Practice relaxation techniques like deep breathing or meditation to help manage stress levels, which can affect hormone balance.',
        priority: 'high'
      },
      {
        type: 'nutrition',
        title: 'Anti-inflammatory Foods',
        description: 'Consider incorporating more anti-inflammatory foods like berries, fatty fish, and leafy greens to help reduce symptom severity.',
        priority: 'medium'
      }
    ],
    shouldConsultDoctor: false
  };
};

/**
 * Analyzes sperm test results and provides recommendations
 */
export const analyzeSpermHealth = async (
  spermTests: SpermTest[],
  logs: DailyLog[]
): Promise<PersonalizedRecommendation[]> => {
  if (spermTests.length === 0) {
    throw new Error('Sperm test data is required for analysis');
  }
  
  // Create a prompt for the AI model
  const prompt = `
    Analyze the following sperm test results and health logs:
    
    Sperm Tests: ${JSON.stringify(spermTests)}
    Recent Health Logs: ${JSON.stringify(logs.slice(-7))}
    
    Please provide personalized recommendations to improve sperm health.
  `;
  
  // Mock recommendations
  const latestTest = spermTests[0];
  const recommendations: PersonalizedRecommendation[] = [];
  
  if (latestTest.count < 15) {
    recommendations.push({
      type: 'lifestyle',
      title: 'Reduce Heat Exposure',
      description: 'Avoid hot baths, saunas, and keeping laptops on your lap for extended periods. Excessive heat can reduce sperm production.',
      priority: 'high'
    });
  }
  
  if (latestTest.motility < 40) {
    recommendations.push({
      type: 'nutrition',
      title: 'Increase Antioxidant Intake',
      description: 'Foods rich in antioxidants like vitamins C and E, selenium, and zinc can help improve sperm motility. Consider adding more colorful fruits, nuts, and seafood to your diet.',
      priority: 'high',
      sources: ['https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6770559/']
    });
  }
  
  recommendations.push({
    type: 'lifestyle',
    title: 'Limit Alcohol Consumption',
    description: 'Excessive alcohol can negatively impact sperm quality. Try to limit consumption to improve overall reproductive health.',
    priority: 'medium'
  });
  
  return recommendations;
};

export default {
  predictFertility,
  getPersonalizedRecommendations,
  analyzeSymptoms,
  analyzeSpermHealth,
  getApiUsage,
  resetApiUsage,
  updateCostLimit
};
