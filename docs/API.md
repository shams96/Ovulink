# Ovulink API Documentation

This document outlines the API endpoints for the Ovulink fertility tracking application.

## Base URL

```
https://api.ovulink.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

All API requests (except for authentication endpoints) require authentication using a JWT token.

### Headers

```
Authorization: Bearer <token>
```

## Response Format

All responses are returned in JSON format with the following structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

For errors:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Error Codes

- `INVALID_REQUEST`: The request is invalid
- `UNAUTHORIZED`: Authentication is required
- `FORBIDDEN`: The user does not have permission
- `NOT_FOUND`: The requested resource was not found
- `VALIDATION_ERROR`: Validation error
- `INTERNAL_ERROR`: Internal server error

## API Endpoints

### Authentication

#### Exchange Firebase ID token for JWT

```
POST /auth/token
```

**Request Body:**

```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 3600,
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "displayName": "User Name",
      "gender": "female",
      "birthDate": "1990-01-01"
    }
  }
}
```

#### Refresh JWT token

```
POST /auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": 3600
  }
}
```

#### Get current user

```
GET /auth/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "displayName": "User Name",
      "gender": "female",
      "birthDate": "1990-01-01",
      "phoneNumber": "+1234567890",
      "height": 165,
      "weight": 60,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### User Management

#### Register a new user

```
POST /users/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "displayName": "User Name",
  "gender": "female",
  "birthDate": "1990-01-01",
  "phoneNumber": "+1234567890",
  "height": 165,
  "weight": 60
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "displayName": "User Name",
      "gender": "female",
      "birthDate": "1990-01-01",
      "phoneNumber": "+1234567890",
      "height": 165,
      "weight": 60,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 3600
  }
}
```

#### Get user profile

```
GET /users/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-id",
      "email": "user@example.com",
      "displayName": "User Name",
      "gender": "female",
      "birthDate": "1990-01-01",
      "phoneNumber": "+1234567890",
      "height": 165,
      "weight": 60,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update user profile

```
PUT /users/profile
```

**Request Body:**

```json
{
  "displayName": "Updated Name",
  "phoneNumber": "+1987654321",
  "height": 170,
  "weight": 65
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "displayName": "Updated Name",
      "gender": "female",
      "birthDate": "1990-01-01",
      "phoneNumber": "+1987654321",
      "height": 170,
      "weight": 65,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

#### Link partner

```
POST /users/partner
```

**Request Body:**

```json
{
  "partnerEmail": "partner@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "linkId": "link-id",
    "status": "pending"
  },
  "message": "Partner link request sent"
}
```

#### Update partner link status

```
PUT /users/partner/:linkId
```

**Request Body:**

```json
{
  "status": "accepted" // or "rejected"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "linkId": "link-id",
    "status": "accepted"
  },
  "message": "Partner link accepted"
}
```

#### Get partner links

```
GET /users/partner
```

**Response:**

```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": "link-id",
        "userId": "user-id",
        "partnerId": "partner-id",
        "status": "accepted",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z",
        "partner": {
          "id": "partner-id",
          "displayName": "Partner Name",
          "gender": "male"
        }
      }
    ]
  }
}
```

### Female Health

#### Create a menstrual cycle record

```
POST /female-health/cycles
```

**Request Body:**

```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-05",
  "flow": "medium",
  "notes": "Some notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cycle": {
      "id": "cycle-id",
      "userId": "user-id",
      "startDate": "2025-01-01",
      "endDate": "2025-01-05",
      "flow": "medium",
      "notes": "Some notes",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Cycle record created successfully"
}
```

#### Get all menstrual cycle records

```
GET /female-health/cycles
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "cycles": [
      {
        "id": "cycle-id",
        "userId": "user-id",
        "startDate": "2025-01-01",
        "endDate": "2025-01-05",
        "flow": "medium",
        "notes": "Some notes",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Create a temperature record

```
POST /female-health/temperatures
```

**Request Body:**

```json
{
  "date": "2025-01-01",
  "time": "08:00:00",
  "value": 36.7,
  "notes": "Some notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "temperature": {
      "id": "temp-id",
      "userId": "user-id",
      "date": "2025-01-01",
      "time": "08:00:00",
      "value": 36.7,
      "notes": "Some notes",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Temperature record created successfully"
}
```

#### Get all temperature records

```
GET /female-health/temperatures
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "temperatures": [
      {
        "id": "temp-id",
        "userId": "user-id",
        "date": "2025-01-01",
        "time": "08:00:00",
        "value": 36.7,
        "notes": "Some notes",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Create a cervical mucus record

```
POST /female-health/cervical-mucus
```

**Request Body:**

```json
{
  "date": "2025-01-01",
  "type": "egg-white",
  "amount": "abundant",
  "notes": "Some notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cervicalMucus": {
      "id": "mucus-id",
      "userId": "user-id",
      "date": "2025-01-01",
      "type": "egg-white",
      "amount": "abundant",
      "notes": "Some notes",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Cervical mucus record created successfully"
}
```

#### Get all cervical mucus records

```
GET /female-health/cervical-mucus
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "cervicalMucus": [
      {
        "id": "mucus-id",
        "userId": "user-id",
        "date": "2025-01-01",
        "type": "egg-white",
        "amount": "abundant",
        "notes": "Some notes",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Predict ovulation

```
GET /female-health/predict-ovulation
```

**Response:**

```json
{
  "success": true,
  "data": {
    "prediction": {
      "ovulationDate": "2025-01-14",
      "fertileWindowStart": "2025-01-10",
      "fertileWindowEnd": "2025-01-15",
      "nextPeriodStart": "2025-01-28",
      "confidence": 0.85
    }
  }
}
```

### Male Health

#### Create a sperm health record

```
POST /male-health/sperm
```

**Request Body:**

```json
{
  "date": "2025-01-01",
  "count": 60,
  "motility": 70,
  "morphology": 80,
  "volume": 3.5,
  "notes": "Some notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "spermHealth": {
      "id": "sperm-id",
      "userId": "user-id",
      "date": "2025-01-01",
      "count": 60,
      "motility": 70,
      "morphology": 80,
      "volume": 3.5,
      "notes": "Some notes",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Sperm health record created successfully"
}
```

#### Get all sperm health records

```
GET /male-health/sperm
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "spermHealth": [
      {
        "id": "sperm-id",
        "userId": "user-id",
        "date": "2025-01-01",
        "count": 60,
        "motility": 70,
        "morphology": 80,
        "volume": 3.5,
        "notes": "Some notes",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Calculate sperm health score

```
POST /male-health/calculate-score
```

**Request Body:**

```json
{
  "count": 60,
  "motility": 70,
  "morphology": 80,
  "volume": 3.5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "score": 85,
    "category": "Excellent",
    "recommendations": [
      "Maintain a healthy diet",
      "Exercise regularly",
      "Avoid excessive alcohol consumption"
    ]
  }
}
```

#### Get sperm health trends

```
GET /male-health/trends
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "trends": {
      "count": [
        { "date": "2025-01-01", "value": 60 },
        { "date": "2025-02-01", "value": 65 }
      ],
      "motility": [
        { "date": "2025-01-01", "value": 70 },
        { "date": "2025-02-01", "value": 75 }
      ],
      "morphology": [
        { "date": "2025-01-01", "value": 80 },
        { "date": "2025-02-01", "value": 85 }
      ],
      "volume": [
        { "date": "2025-01-01", "value": 3.5 },
        { "date": "2025-02-01", "value": 3.7 }
      ],
      "score": [
        { "date": "2025-01-01", "value": 85 },
        { "date": "2025-02-01", "value": 90 }
      ]
    }
  }
}
```

#### Get latest sperm health record and score

```
GET /male-health/latest
```

**Response:**

```json
{
  "success": true,
  "data": {
    "latest": {
      "id": "sperm-id",
      "userId": "user-id",
      "date": "2025-02-01",
      "count": 65,
      "motility": 75,
      "morphology": 85,
      "volume": 3.7,
      "notes": "Some notes",
      "createdAt": "2025-02-01T00:00:00.000Z",
      "updatedAt": "2025-02-01T00:00:00.000Z"
    },
    "score": {
      "value": 90,
      "category": "Excellent",
      "recommendations": [
        "Maintain a healthy diet",
        "Exercise regularly",
        "Avoid excessive alcohol consumption"
      ]
    }
  }
}
```

### Calendar

#### Create an appointment

```
POST /calendar/appointments
```

**Request Body:**

```json
{
  "title": "Doctor Appointment",
  "date": "2025-01-01",
  "time": "14:30:00",
  "location": "123 Main St",
  "notes": "Some notes",
  "reminderTime": 60,
  "isShared": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "appointment-id",
      "userId": "user-id",
      "title": "Doctor Appointment",
      "date": "2025-01-01",
      "time": "14:30:00",
      "location": "123 Main St",
      "notes": "Some notes",
      "reminderTime": 60,
      "isShared": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Appointment created successfully"
}
```

#### Get all appointments

```
GET /calendar/appointments
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)
- `includePartner`: Include partner appointments (default: true)

**Response:**

```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "appointment-id",
        "userId": "user-id",
        "title": "Doctor Appointment",
        "date": "2025-01-01",
        "time": "14:30:00",
        "location": "123 Main St",
        "notes": "Some notes",
        "reminderTime": 60,
        "isShared": true,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Create an intimacy log

```
POST /calendar/intimacy
```

**Request Body:**

```json
{
  "date": "2025-01-01",
  "time": "22:00:00",
  "isProtected": false,
  "notes": "Some notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "intimacy": {
      "id": "intimacy-id",
      "userId": "user-id",
      "date": "2025-01-01",
      "time": "22:00:00",
      "isProtected": false,
      "notes": "Some notes",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Intimacy log created successfully"
}
```

#### Get all intimacy logs

```
GET /calendar/intimacy
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "intimacy": [
      {
        "id": "intimacy-id",
        "userId": "user-id",
        "date": "2025-01-01",
        "time": "22:00:00",
        "isProtected": false,
        "notes": "Some notes",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Get upcoming fertility events

```
GET /calendar/fertility-events
```

**Query Parameters:**

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "date": "2025-01-01",
        "type": "period",
        "description": "Period start"
      },
      {
        "date": "2025-01-05",
        "type": "period",
        "description": "Period end"
      },
      {
        "date": "2025-01-10",
        "type": "fertile",
        "description": "Fertile window start"
      },
      {
        "date": "2025-01-14",
        "type": "ovulation",
        "description": "Ovulation day"
      },
      {
        "date": "2025-01-15",
        "type": "fertile",
        "description": "Fertile window end"
      },
      {
        "date": "2025-01-28",
        "type": "period",
        "description": "Next period start (predicted)"
      }
    ]
  }
}
```

### Educational Content

#### Get all educational content

```
GET /education/content
```

**Query Parameters:**

- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content-id",
        "title": "Understanding Your Fertility Window",
        "content": "Content text...",
        "category": "Fertility",
        "tags": ["fertility", "ovulation", "conception"],
        "author": "Dr. Jane Smith",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Get educational content by category

```
GET /education/category/:category
```

**Query Parameters:**

- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content-id",
        "title": "Understanding Your Fertility Window",
        "content": "Content text...",
        "category": "Fertility",
        "tags": ["fertility", "ovulation", "conception"],
        "author": "Dr. Jane Smith",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Get educational content by tags

```
POST /education/tags
```

**Request Body:**

```json
{
  "tags": ["fertility", "ovulation"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content-id",
        "title": "Understanding Your Fertility Window",
        "content": "Content text...",
        "category": "Fertility",
        "tags": ["fertility", "ovulation", "conception"],
        "author": "Dr. Jane Smith",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Search educational content

```
GET /education/search
```

**Query Parameters:**

- `query`: Search query
- `limit`: Limit the number of records (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content-id",
        "title": "Understanding Your Fertility Window",
        "content": "Content text...",
        "category": "Fertility",
        "tags": ["fertility", "ovulation", "conception"],
        "author": "Dr. Jane Smith",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Create a content interaction

```
POST /education/interaction
```

**Request Body:**

```json
{
  "contentId": "content-id",
  "interactionType": "bookmark" // or "like", "read", etc.
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "interaction": {
      "id": "interaction-id",
      "userId": "user-id",
      "contentId": "content-id",
      "interactionType": "bookmark",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Interaction created successfully"
}
```

#### Get recommended content for a user

```
GET /education/recommended
```

**Query Parameters:**

- `limit`: Limit the number of records (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content-id",
        "title": "Understanding Your Fertility Window",
        "content": "Content text...",
        "category": "Fertility",
        "tags": ["fertility", "ovulation", "conception"],
        "author": "Dr. Jane Smith",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Data Models

### User

```json
{
  "id": "string",
  "firebaseUid": "string",
  "email": "string",
  "displayName": "string",
  "gender": "string",
  "birthDate": "date",
  "phoneNumber": "string",
  "height": "number",
  "weight": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Partner Link

```json
{
  "id": "string",
  "userId": "string",
  "partnerId": "string",
  "status": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Menstrual Cycle

```json
{
  "id": "string",
  "userId": "string",
  "startDate": "date",
  "endDate": "date",
  "flow": "string",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Temperature

```json
{
  "id": "string",
  "userId": "string",
  "date": "date",
  "time": "time",
  "value": "number",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Cervical Mucus

```json
{
  "id": "string",
  "userId": "string",
  "date": "date",
  "type": "string",
  "amount": "string",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Sperm Health

```json
{
  "id": "string",
  "userId": "string",
  "date": "date",
  "count": "number",
  "motility": "number",
  "morphology": "number",
  "volume": "number",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Appointment

```json
{
  "id": "string",
  "userId": "string",
  "title
