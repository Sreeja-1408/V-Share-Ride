# 🚗 RideApp - Complete Technical Documentation

## Ride Booking Mobile Application

---

## 1. PROJECT OVERVIEW

### App Name

**RideApp** - Complete Ride Sharing Platform

### Objective

Build a full-featured ride-sharing mobile application similar to Uber/Ola/BlaBlaCar that connects passengers with drivers for safe, affordable, and convenient transportation.

### Target Audience

- **Passengers**: Users looking for affordable rides
- **Drivers**: Vehicle owners wanting to earn by offering rides
- **Admins**: Platform administrators managing operations

### Technology Stack

#### Frontend (Mobile App)

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: React Context API
- **Maps**: React Native Maps (Google Maps)
- **Authentication**: JWT + Expo SecureStore + Local Authentication (Biometric)
- **Internationalization**: React i18next (English, Hindi, Telugu)
- **Icons**: Expo Vector Icons

#### Backend

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Language**: JavaScript
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Authentication**: JWT (jsonwebtoken) + bcryptjs

#### Database

- **Primary Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for images/documents)
- **Real-time**: Supabase Realtime subscriptions

#### APIs & Services

- **RESTful APIs**: Express.js REST endpoints
- **Google Maps API**: Location, geocoding, directions
- **Payment Gateway**: Razorpay/Stripe integration ready
- **Push Notifications**: Expo Notifications + FCM
- **SMS/OTP**: Twilio (ready for integration)

#### Development Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Code Editor**: VS Code
- **API Testing**: Postman
- **Deployment**: Expo EAS Build

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APPLICATION                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Passenger   │  │    Driver    │  │    Admin     │      │
│  │     App      │  │     App      │  │     App      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Express.js)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Authentication│  │  Business Logic │  │  Real-time     │
│   (JWT)        │  │   (Controllers) │  │  (Socket.IO)   │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Supabase     │
                    │   PostgreSQL    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   Database     │  │  File Storage   │  │   Real-time    │
│   (Tables)     │  │   (Images)      │  │  Subscriptions │
└────────────────┘  └─────────────────┘  └────────────────┘
```

### Data Flow

#### Ride Booking Flow

```
Passenger → Search Ride → API Request → Backend → Database Query
                                                        ↓
Passenger ← Ride Results ← API Response ← Backend ← Available Rides
                                                        ↓
Passenger → Book Ride → Payment → Booking Created → Notification → Driver
                                                        ↓
Driver → Accept/Reject → Update Status → Notification → Passenger
                                                        ↓
Driver → Start Trip → Real-time Tracking → Socket.IO → Passenger
                                                        ↓
Driver → End Trip → Complete Booking → Payment Settlement → Both Users
```

### Real-time Communication

- **Socket.IO**: Live location tracking, chat messages
- **Supabase Realtime**: Database changes subscription
- **Push Notifications**: Expo Notifications for ride updates

### Payment Gateway Integration

```
User → Select Payment → Razorpay/Stripe → Payment Success → Update Wallet
                                                                  ↓
                                                        Create Transaction
                                                                  ↓
                                                        Update Booking Status
```

### Google Maps API Integration

- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Directions API**: Calculate routes and distances
- **Distance Matrix**: Calculate fare based on distance
- **Places API**: Autocomplete location search

### Notification System

- **Expo Notifications**: Local and push notifications
- **FCM (Firebase Cloud Messaging)**: Cross-platform push
- **Notification Types**:
  - Ride request received (Driver)
  - Booking confirmed (Passenger)
  - Driver arriving (Passenger)
  - Trip started (Both)
  - Trip completed (Both)
  - Payment received (Driver)

---

## 3. PASSENGER MODULE (USER APP)

### A. Authentication

#### Signup Flow

**Screen**: `app/(auth)/signup.tsx`

**Features**:

- Email/Password registration
- Role selection (Passenger/Driver)
- Password validation (min 6 characters)
- Duplicate email check

**API Endpoint**:

```
POST /api/auth/signup
```

**Request Body**:

```json
{
  "email": "passenger@example.com",
  "password": "password123",
  "role": "passenger"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "passenger@example.com",
    "role": "passenger",
    "name": "passenger",
    "verified": false,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Technical Implementation**:

```typescript
// Password hashing with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// JWT token generation
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "7d" },
);

// Store token securely
await SecureStore.setItemAsync("authToken", token);
```

#### Login Flow

**Screen**: `app/(auth)/login.tsx`

**Features**:

- Email/Password login
- Biometric authentication (fingerprint/face)
- Remember me option
- Auto-login on app restart

**API Endpoint**:

```
POST /api/auth/login
```

**Request Body**:

```json
{
  "email": "passenger@example.com",
  "password": "password123"
}
```

**Biometric Authentication**:

```typescript
import * as LocalAuthentication from "expo-local-authentication";

const authenticate = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to login",
      fallbackLabel: "Use password",
    });
    return result.success;
  }
  return false;
};
```

#### Profile Completion

**Screen**: `app/(auth)/profile-completion.tsx`

**Form Fields**:

- Full name (required)
- Phone number (required, +91 format)
- Gender (Male/Female/Other)
- Date of birth (date picker)
- Address (text area)
- Profile photo (image upload)

**API Endpoint**:

```
PUT /api/auth/profile
```

**Request Body**:

```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "gender": "male",
  "date_of_birth": "1990-01-15",
  "address": "123 Street, City",
  "photo_url": "https://supabase.co/storage/..."
}
```

#### JWT Token Handling

```typescript
// Store token
await SecureStore.setItemAsync('authToken', token);

// Retrieve token
const token = await SecureStore.getItemAsync('authToken');

// Set token in API client
setAuthToken(token);

// API request with token
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Token expiry handling
jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) {
    // Token expired or invalid
    // Redirect to login
  }
});
```

### B. Ride Booking Flow

#### 1. Location Detection

**Component**: `components/LocationPicker.tsx`

**Features**:

- Get current location using GPS
- Search location with autocomplete
- Select location on map
- Recent locations

**Implementation**:

```typescript
import * as Location from "expo-location";

// Request permission
const { status } = await Location.requestForegroundPermissionsAsync();

// Get current location
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});

const { latitude, longitude } = location.coords;

// Reverse geocoding
const address = await Location.reverseGeocodeAsync({
  latitude,
  longitude,
});
```

#### 2. Select Pickup & Drop

**Screen**: `app/(passenger)/search-ride.tsx`

**Features**:

- Pickup location input with autocomplete
- Destination input with autocomplete
- Date picker (default: today)
- Time preference (optional)
- Number of seats (1-6)
- Popular routes quick selection

**Popular Routes**:

- Hyderabad → Vijayawada
- Bangalore → Chennai
- Mumbai → Pune
- Delhi → Jaipur

#### 3. Fare Estimation Algorithm

**Implementation**:

```typescript
// Calculate distance using Google Maps Distance Matrix API
const calculateFare = (distance: number, vehicleType: string) => {
  const baseFare = 50; // ₹50 base fare
  const perKmRate = {
    bike: 8,
    car: 12,
    suv: 15,
  };

  const distanceFare = distance * perKmRate[vehicleType];
  const gst = (baseFare + distanceFare) * 0.05; // 5% GST
  const totalFare = baseFare + distanceFare + gst;

  return Math.round(totalFare);
};

// Surge pricing (peak hours)
const applySurgePricing = (fare: number, hour: number) => {
  const peakHours = [8, 9, 17, 18, 19]; // 8-9 AM, 5-7 PM
  if (peakHours.includes(hour)) {
    return fare * 1.5; // 50% surge
  }
  return fare;
};
```

#### 4. Apply Promo Code

**Screen**: `app/(passenger)/payment.tsx`

**Available Promo Codes**:

```typescript
const promoCodes = {
  SAVE50: { discount: 50, type: "flat" },
  FIRST100: { discount: 100, type: "flat", firstRideOnly: true },
  PERCENT20: { discount: 20, type: "percentage" },
};

const applyPromoCode = (code: string, amount: number) => {
  const promo = promoCodes[code];
  if (!promo) return 0;

  if (promo.type === "flat") {
    return Math.min(promo.discount, amount);
  } else {
    return (amount * promo.discount) / 100;
  }
};
```

#### 5. Payment Method Selection

**Payment Options**:

- Wallet (if sufficient balance)
- UPI (PhonePe, Google Pay, Paytm)
- Credit/Debit Card
- Net Banking
- Cash (on completion)

**API Endpoint**:

```
POST /api/bookings
```

**Request Body**:

```json
{
  "ride_id": "uuid",
  "seats_booked": 2,
  "total_amount": 950,
  "payment_method": "wallet",
  "promo_code": "SAVE50"
}
```

#### 6. Confirm Ride

**Flow**:

```
Select Ride → Enter Details → Choose Payment → Apply Promo → Confirm
                                                                ↓
                                                    Create Booking
                                                                ↓
                                                    Deduct from Wallet
                                                                ↓
                                                    Notify Driver
                                                                ↓
                                                    Show Confirmation
```

### C. Ride Lifecycle

#### 1. Ride Requested

**Status**: `pending`
**Screen**: `app/(passenger)/dashboard.tsx`

**Features**:

- Show booking details
- Waiting for driver approval
- Cancel option (full refund)
- Estimated wait time

#### 2. Driver Assigned

**Status**: `confirmed`

**Notification**:

```typescript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Ride Confirmed!",
    body: "Your driver has accepted the ride",
    data: { bookingId, driverId },
  },
  trigger: null, // Immediate
});
```

**Features**:

- Driver details (name, photo, rating)
- Vehicle details (model, color, plate)
- Contact driver button
- Chat with driver
- Track driver location

#### 3. Driver Arriving

**Status**: `confirmed` + driver location tracking

**Screen**: `app/(passenger)/trip.tsx`

**Features**:

- Real-time driver location on map
- ETA to pickup location
- Driver contact options (call/chat)
- Cancel ride (cancellation charges apply)

**Real-time Tracking**:

```typescript
// Socket.IO connection
const socket = io("http://192.168.0.102:3000");

socket.emit("joinRide", rideId);

socket.on("locationUpdate", (data) => {
  const { latitude, longitude } = data;
  updateDriverMarker(latitude, longitude);
  calculateETA(latitude, longitude);
});
```

#### 4. Ride Started

**Status**: `in_progress`

**API Endpoint**:

```
PUT /api/trips/:id/start
```

**Features**:

- Live route tracking
- Current location display
- Estimated arrival time
- SOS emergency button
- Share trip with contacts

**SOS Button**:

```typescript
// Component: components/SOSButton.tsx
const handleSOS = async () => {
  // Send location to emergency contacts
  await sendSMS(emergencyContacts, `SOS! I need help. Location: ${location}`);

  // Notify admin
  await complaintsApi.createComplaint({
    type: "emergency",
    description: "SOS triggered during ride",
    ride_id: rideId,
  });

  // Call emergency number
  Linking.openURL("tel:100");
};
```

#### 5. Ride Completed

**Status**: `completed`

**API Endpoint**:

```
PUT /api/trips/:id/end
```

**Features**:

- Trip summary (distance, time, fare)
- Payment confirmation
- Rate driver
- Download invoice
- Report issue

**Trip Summary**:

```json
{
  "ride_id": "uuid",
  "pickup": "Hyderabad",
  "destination": "Vijayawada",
  "distance": "275 km",
  "duration": "4h 30m",
  "fare": 950,
  "payment_method": "wallet",
  "driver": {
    "name": "John Doe",
    "rating": 4.5
  }
}
```

#### 6. Cancel Ride

**Cancellation Policy**:

- Before driver accepts: Full refund
- After acceptance, before start: 50% refund
- After trip starts: No refund

**API Endpoint**:

```
PUT /api/bookings/:id/cancel
```

**Request Body**:

```json
{
  "reason": "Change of plans",
  "cancelled_by": "passenger"
}
```

### D. Features

#### 1. Live Tracking

**Implementation**:

```typescript
// Update location every 5 seconds
const locationInterval = setInterval(async () => {
  const location = await Location.getCurrentPositionAsync();
  socket.emit("updateLocation", {
    rideId,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
}, 5000);
```

#### 2. Trip History

**Screen**: `app/(passenger)/history.tsx`

**API Endpoint**:

```
GET /api/bookings/passenger/:passengerId
```

**Response**:

```json
[
  {
    "id": "uuid",
    "ride": {
      "pickup": "Hyderabad",
      "destination": "Vijayawada",
      "date": "2024-01-15",
      "time": "10:00"
    },
    "driver": {
      "name": "John Doe",
      "rating": 4.5
    },
    "seats_booked": 2,
    "total_amount": 950,
    "status": "completed",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

#### 3. Ratings & Reviews

**Screen**: `app/(passenger)/rate-driver.tsx`

**API Endpoint**:

```
POST /api/ratings
```

**Request Body**:

```json
{
  "userId": "driver-uuid",
  "rating": 5,
  "rideId": "ride-uuid",
  "comment": "Excellent ride! Very professional driver."
}
```

**Rating Calculation**:

```typescript
// Calculate average rating
const calculateAverageRating = (ratings: number[]) => {
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
};
```

#### 4. Wallet System

**Screen**: `app/(shared)/wallet.tsx`

**Features**:

- View current balance
- Add money (UPI, Card, Net Banking)
- Transaction history
- Auto-reload settings

**API Endpoints**:

```
GET /api/wallet/:userId
POST /api/wallet/:userId/add
GET /api/transactions/:userId
```

**Add Money Request**:

```json
{
  "amount": 1000,
  "payment_method": "upi",
  "upi_id": "user@paytm"
}
```

**Transaction History Response**:

```json
[
  {
    "id": "uuid",
    "type": "credit",
    "amount": 1000,
    "description": "Wallet top-up",
    "created_at": "2024-01-15T10:00:00Z"
  },
  {
    "id": "uuid",
    "type": "debit",
    "amount": 950,
    "description": "Ride payment",
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

#### 5. Notifications

**Types**:

- Ride confirmed
- Driver arriving
- Trip started
- Trip completed
- Payment received
- Promotional offers

**Implementation**:

```typescript
import * as Notifications from "expo-notifications";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission
const { status } = await Notifications.requestPermissionsAsync();

// Get push token
const token = await Notifications.getExpoPushTokenAsync();

// Send to backend
await authApi.updateProfile({ push_token: token.data });
```

#### 6. SOS / Emergency Button

**Component**: `components/SOSButton.tsx`

**Features**:

- One-tap emergency alert
- Share live location
- Call emergency services (100/112)
- Notify emergency contacts
- Alert admin

### E. APIs Required

#### Authentication APIs

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - User login
PUT    /api/auth/profile         - Update profile
POST   /api/auth/forgot-password - Password reset
POST   /api/auth/verify-otp      - Verify OTP
```

#### Ride APIs

```
GET    /api/rides                - Search rides
GET    /api/rides/:id            - Get ride details
POST   /api/rides                - Create ride (driver)
PUT    /api/rides/:id            - Update ride
DELETE /api/rides/:id            - Cancel ride
```

#### Booking APIs

```
POST   /api/bookings             - Create booking
GET    /api/bookings/passenger/:id - Get passenger bookings
GET    /api/bookings/:id         - Get booking details
PUT    /api/bookings/:id/cancel  - Cancel booking
```

#### Payment APIs

```
GET    /api/wallet/:userId       - Get wallet balance
POST   /api/wallet/:userId/add   - Add money
GET    /api/transactions/:userId - Transaction history
POST   /api/payments/process     - Process payment
```

#### Rating APIs

```
POST   /api/ratings              - Rate driver/passenger
GET    /api/ratings/user/:userId - Get user ratings
```

#### Chat APIs

```
GET    /api/chat/:rideId         - Get chat messages
POST   /api/chat/:rideId         - Send message
```

---

## 4. DRIVER MODULE (DRIVER APP)

### A. Driver Registration

#### KYC Verification Process

**Screen**: `app/(auth)/profile-completion.tsx` (for drivers)

**Required Documents**:

1. Driving License (front & back)
2. Vehicle RC (Registration Certificate)
3. Vehicle Insurance
4. Vehicle Photo
5. Profile Photo

**Verification Steps**:

```
Driver Signup → Upload Documents → Admin Review → Approval/Rejection
```

**Document Upload**:

```typescript
// Upload driving license
const uploadDrivingLicense = async (imageUri: string) => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "driving_license.jpg",
  });
  formData.append("folder", "driving_license");

  const response = await uploadApi.uploadImage(formData);
  return response.imageUrl;
};
```

**API Endpoint**:

```
POST /api/upload
```

**Request**: FormData with image file

**Response**:

```json
{
  "imageUrl": "https://supabase.co/storage/rideapp-images/user-id/driving_license/123456.jpg"
}
```

#### Admin Approval

**Admin Screen**: `app/(admin)/verifications.tsx`

**Verification Checklist**:

- ✓ Driving license valid and not expired
- ✓ License number matches government database
- ✓ Vehicle RC book valid
- ✓ Insurance active and not expired
- ✓ Vehicle photo matches RC details
- ✓ All documents clear and readable

**API Endpoint**:

```
PUT /api/admin/users/:id/verify
```

**Request Body**:

```json
{
  "verified": true,
  "verification_notes": "All documents verified successfully"
}
```

### B. Ride Management

#### 1. Post Ride

**Screen**: `app/(driver)/post-ride.tsx`

**Form Fields**:

- Pickup location (autocomplete)
- Destination (autocomplete)
- Date (date picker, min: today)
- Time (time picker)
- Available seats (1-6)
- Price per seat (₹50 minimum)
- Vehicle selection (dropdown)
- Preferences:
  - Smoking allowed (yes/no)
  - Pets allowed (yes/no)
  - Music (yes/no)
  - AC (yes/no)

**API Endpoint**:

```
POST /api/rides
```

**Request Body**:

```json
{
  "pickup": "Hyderabad",
  "destination": "Vijayawada",
  "date": "2024-01-20",
  "time": "10:00",
  "seats": 3,
  "price": 500,
  "vehicle_id": "uuid",
  "preferences": {
    "smoking": false,
    "pets": true,
    "music": true,
    "ac": true
  }
}
```

**Response**:

```json
{
  "id": "uuid",
  "driver_id": "uuid",
  "pickup": "Hyderabad",
  "destination": "Vijayawada",
  "date": "2024-01-20",
  "time": "10:00",
  "available_seats": 3,
  "price": 500,
  "status": "active",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### 2. Accept/Reject Ride Requests

**Screen**: `app/(driver)/bookings.tsx`

**Features**:

- View all pending booking requests
- Passenger details (name, rating, photo)
- Seats requested
- Accept button (confirms booking)
- Reject button (cancels booking)

**Accept Booking API**:

```
PUT /api/bookings/:id/accept
```

**Response**:

```json
{
  "id": "uuid",
  "status": "confirmed",
  "passenger": {
    "name": "Jane Doe",
    "phone": "+919876543210"
  },
  "seats_booked": 2
}
```

**Reject Booking API**:

```
PUT /api/bookings/:id/reject
```

**Business Logic**:

```typescript
// Accept booking
const acceptBooking = async (bookingId: string) => {
  // Check available seats
  const ride = await ridesApi.getRideDetails(rideId);
  if (ride.available_seats < booking.seats_booked) {
    throw new Error("Not enough seats available");
  }

  // Update booking status
  await bookingsApi.updateStatus(bookingId, "confirmed");

  // Reduce available seats
  await ridesApi.updateRide(rideId, {
    available_seats: ride.available_seats - booking.seats_booked,
  });

  // Notify passenger
  await sendNotification(passengerId, "Ride confirmed!");
};
```

#### 3. Navigation Integration

**Screen**: `app/(driver)/trip.tsx`

**Features**:

- Open Google Maps with directions
- Turn-by-turn navigation
- Real-time traffic updates
- Alternative routes

**Implementation**:

```typescript
import { Linking } from "react-native";

const openNavigation = (destination: string) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  Linking.openURL(url);
};
```

#### 4. Start Ride

**Screen**: `app/(driver)/trip.tsx`

**API Endpoint**:

```
PUT /api/trips/:id/start
```

**Features**:

- Verify all passengers present
- Start trip button
- Begin location tracking
- Update ride status to 'in_progress'

**Location Tracking**:

```typescript
// Start tracking
const startLocationTracking = () => {
  const interval = setInterval(async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Emit to Socket.IO
    socket.emit("locationUpdate", {
      rideId,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      speed: location.coords.speed,
      heading: location.coords.heading,
    });
  }, 5000); // Every 5 seconds

  return interval;
};
```

#### 5. Complete Ride

**API Endpoint**:

```
PUT /api/trips/:id/end
```

**Features**:

- End trip button
- Calculate final fare
- Update ride status to 'completed'
- Transfer earnings to wallet
- Request passenger rating

**Fare Calculation**:

```typescript
const calculateFinalFare = (
  distance: number,
  duration: number,
  basePrice: number,
) => {
  const distanceFare = distance * 12; // ₹12 per km
  const timeFare = duration * 2; // ₹2 per minute
  const totalFare = Math.max(basePrice, distanceFare + timeFare);

  return {
    baseFare: basePrice,
    distanceFare,
    timeFare,
    totalFare,
    commission: totalFare * 0.15, // 15% platform fee
    driverEarning: totalFare * 0.85,
  };
};
```

#### 6. Cancel Ride

**API Endpoint**:

```
DELETE /api/rides/:id
```

**Cancellation Reasons**:

- Vehicle breakdown
- Personal emergency
- Weather conditions
- Other

**Penalty**:

- Before any bookings: No penalty
- After bookings confirmed: ₹100 penalty + refund to passengers

### C. Earnings

#### 1. Daily Earnings

**Screen**: `app/(driver)/dashboard.tsx`

**Display**:

- Today's earnings
- Number of trips completed
- Average fare per trip
- Total distance covered

**API Endpoint**:

```
GET /api/earnings/daily/:driverId
```

**Response**:

```json
{
  "date": "2024-01-15",
  "total_earnings": 3500,
  "trips_completed": 5,
  "average_fare": 700,
  "total_distance": 250,
  "commission_deducted": 525,
  "net_earnings": 2975
}
```

#### 2. Weekly Report

**Screen**: `app/(driver)/history.tsx`

**Features**:

- Last 7 days earnings chart
- Day-wise breakdown
- Peak earning days
- Total weekly earnings

**Chart Data**:

```typescript
const weeklyData = [
  { day: "Mon", earnings: 2500 },
  { day: "Tue", earnings: 3200 },
  { day: "Wed", earnings: 2800 },
  { day: "Thu", earnings: 3500 },
  { day: "Fri", earnings: 4200 },
  { day: "Sat", earnings: 5000 },
  { day: "Sun", earnings: 3800 },
];
```

#### 3. Commission Deduction

**Platform Fee**: 15% of total fare

**Calculation**:

```typescript
const calculateCommission = (totalFare: number) => {
  const platformFee = totalFare * 0.15;
  const gst = platformFee * 0.18; // 18% GST on commission
  const totalDeduction = platformFee + gst;
  const driverEarning = totalFare - totalDeduction;

  return {
    totalFare,
    platformFee,
    gst,
    totalDeduction,
    driverEarning,
  };
};
```

**Example**:

```
Total Fare: ₹1000
Platform Fee (15%): ₹150
GST on Fee (18%): ₹27
Total Deduction: ₹177
Driver Earning: ₹823
```

#### 4. Wallet Withdrawal

**Screen**: `app/(shared)/wallet.tsx`

**Features**:

- View available balance
- Withdraw to bank account
- Minimum withdrawal: ₹500
- Processing time: 1-2 business days

**API Endpoint**:

```
POST /api/wallet/:userId/withdraw
```

**Request Body**:

```json
{
  "amount": 5000,
  "bank_account": {
    "account_number": "1234567890",
    "ifsc_code": "SBIN0001234",
    "account_holder": "John Doe"
  }
}
```

### D. Driver Availability

#### 1. Online/Offline Toggle

**Screen**: `app/(driver)/dashboard.tsx`

**Features**:

- Toggle switch for availability
- Auto-offline after 30 minutes of inactivity
- Notification when ride requests come

**Implementation**:

```typescript
const [isOnline, setIsOnline] = useState(false);

const toggleAvailability = async () => {
  const newStatus = !isOnline;
  setIsOnline(newStatus);

  await authApi.updateProfile({
    is_available: newStatus,
    last_active: new Date().toISOString(),
  });

  if (newStatus) {
    // Start listening for ride requests
    socket.emit("driverOnline", { driverId: user.id });
  } else {
    socket.emit("driverOffline", { driverId: user.id });
  }
};
```

#### 2. Auto Assignment Logic

**Algorithm**:

```typescript
const findNearestDriver = async (
  pickupLocation: { lat: number; lng: number },
  vehicleType: string,
) => {
  // Get all online drivers with matching vehicle type
  const drivers = await getOnlineDrivers(vehicleType);

  // Calculate distance from pickup location
  const driversWithDistance = drivers.map((driver) => ({
    ...driver,
    distance: calculateDistance(pickupLocation, driver.current_location),
  }));

  // Sort by distance and rating
  const sortedDrivers = driversWithDistance.sort((a, b) => {
    // Prioritize distance (70%) and rating (30%)
    const scoreA = a.distance * 0.7 + (5 - a.rating) * 0.3;
    const scoreB = b.distance * 0.7 + (5 - b.rating) * 0.3;
    return scoreA - scoreB;
  });

  // Return top 3 drivers
  return sortedDrivers.slice(0, 3);
};
```

### E. APIs Required

#### Driver Ride APIs

```
POST   /api/rides                    - Create ride offer
GET    /api/rides/driver/:driverId   - Get driver's rides
PUT    /api/rides/:id                - Update ride details
DELETE /api/rides/:id                - Cancel ride
```

#### Booking Management APIs

```
GET    /api/bookings/driver/:driverId - Get ride bookings
PUT    /api/bookings/:id/accept       - Accept booking
PUT    /api/bookings/:id/reject       - Reject booking
GET    /api/bookings/ride/:rideId     - Get ride passengers
```

#### Trip Management APIs

```
PUT    /api/trips/:id/start           - Start trip
PUT    /api/trips/:id/end             - End trip
POST   /api/trips/:id/location        - Update location
GET    /api/trips/:id/status          - Get trip status
```

#### Earnings APIs

```
GET    /api/earnings/daily/:driverId  - Daily earnings
GET    /api/earnings/weekly/:driverId - Weekly report
GET    /api/earnings/monthly/:driverId - Monthly report
POST   /api/wallet/:userId/withdraw   - Withdraw earnings
```

#### Vehicle APIs

```
POST   /api/vehicles                  - Register vehicle
GET    /api/vehicles/driver/:driverId - Get driver vehicles
PUT    /api/vehicles/:id              - Update vehicle
DELETE /api/vehicles/:id              - Remove vehicle
```

---

## 5. ADMIN PANEL (WEB)

### A. Dashboard

**Screen**: `app/(admin)/dashboard.tsx`

**Key Metrics**:

#### 1. Total Users

```typescript
{
  totalUsers: 15420,
  drivers: 3240,
  passengers: 12180,
  newUsersToday: 45,
  activeUsers: 8920
}
```

#### 2. Total Drivers

```typescript
{
  totalDrivers: 3240,
  verifiedDrivers: 2890,
  pendingVerification: 350,
  onlineDrivers: 1240,
  averageRating: 4.3
}
```

#### 3. Active Rides

```typescript
{
  activeRides: 245,
  scheduledRides: 1230,
  completedToday: 890,
  cancelledToday: 45
}
```

#### 4. Revenue Overview

```typescript
{
  todayRevenue: 125000,
  weekRevenue: 780000,
  monthRevenue: 3200000,
  platformCommission: 480000,
  pendingPayouts: 125000
}
```

**API Endpoint**:

```
GET /api/admin/dashboard
```

**Response**:

```json
{
  "totalUsers": 15420,
  "totalTrips": 45230,
  "totalPayments": 12500000,
  "pendingVerifications": 350,
  "activeRides": 245,
  "completedRides": 44985,
  "revenue": {
    "today": 125000,
    "week": 780000,
    "month": 3200000
  }
}
```

### B. User Management

**Screen**: `app/(admin)/users.tsx`

#### Features:

1. **View All Users**
   - List with pagination (50 per page)
   - Filter by role (driver/passenger/admin)
   - Search by name/email/phone
   - Sort by registration date, rating

2. **User Details**
   - Personal information
   - Ride history
   - Payment history
   - Ratings received
   - Complaints filed

3. **Block Users**
   - Temporary suspension
   - Permanent ban
   - Reason required
   - Notification sent to user

**API Endpoints**:

```
GET    /api/admin/users              - Get all users
GET    /api/admin/users/:id          - Get user details
PUT    /api/admin/users/:id/block    - Block user
PUT    /api/admin/users/:id/unblock  - Unblock user
DELETE /api/admin/users/:id          - Delete user
```

**Block User Request**:

```json
{
  "reason": "Multiple complaints received",
  "duration": "permanent",
  "notify": true
}
```

#### Ride History

**API Endpoint**:

```
GET /api/admin/users/:id/rides
```

**Response**:

```json
[
  {
    "id": "uuid",
    "type": "driver",
    "pickup": "Hyderabad",
    "destination": "Vijayawada",
    "date": "2024-01-15",
    "status": "completed",
    "earnings": 823,
    "rating": 4.5
  }
]
```

### C. Driver Management

**Screen**: `app/(admin)/verifications.tsx`

#### 1. Approve / Reject Drivers

**Pending Verifications List**:

```typescript
{
  id: "uuid",
  name: "John Doe",
  email: "john@example.com",
  phone: "+919876543210",
  documents: {
    driving_license: "url",
    vehicle_rc: "url",
    insurance: "url",
    vehicle_photo: "url"
  },
  submitted_at: "2024-01-15T10:00:00Z"
}
```

**Verification Form**:

- View all documents (zoom, download)
- Verify driving license number
- Check vehicle RC details
- Verify insurance validity
- Approve/Reject buttons
- Rejection reason (if rejected)

**API Endpoint**:

```
PUT /api/admin/users/:id/verify
```

**Approve Request**:

```json
{
  "verified": true,
  "verification_notes": "All documents verified"
}
```

**Reject Request**:

```json
{
  "verified": false,
  "rejection_reason": "Driving license expired",
  "documents_required": ["driving_license"]
}
```

#### 2. Suspend Drivers

**Reasons for Suspension**:

- Multiple complaints
- Low rating (< 3.0)
- Fraudulent activity
- Safety violations
- Document expiry

**API Endpoint**:

```
PUT /api/admin/drivers/:id/suspend
```

**Request Body**:

```json
{
  "suspended": true,
  "reason": "Multiple passenger complaints",
  "duration": "30 days"
}
```

#### 3. View Documents

**Document Viewer**:

- Full-screen image viewer
- Zoom in/out
- Download option
- Mark as verified/rejected
- Request re-upload

### D. Ride Monitoring

**Screen**: `app/(admin)/rides.tsx`

#### 1. Live Ride Tracking

**Features**:

- Map view with all active rides
- Real-time location updates
- Driver and passenger details
- Trip progress (% completed)
- Estimated completion time

**API Endpoint**:

```
GET /api/admin/rides/active
```

**Response**:

```json
[
  {
    "id": "uuid",
    "driver": {
      "name": "John Doe",
      "phone": "+919876543210",
      "location": { "lat": 17.385, "lng": 78.486 }
    },
    "passenger": {
      "name": "Jane Smith",
      "phone": "+919876543211"
    },
    "pickup": "Hyderabad",
    "destination": "Vijayawada",
    "status": "in_progress",
    "progress": 45,
    "eta": "2h 15m"
  }
]
```

#### 2. Cancel Ride (Admin Override)

**Use Cases**:

- Emergency situations
- Fraudulent activity
- Safety concerns
- Technical issues

**API Endpoint**:

```
PUT /api/admin/rides/:id/cancel
```

**Request Body**:

```json
{
  "reason": "Safety concern reported",
  "refund_amount": 1000,
  "notify_users": true
}
```

### E. Commission Management

**Screen**: `app/(admin)/settings.tsx`

#### 1. Set Commission %

**Current Settings**:

```typescript
{
  platformCommission: 15, // 15% of fare
  gstOnCommission: 18,    // 18% GST
  minimumFare: 50,
  cancellationFee: 50,
  driverCancellationPenalty: 100
}
```

**Update API**:

```
PUT /api/admin/settings/commission
```

**Request Body**:

```json
{
  "platformCommission": 12,
  "effectiveFrom": "2024-02-01"
}
```

#### 2. Promo Code Management

**Create Promo Code**:

```json
{
  "code": "NEWYEAR2024",
  "type": "percentage",
  "discount": 20,
  "maxDiscount": 200,
  "minOrderValue": 500,
  "validFrom": "2024-01-01",
  "validTill": "2024-01-31",
  "usageLimit": 1000,
  "userLimit": 1
}
```

**API Endpoints**:

```
POST   /api/admin/promo-codes        - Create promo code
GET    /api/admin/promo-codes        - List all promo codes
PUT    /api/admin/promo-codes/:id    - Update promo code
DELETE /api/admin/promo-codes/:id    - Delete promo code
```

**Promo Code Types**:

- Flat discount (₹50 off)
- Percentage discount (20% off)
- First ride discount
- Referral discount

### F. Reports

**Screen**: `app/(admin)/reports.tsx`

#### 1. Revenue Reports

**Daily Revenue**:

```typescript
{
  date: "2024-01-15",
  totalRides: 890,
  totalFare: 445000,
  platformCommission: 66750,
  gst: 12015,
  netRevenue: 78765,
  refunds: 5000
}
```

**Monthly Revenue Chart**:

```typescript
const monthlyData = [
  { month: "Jan", revenue: 2500000 },
  { month: "Feb", revenue: 2800000 },
  { month: "Mar", revenue: 3200000 },
  // ...
];
```

#### 2. Ride Analytics

**Metrics**:

- Total rides per day/week/month
- Average ride distance
- Average ride duration
- Peak hours analysis
- Popular routes
- Cancellation rate

**API Endpoint**:

```
GET /api/admin/analytics/rides
```

**Response**:

```json
{
  "totalRides": 45230,
  "averageDistance": 45.5,
  "averageDuration": 65,
  "peakHours": [8, 9, 17, 18, 19],
  "popularRoutes": [
    {
      "route": "Hyderabad - Vijayawada",
      "count": 1250
    }
  ],
  "cancellationRate": 3.2
}
```

#### 3. Export CSV

**Export Options**:

- Users list
- Rides list
- Transactions
- Revenue report
- Driver earnings

**Implementation**:

```typescript
const exportToCSV = (data: any[], filename: string) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${Date.now()}.csv`;
  link.click();
};
```

**API Endpoint**:

```
GET /api/admin/export/:type
```

**Query Parameters**:

- `type`: users, rides, transactions, revenue
- `startDate`: 2024-01-01
- `endDate`: 2024-01-31
- `format`: csv, excel, pdf

---
