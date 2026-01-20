# Workdays API Documentation

The Workdays API allows users to configure their working days and individual start/end times for each day of the week.

## Endpoints

### 1. Get User's Workdays Configuration

**GET** `/api/workdays/:userId`

Get the workdays configuration for a specific user.

**Authentication:** Required (user must be admin or self)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "timezone": "Europe/Berlin",
  "workdays": [
    {
      "dayOfWeek": "monday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00",
      "durationMinutes": 480,
      "durationFormatted": "8h 0m"
    },
    {
      "dayOfWeek": "tuesday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00",
      "durationMinutes": 480,
      "durationFormatted": "8h 0m"
    },
    // ... all 7 days
  ],
  "totalWeeklyMinutes": 2400,
  "totalWeeklyHours": "40h 0m",
  "averageDailyMinutes": 480,
  "averageDailyHours": "8h 0m",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

---

### 2. Create Workdays Configuration

**POST** `/api/workdays/:userId`

Create a new workdays configuration for a user.

**Authentication:** Required (user must be admin or self)

**Request Body:**
```json
{
  "timezone": "Europe/Berlin",
  "workdays": [
    {
      "dayOfWeek": "monday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "dayOfWeek": "tuesday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "dayOfWeek": "wednesday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "dayOfWeek": "thursday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "dayOfWeek": "friday",
      "isWorkday": true,
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "dayOfWeek": "saturday",
      "isWorkday": false,
      "startTime": "00:00",
      "endTime": "00:00"
    },
    {
      "dayOfWeek": "sunday",
      "isWorkday": false,
      "startTime": "00:00",
      "endTime": "00:00"
    }
  ]
}
```

**Validation Rules:**
- All 7 days must be configured
- Each day must appear exactly once
- `startTime` and `endTime` must be in HH:mm format (24-hour)
- `endTime` must be after `startTime` (or 23:59 for full day)
- `dayOfWeek` must be one of: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`
- **Default values**: `startTime` defaults to `00:00`, `endTime` defaults to `23:59` (24h duration)

**Response:** Returns the created workdays configuration (201 Created)

---

### 3. Update Workdays Configuration

**PUT** `/api/workdays/:userId`

Update (or create if not exists) the workdays configuration for a user.

**Authentication:** Required (user must be admin or self)

**Request Body:** Same as POST request

**Response:** Returns the updated workdays configuration

---

### 4. Delete Workdays Configuration

**DELETE** `/api/workdays/:userId`

Delete the workdays configuration for a user.

**Authentication:** Required (user must be admin or self)

**Response:**
```json
{
  "message": "Workdays configuration deleted successfully"
}
```

---

### 5. Get All Workdays Configurations (Admin Only)

**GET** `/api/workdays`

Get all workdays configurations for all users.

**Authentication:** Required (admin only)

**Response:** Array of workdays configurations

---

## Data Model

### DayConfig

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| dayOfWeek | enum | Yes | - | One of: monday, tuesday, wednesday, thursday, friday, saturday, sunday |
| isWorkday | boolean | No | true | Whether this day is a working day |
| startTime | string | No | "00:00" | Start time in HH:mm format (24-hour) |
| endTime | string | No | "23:59" | End time in HH:mm format (24-hour) |
| durationMinutes | number | - | (calculated) | Virtual field: work duration in minutes |
| durationFormatted | string | - | (calculated) | Virtual field: formatted as "Xh Ym" |

### Workdays

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| userId | ObjectId | Yes | - | Reference to User model (unique) |
| timezone | string | No | "Europe/Berlin" | Timezone for the workdays |
| workdays | DayConfig[] | Yes | - | Array of 7 day configurations |
| totalWeeklyMinutes | number | - | (calculated) | Virtual field: total work minutes per week |
| totalWeeklyHours | string | - | (calculated) | Virtual field: formatted as "Xh Ym" |
| averageDailyMinutes | number | - | (calculated) | Virtual field: average work minutes per day |
| averageDailyHours | string | - | (calculated) | Virtual field: formatted as "Xh Ym" |

---

## Example Usage

### Creating a Standard 9-5 Work Week

```bash
curl -X POST http://localhost:3000/api/workdays/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "timezone": "Europe/Berlin",
    "workdays": [
      {
        "dayOfWeek": "monday",
        "isWorkday": true,
        "startTime": "09:00",
        "endTime": "17:00"
      },
      {
        "dayOfWeek": "tuesday",
        "isWorkday": true,
        "startTime": "09:00",
        "endTime": "17:00"
      },
      {
        "dayOfWeek": "wednesday",
        "isWorkday": true,
        "startTime": "09:00",
        "endTime": "17:00"
      },
      {
        "dayOfWeek": "thursday",
        "isWorkday": true,
        "startTime": "09:00",
        "endTime": "17:00"
      },
      {
        "dayOfWeek": "friday",
        "isWorkday": true,
        "startTime": "09:00",
        "endTime": "17:00"
      },
      {
        "dayOfWeek": "saturday",
        "isWorkday": false,
        "startTime": "00:00",
        "endTime": "00:00"
      },
      {
        "dayOfWeek": "sunday",
        "isWorkday": false,
        "startTime": "00:00",
        "endTime": "00:00"
      }
    ]
  }'
```

### Creating a Custom Schedule (Different Times Each Day)

```bash
curl -X POST http://localhost:3000/api/workdays/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "timezone": "America/New_York",
    "workdays": [
      {
        "dayOfWeek": "monday",
        "isWorkday": true,
        "startTime": "08:00",
        "endTime": "16:00"
      },
      {
        "dayOfWeek": "tuesday",
        "isWorkday": true,
        "startTime": "10:00",
        "endTime": "18:00"
      },
      {
        "dayOfWeek": "wednesday",
        "isWorkday": true,
        "startTime": "08:00",
        "endTime": "16:00"
      },
      {
        "dayOfWeek": "thursday",
        "isWorkday": true,
        "startTime": "12:00",
        "endTime": "20:00"
      },
      {
        "dayOfWeek": "friday",
        "isWorkday": true,
        "startTime": "08:00",
        "endTime": "14:00"
      },
      {
        "dayOfWeek": "saturday",
        "isWorkday": true,
        "startTime": "10:00",
        "endTime": "15:00"
      },
      {
        "dayOfWeek": "sunday",
        "isWorkday": false,
        "startTime": "00:00",
        "endTime": "00:00"
      }
    ]
  }'
```

---

## Error Responses

### 400 Bad Request
- Missing required fields
- Invalid time format
- End time before start time
- Missing days or duplicate days

### 401 Unauthorized
- Missing or invalid authentication token

### 403 Forbidden
- User trying to access another user's workdays (not admin)

### 404 Not Found
- User not found
- Workdays configuration not found

### 409 Conflict
- Trying to create workdays when they already exist (use PUT to update)

---

## Notes

- Each user can have only one workdays configuration
- All 7 days of the week must be configured
- Times are stored in 24-hour format (HH:mm)
- **Default values**: `startTime` defaults to `00:00`, `endTime` defaults to `23:59` (full 24h day)
- The timezone field helps with international users
- Even non-working days must have start/end times (defaults will be used if not specified)
- Use `isWorkday: false` to mark days as non-working days
- **Automatic calculations**:
  - Each day's work duration is calculated automatically (`durationMinutes`, `durationFormatted`)
  - Total weekly work hours are calculated (`totalWeeklyMinutes`, `totalWeeklyHours`)
  - Average daily work hours are calculated for working days only
  - Special case: `00:00` to `23:59` equals a full 24-hour day (1440 minutes)
