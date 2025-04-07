# Ovulink - Fertility Tracker App

Ovulink is a comprehensive fertility tracking application designed for couples trying to conceive. The app provides gender-specific views, detailed health tracking, cycle prediction, shared calendars, partner synchronization features, and educational content to help couples optimize their chances of conception.

## Features

- **Gender-Specific Views**: Tailored interfaces and tracking tools for both men and women
- **Daily Health Logs**: Track menstrual cycles, basal body temperature, cervical mucus, and sperm health
- **Cycle Prediction**: Advanced algorithms to predict ovulation and fertile windows
- **Shared Calendars**: Synchronize fertility events, appointments, and intimacy logs between partners
- **Sperm Health Tracking**: Monitor and score sperm health parameters
- **Partner Sync**: Connect with your partner to share relevant fertility data
- **Educational Content**: Access evidence-based information about fertility and conception
- **Reminders**: Get notifications for tracking, appointments, and fertile windows

## Tech Stack

### Frontend

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **UI Component Library**: React Native Paper
- **Navigation**: React Navigation
- **Form Handling**: Formik with Yup validation
- **API Integration**: Axios
- **Authentication**: Firebase Auth
- **Local Storage**: AsyncStorage

### Backend

- **Framework**: Node.js with Express
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Firebase Authentication + JWT
- **API Design**: RESTful API
- **Validation**: Joi/Yup
- **Error Handling**: Centralized middleware

## Project Structure

```
ovulink/
├── client/                  # React Native client
│   ├── assets/              # Images, fonts, etc.
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── constants/       # Constants and configuration
│   │   ├── hooks/           # Custom hooks
│   │   ├── navigation/      # Navigation configuration
│   │   ├── redux/           # Redux store and slices
│   │   ├── screens/         # Screen components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── App.js               # Main app component
│   └── package.json         # Client dependencies
├── server/                  # Node.js server
│   ├── src/
│   │   ├── config/          # Server configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # Database setup and migrations
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   └── package.json         # Server dependencies
├── docs/                    # Documentation
│   ├── API.md               # API documentation
│   └── project-plan.md      # Project plan and architecture
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── package.json             # Root package.json
└── README.md                # Project README
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Firebase project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ovulink.git
cd ovulink
```

2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your configuration
```

4. Set up the database:

```bash
cd server
npm run db:setup
```

5. Start the development servers:

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the React Native app
cd client
npm start
```

## Development

### Running the App

- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`

### Testing

- **Run tests**: `npm test`
- **Run linter**: `npm run lint`

## Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting service such as:

- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Digital Ocean App Platform

### Mobile App Deployment

The React Native app can be built and deployed using Expo's build service:

```bash
cd client
expo build:ios
expo build:android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Supabase](https://supabase.io/)
- [Firebase](https://firebase.google.com/)
