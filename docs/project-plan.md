# Ovulink - Fertility Tracker App Project Plan

## Project Overview

Ovulink is a comprehensive fertility tracking application designed for couples trying to conceive. The app provides gender-specific views, detailed health tracking, cycle prediction, shared calendars, partner synchronization features, and educational content to help couples optimize their chances of conception.

## Target Users

- Couples (heterosexual) trying to conceive
- Age range: 13-46 years old
- Primary focus on mobile device users

## Platform Requirements

- Cross-platform application (Web, iOS, Android, Desktop)
- Primary focus on mobile platforms (iOS and Android)
- Responsive design for various screen sizes

## Technical Architecture

### Frontend Architecture

#### Technology Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **UI Component Library**: React Native Paper
- **Navigation**: React Navigation
- **Form Handling**: Formik with Yup validation
- **API Integration**: Axios
- **Authentication**: Firebase Auth
- **Local Storage**: AsyncStorage

#### Key Frontend Components

1. **Authentication Module**
   - Login/Registration screens
   - Profile management
   - Partner linking functionality

2. **Female Health Tracking Module**
   - Menstrual cycle tracking
   - Basal body temperature tracking
   - Cervical mucus tracking
   - Ovulation prediction

3. **Male Health Tracking Module**
   - Sperm health parameters tracking
   - Sperm health scoring system
   - Trend analysis

4. **Calendar Module**
   - Shared calendar functionality
   - Appointment scheduling
   - Fertility event visualization
   - Intimacy logging

5. **Educational Content Module**
   - Evidence-based fertility information
   - Personalized recommendations
   - Content interaction (bookmarks, likes, etc.)

### Backend Architecture

#### Technology Stack

- **Framework**: Node.js with Express
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Firebase Authentication + JWT
- **API Design**: RESTful API
- **Validation**: Joi/Yup
- **Error Handling**: Centralized middleware

#### Key Backend Components

1. **Authentication Service**
   - User registration and login
   - JWT token management
   - Partner linking

2. **Female Health Service**
   - Menstrual cycle data management
   - Temperature data management
   - Cervical mucus data management
   - Ovulation prediction algorithms

3. **Male Health Service**
   - Sperm health data management
   - Sperm health scoring algorithms
   - Trend analysis

4. **Calendar Service**
   - Appointment management
   - Shared calendar synchronization
   - Fertility event generation
   - Intimacy logging

5. **Educational Content Service**
   - Content management
   - Content recommendation engine
   - User interaction tracking

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  birth_date DATE,
  phone_number VARCHAR(20),
  height DECIMAL,
  weight DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Partner Links Table
```sql
CREATE TABLE partner_links (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  partner_id INTEGER REFERENCES users(id) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, partner_id)
);
```

#### Menstrual Cycles Table
```sql
CREATE TABLE menstrual_cycles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  flow VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Temperatures Table
```sql
CREATE TABLE temperatures (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  value DECIMAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);
```

#### Cervical Mucus Table
```sql
CREATE TABLE cervical_mucus (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);
```

#### Sperm Health Table
```sql
CREATE TABLE sperm_health (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  count INTEGER,
  motility INTEGER,
  morphology INTEGER,
  volume DECIMAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);
```

#### Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  notes TEXT,
  reminder_time INTEGER,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Intimacy Logs Table
```sql
CREATE TABLE intimacy_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  is_protected BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Educational Content Table
```sql
CREATE TABLE educational_content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags VARCHAR[] DEFAULT '{}',
  author VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Content Interactions Table
```sql
CREATE TABLE content_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  content_id INTEGER REFERENCES educational_content(id) NOT NULL,
  interaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id, interaction_type)
);
```

#### Notification Preferences Table
```sql
CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  email BOOLEAN DEFAULT true,
  push BOOLEAN DEFAULT true,
  sms BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/token` - Exchange Firebase ID token for JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### User Endpoints

- `POST /api/users/register` - Register a new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/partner` - Link partner
- `PUT /api/users/partner/:linkId` - Update partner link status
- `GET /api/users/partner` - Get partner links
- `PUT /api/users/notifications` - Update notification preferences
- `GET /api/users/notifications` - Get notification preferences

### Female Health Endpoints

- `POST /api/female-health/cycles` - Create a menstrual cycle record
- `PUT /api/female-health/cycles/:cycleId` - Update a menstrual cycle record
- `GET /api/female-health/cycles/:cycleId` - Get a menstrual cycle record
- `GET /api/female-health/cycles` - Get all menstrual cycle records
- `DELETE /api/female-health/cycles/:cycleId` - Delete a menstrual cycle record
- `POST /api/female-health/temperatures` - Create a temperature record
- `PUT /api/female-health/temperatures/:tempId` - Update a temperature record
- `GET /api/female-health/temperatures/:tempId` - Get a temperature record
- `GET /api/female-health/temperatures` - Get all temperature records
- `DELETE /api/female-health/temperatures/:tempId` - Delete a temperature record
- `POST /api/female-health/cervical-mucus` - Create a cervical mucus record
- `PUT /api/female-health/cervical-mucus/:mucusId` - Update a cervical mucus record
- `GET /api/female-health/cervical-mucus/:mucusId` - Get a cervical mucus record
- `GET /api/female-health/cervical-mucus` - Get all cervical mucus records
- `DELETE /api/female-health/cervical-mucus/:mucusId` - Delete a cervical mucus record
- `GET /api/female-health/predict-ovulation` - Predict ovulation

### Male Health Endpoints

- `POST /api/male-health/sperm` - Create a sperm health record
- `PUT /api/male-health/sperm/:spermId` - Update a sperm health record
- `GET /api/male-health/sperm/:spermId` - Get a sperm health record
- `GET /api/male-health/sperm` - Get all sperm health records
- `DELETE /api/male-health/sperm/:spermId` - Delete a sperm health record
- `POST /api/male-health/calculate-score` - Calculate sperm health score
- `GET /api/male-health/trends` - Get sperm health trends
- `GET /api/male-health/latest` - Get latest sperm health record and score

### Calendar Endpoints

- `POST /api/calendar/appointments` - Create an appointment
- `PUT /api/calendar/appointments/:appointmentId` - Update an appointment
- `GET /api/calendar/appointments/:appointmentId` - Get an appointment
- `GET /api/calendar/appointments` - Get all appointments
- `DELETE /api/calendar/appointments/:appointmentId` - Delete an appointment
- `POST /api/calendar/intimacy` - Create an intimacy log
- `PUT /api/calendar/intimacy/:intimacyId` - Update an intimacy log
- `GET /api/calendar/intimacy/:intimacyId` - Get an intimacy log
- `GET /api/calendar/intimacy` - Get all intimacy logs
- `DELETE /api/calendar/intimacy/:intimacyId` - Delete an intimacy log
- `GET /api/calendar/fertility-events` - Get upcoming fertility events

### Educational Content Endpoints

- `GET /api/education/content` - Get all educational content
- `GET /api/education/content/:contentId` - Get educational content by ID
- `GET /api/education/category/:category` - Get educational content by category
- `POST /api/education/tags` - Get educational content by tags
- `GET /api/education/search` - Search educational content
- `POST /api/education/interaction` - Create a content interaction
- `DELETE /api/education/interaction/:contentId/:interactionType` - Delete a content interaction
- `GET /api/education/interactions` - Get user interactions with content
- `GET /api/education/recommended` - Get recommended content for a user
- `GET /api/education/popular` - Get popular content
- `GET /api/education/categories` - Get content categories
- `GET /api/education/tags` - Get content tags

## UI/UX Design

### Design System

- **Color Palette**
  - Primary: Purple (#7E57C2) - Main brand color
  - Secondary: Pink (#FF6B8B) - Accent color
  - Gender-specific: Female (Pink #FF6B8B), Male (Blue #4FC3F7)
  - Fertility status: Fertile (Green #4CAF50), Ovulation (Orange #FF9800), Period (Red #F44336)
  - Neutral: White, Black, Grays

- **Typography**
  - Font Family: Poppins
  - Headings: Bold, Medium
  - Body: Regular, Light

- **Components**
  - Cards with subtle shadows
  - Rounded buttons and inputs
  - Gender-specific UI elements
  - Interactive charts and calendars

### Key Screens

1. **Onboarding & Authentication**
   - Welcome screen
   - Login/Registration
   - Gender selection
   - Partner linking

2. **Home Dashboard**
   - Fertility status overview
   - Partner connection status
   - Upcoming appointments
   - Educational content recommendations

3. **Female Health Tracking**
   - Cycle tracking
   - Temperature tracking
   - Cervical mucus tracking
   - Ovulation prediction

4. **Male Health Tracking**
   - Sperm health tracking
   - Sperm health score visualization
   - Trend analysis

5. **Calendar**
   - Monthly/weekly/daily views
   - Fertility window visualization
   - Appointment scheduling
   - Intimacy logging

6. **Educational Content**
   - Content categories
   - Article reading view
   - Bookmarking and interaction
   - Personalized recommendations

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

- Set up project structure
- Implement authentication system
- Create basic navigation
- Set up database schema
- Implement core API endpoints

### Phase 2: Core Features (Weeks 3-5)

- Implement female health tracking
- Implement male health tracking
- Develop calendar functionality
- Create basic educational content system

### Phase 3: Integration & Enhancement (Weeks 6-8)

- Implement partner synchronization
- Develop prediction algorithms
- Enhance UI/UX
- Implement educational content recommendation

### Phase 4: Testing & Refinement (Weeks 9-10)

- Comprehensive testing
- Performance optimization
- Bug fixing
- User feedback implementation

### Phase 5: Launch Preparation (Weeks 11-12)

- Final polishing
- Documentation
- Deployment setup
- Launch preparation

## Testing Strategy

- **Unit Testing**: Individual components and functions
- **Integration Testing**: API endpoints and service interactions
- **End-to-End Testing**: Complete user flows
- **Performance Testing**: Load and stress testing
- **Usability Testing**: User feedback and experience

## Deployment Strategy

- **Frontend**: Expo build system for native apps, Firebase Hosting for web
- **Backend**: Cloud hosting (AWS, Google Cloud, or Azure)
- **Database**: Managed PostgreSQL service (Supabase)
- **CI/CD**: GitHub Actions for automated testing and deployment

## Maintenance Plan

- Regular updates and feature enhancements
- Bug fixing and performance optimization
- User feedback collection and implementation
- Security updates and monitoring

## Conclusion

This project plan outlines the development of Ovulink, a comprehensive fertility tracking application for couples trying to conceive. The app will provide gender-specific views, detailed health tracking, cycle prediction, shared calendars, partner synchronization features, and educational content to help couples optimize their chances of conception.
