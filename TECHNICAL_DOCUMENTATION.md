# 🚗 RideApp - Complete Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Driver Module](#driver-module)
4. [Passenger Module](#passenger-module)
5. [Admin Module](#admin-module)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Suggestions & Improvements](#suggestions--improvements)

---

## System Overview

### Technology Stack

- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT + Expo SecureStore
- **Navigation**: Expo Router (File-based)
- **UI Library**: React Native Paper (Material Design)
- **State Management**: React Context API

### Network Configuration

- **Backend Server**: `http://192.168.0.102:3000`
- **API Base URL**: `http://192.168.0.102:3000/api`
- **Supabase**: Cloud-hosted PostgreSQL database

### User Roles

1. **Driver**: Post rides, manage bookings, track earnings
2. **Passenger**: Search rides, book seats, make payments
3. **Admin**: Manage users, verify drivers, handle complaints

---

## Architecture

### Frontend Structure

```
RideApp/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── profile-completion.tsx
│   ├── (driver)/            # Driver module
│   │   ├── dashboard.tsx
│   │   ├── post-ride.tsx
│   │   ├── bookings.tsx
│   │   ├── passengers.tsx
│   │   ├── vehicle.tsx
│   │   ├── trip.tsx
│   │   └── history.tsx
│   ├── (passenger)/         # Passenger module
│   │   ├── dashboard.tsx
│   │   ├── search-ride.tsx
│   │   ├── ride-details.tsx
│   │   ├── payment.tsx
│   │   ├── chat.tsx
│   │   └── history.tsx
│   ├── (admin)/             # Admin module
│   │   ├── dashboard.tsx
│   │   ├── users.tsx
│   │   ├── verify-drivers.tsx
│   │   └── complaints.tsx
│   └── (shared)/            # Shared screens
│       ├── wallet.tsx
│       ├── profile.tsx
│       └── analytics.tsx
├── services/
│   └── api/                 # API service layer
│       ├── client.ts        # Base API client
│       ├── auth.ts          # Authentication APIs
│       ├── rides.ts         # Ride management
│       ├── bookings.ts      # Booking operations
│       ├── trips.ts         # Trip tracking
│       ├── wallet.ts        # Wallet & payments
│       ├── vehicles.ts      # Vehicle management
│       ├── chat.ts          # Messaging
│       ├── ratings.ts       # Rating system
│       ├── admin.ts         # Admin operations
│       ├── complaints.ts    # Complaint handling
│       └── loyaltyEco.ts    # Loyalty & eco tracking
├── contexts/
│   ├── AuthContext.tsx      # Authentication state
│   └── RideContext.tsx      # Ride & booking state
└── components/              # Reusable UI components
```

### Backend Structure

```
backend/
├── server.js                # Express server + all routes
├── supabase.js              # Supabase client config
├── schema.sql               # Database schema
├── .env                     # Environment variables
└── uploads/                 # Temporary file uploads
```

### Data Flow

```
User Action → Component → Context → API Service → Backend → Supabase → Response
```

---

## Driver Module

### Features Overview

1. **Dashboard**: View earnings, active rides, statistics
2. **Post Ride**: Create ride offers with route and pricing
3. **Bookings**: Accept/reject passenger booking requests
4. **Passengers**: View confirmed passengers for rides
5. **Vehicle**: Register and verify vehicle documents
6. **Trip**: Start/end trips with live tracking
7. **History**: View completed trips and earnings

### Technical Implementation

#### 1. Driver Dashboard (`app/(driver)/dashboard.tsx`)

**Purpose**: Central hub for driver operations

**Key Features**:

- Real-time earnings display
- Active rides count
- Quick action buttons
- Statistics overview

**API Calls**:

```typescript
// Get driver's rides
const rides = await ridesApi.getDriverRides();

// Get driver statistics
const stats = await ridesApi.getDriverStats();
```

**Navigation Flow**:

```
Dashboard → Post Ride
Dashboard → Bookings
Dashboard → Passengers
Dashboard → Vehicle
Dashboard → Trip
Dashboard → History
Dashboard → Wallet
Dashboard → Profile
```

#### 2. Post Ride (`app/(driver)/post-ride.tsx`)

**Purpose**: Create new ride offers

**Form Fields**:

- Pickup location (text input)
- Destination (text input)
- Date (date picker)
- Time (time picker)
- Available seats (number input)
- Price per seat (number input)
- Vehicle selection (dropdown)
- Preferences: Smoking, Pets, Music, AC

**Validation**:

- All fields required
- Date must be future date
- Seats: 1-6
- Price: minimum ₹50

**API Call**:

```typescript
await ridesApi.createRide({
  pickup_location,
  destination,
  departure_date,
  departure_time,
  available_seats,
  price_per_seat,
  vehicle_id,
  preferences,
});
```

**Success Flow**:

```
Form Submit → Validation → API Call → Success Modal → Navigate to Dashboard
```

#### 3. Bookings Management (`app/(driver)/bookings.tsx`)

**Purpose**: Manage passenger booking requests

**Features**:

- List all pending bookings
- Accept booking (updates status to 'confirmed')
- Reject booking (updates status to 'cancelled')
- View passenger details

**API Calls**:

```typescript
// Get all bookings for driver's rides
const bookings = await bookingsApi.getDriverBookings();

// Accept booking
await bookingsApi.updateBookingStatus(bookingId, "confirmed");

// Reject booking
await bookingsApi.updateBookingStatus(bookingId, "cancelled");
```

**Booking States**:

- `pending`: Awaiting driver approval
- `confirmed`: Accepted by driver
- `cancelled`: Rejected by driver
- `completed`: Trip finished

#### 4. Passengers List (`app/(driver)/passengers.tsx`)

**Purpose**: View confirmed passengers for a specific ride

**Query Parameters**:

- `rideId`: ID of the ride

**Features**:

- Display all confirmed passengers
- Show passenger names, phone numbers
- Display seats booked
- Navigate to trip screen

**API Call**:

```typescript
const passengers = await bookingsApi.getRidePassengers(rideId);
```

#### 5. Vehicle Management (`app/(driver)/vehicle.tsx`)

**Purpose**: Register and verify vehicle

**Form Fields**:

- Vehicle type (Car/SUV/Bike)
- Brand (text)
- Model (text)
- Year (number)
- Color (text)
- License plate (text)
- RC book upload (image)
- Insurance upload (image)
- Vehicle photo upload (image)

**Image Upload Flow**:

```typescript
// Upload to Supabase Storage
const formData = new FormData();
formData.append("file", {
  uri: imageUri,
  type: "image/jpeg",
  name: "rc_book.jpg",
});

const response = await vehiclesApi.uploadDocument(formData, "rc_book");
```

**Storage Structure**:

```
supabase-storage/rideapp-images/
  └── {userId}/
      ├── rc_book/
      ├── insurance/
      └── vehicle_photo/
```

**API Call**:

```typescript
await vehiclesApi.registerVehicle({
  vehicle_type,
  brand,
  model,
  year,
  color,
  license_plate,
  rc_book_url,
  insurance_url,
  vehicle_photo_url,
});
```

#### 6. Trip Management (`app/(driver)/trip.tsx`)

**Purpose**: Start and end trips with live tracking

**Query Parameters**:

- `rideId`: ID of the ride

**Features**:

- Start trip button
- Live location simulation
- End trip button
- Update ride status

**API Calls**:

```typescript
// Start trip
await tripsApi.startTrip(rideId);

// Update location (simulated)
await tripsApi.updateLocation(rideId, { latitude, longitude });

// End trip
await tripsApi.endTrip(rideId);
```

**Trip States**:

- `scheduled`: Not started
- `in_progress`: Currently running
- `completed`: Finished

#### 7. Trip History (`app/(driver)/history.tsx`)

**Purpose**: View completed trips and earnings

**Features**:

- List all completed rides
- Show earnings per ride
- Display passenger count
- Total earnings summary

**API Call**:

```typescript
const completedRides = await ridesApi.getDriverRides("completed");
```

---

## Passenger Module

### Features Overview

1. **Dashboard**: Search rides, view bookings
2. **Search Ride**: Find rides with filters
3. **Ride Details**: View ride information and book
4. **Payment**: Complete booking payment
5. **Chat**: Message driver
6. **History**: View past trips and rate drivers

### Technical Implementation

#### 1. Passenger Dashboard (`app/(passenger)/dashboard.tsx`)

**Purpose**: Main screen for passengers

**Key Features**:

- Quick search form (pickup, destination, date)
- Active bookings display
- Upcoming trips
- Quick actions

**API Calls**:

```typescript
// Get passenger bookings
const bookings = await bookingsApi.getPassengerBookings();

// Get booking details
const details = await bookingsApi.getBookingDetails(bookingId);
```

**Navigation Flow**:

```
Dashboard → Search Ride
Dashboard → Ride Details
Dashboard → Payment
Dashboard → Chat
Dashboard → History
Dashboard → Wallet
Dashboard → Profile
```

#### 2. Search Ride (`app/(passenger)/search-ride.tsx`)

**Purpose**: Find available rides

**Search Filters**:

- Pickup location (required)
- Destination (required)
- Date (required)
- Time preference (optional)
- Price range (optional)
- Seats needed (default: 1)
- Preferences: AC, Pets, Smoking, Music

**API Call**:

```typescript
const rides = await ridesApi.searchRides({
  pickup_location,
  destination,
  departure_date,
  seats_needed,
});
```

**Popular Routes**:

- Hyderabad → Vijayawada
- Bangalore → Chennai
- Mumbai → Pune
- Delhi → Jaipur

**Result Display**:

- Driver name and rating
- Vehicle details
- Departure time
- Available seats
- Price per seat
- Preferences icons

#### 3. Ride Details (`app/(passenger)/ride-details.tsx`)

**Purpose**: View complete ride information

**Query Parameters**:

- `rideId`: ID of the ride

**Displayed Information**:

- Driver profile (name, rating, photo)
- Vehicle details (type, model, color, plate)
- Route (pickup → destination)
- Date and time
- Available seats
- Price per seat
- Preferences
- Driver ratings and reviews

**Booking Flow**:

```typescript
// Select seats
const seatsToBook = 2;
const totalAmount = seatsToBook * pricePerSeat;

// Navigate to payment
router.push({
  pathname: "/(passenger)/payment",
  params: {
    rideId,
    amount: totalAmount,
    seats: seatsToBook,
    pickup: pickupLocation,
    destination,
    date: departureDate,
    time: departureTime,
  },
});
```

#### 4. Payment (`app/(passenger)/payment.tsx`)

**Purpose**: Complete booking payment

**Query Parameters**:

- `rideId`, `amount`, `seats`, `pickup`, `destination`, `date`, `time`

**Payment Methods**:

- Wallet (if sufficient balance)
- UPI (PhonePe, Google Pay, Paytm)
- Credit/Debit Card
- Net Banking

**Promo Codes**:

- `SAVE50`: ₹50 off
- `FIRST100`: ₹100 off (first ride)

**Payment Flow**:

```typescript
// Apply promo code
const discount = applyPromoCode(promoCode, amount);
const finalAmount = amount - discount;

// Create booking
const booking = await bookingsApi.createBooking({
  ride_id: rideId,
  seats_booked: seats,
  total_amount: finalAmount,
  payment_method: selectedMethod,
  promo_code: promoCode,
});

// Process payment
await walletApi.processPayment({
  booking_id: booking.id,
  amount: finalAmount,
  method: selectedMethod,
});
```

**Success Flow**:

```
Payment → Booking Created → Wallet Deducted → Success Modal → Navigate to Dashboard
```

#### 5. Chat System (`app/(passenger)/chat.tsx`)

**Purpose**: Message driver about ride

**Query Parameters**:

- `rideId`: ID of the ride
- `driverId`: ID of the driver

**Features**:

- Real-time messaging
- Message history
- Typing indicator
- Read receipts

**API Calls**:

```typescript
// Get chat messages
const messages = await chatApi.getMessages(rideId);

// Send message
await chatApi.sendMessage({
  ride_id: rideId,
  sender_id: userId,
  receiver_id: driverId,
  message: text,
});
```

**Message Schema**:

```typescript
{
  id: string;
  ride_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: timestamp;
  read: boolean;
}
```

#### 6. Trip History (`app/(passenger)/history.tsx`)

**Purpose**: View past trips and rate drivers

**Features**:

- List completed bookings
- Show ride details
- Rate driver button
- View receipts

**API Call**:

```typescript
const completedBookings = await bookingsApi.getPassengerBookings("completed");
```

**Rating Flow**:

```typescript
// Navigate to rating screen
router.push({
  pathname: "/(passenger)/rate-driver",
  params: {
    bookingId,
    driverId,
    rideId,
  },
});

// Submit rating
await ratingsApi.rateDriver({
  booking_id: bookingId,
  driver_id: driverId,
  rating: 5,
  review: "Great ride!",
});
```

---

## Admin Module

### Features Overview

1. **Dashboard**: System overview and analytics
2. **User Management**: View and manage all users
3. **Verify Drivers**: Approve driver registrations
4. **Complaints**: Handle user complaints

### Technical Implementation

#### 1. Admin Dashboard (`app/(admin)/dashboard.tsx`)

**Purpose**: System monitoring and overview

**Key Metrics**:

- Total users (drivers + passengers)
- Active rides count
- Total bookings
- Revenue generated
- Pending verifications
- Open complaints

**API Calls**:

```typescript
const stats = await adminApi.getSystemStats();
const recentActivity = await adminApi.getRecentActivity();
```

**Dashboard Cards**:

- Users: Total count with breakdown
- Rides: Active vs completed
- Revenue: Total earnings
- Complaints: Pending count

#### 2. User Management (`app/(admin)/users.tsx`)

**Purpose**: Manage all platform users

**Features**:

- List all users (drivers + passengers)
- Filter by role
- Search by name/email
- View user details
- Suspend/activate accounts

**API Calls**:

```typescript
// Get all users
const users = await adminApi.getAllUsers();

// Suspend user
await adminApi.suspendUser(userId);

// Activate user
await adminApi.activateUser(userId);
```

**User Status**:

- `active`: Normal account
- `suspended`: Temporarily blocked
- `banned`: Permanently blocked

#### 3. Verify Drivers (`app/(admin)/verify-drivers.tsx`)

**Purpose**: Approve driver registrations

**Verification Checklist**:

- ✓ Driving license uploaded
- ✓ License number valid
- ✓ Vehicle RC book uploaded
- ✓ Insurance document uploaded
- ✓ Vehicle photo uploaded
- ✓ All details match

**API Calls**:

```typescript
// Get pending verifications
const pendingDrivers = await adminApi.getPendingDrivers();

// Approve driver
await adminApi.verifyDriver(driverId, {
  status: "verified",
  verified_at: new Date(),
});

// Reject driver
await adminApi.verifyDriver(driverId, {
  status: "rejected",
  rejection_reason: "Invalid documents",
});
```

**Verification Flow**:

```
Driver Submits → Admin Reviews → Approve/Reject → Notification Sent
```

#### 4. Complaints Management (`app/(admin)/complaints.tsx`)

**Purpose**: Handle user complaints

**Complaint Types**:

- Driver behavior
- Payment issues
- Safety concerns
- Vehicle condition
- Cancellation disputes

**Features**:

- List all complaints
- Filter by status (open/resolved)
- View complaint details
- Assign priority
- Resolve complaints

**API Calls**:

```typescript
// Get all complaints
const complaints = await complaintsApi.getAllComplaints();

// Resolve complaint
await complaintsApi.resolveComplaint(complaintId, {
  status: "resolved",
  resolution: "Refund processed",
  resolved_by: adminId,
});
```

**Complaint Schema**:

```typescript
{
  id: string;
  user_id: string;
  ride_id: string;
  type: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  created_at: timestamp;
  resolved_at: timestamp;
}
```

---

## API Documentation

### Authentication APIs (`services/api/auth.ts`)

#### POST /api/auth/signup

**Purpose**: Register new user

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "driver"
}
```

**Response**:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "driver"
  }
}
```

#### POST /api/auth/login

**Purpose**: User login

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: Same as signup

#### PUT /api/auth/profile

**Purpose**: Complete user profile

**Request Body**:

```json
{
  "phone_number": "+919876543210",
  "gender": "male",
  "date_of_birth": "1990-01-01",
  "address": "123 Street",
  "driving_license": "DL1234567890",
  "license_photo_url": "https://..."
}
```

### Ride APIs (`services/api/rides.ts`)

#### POST /api/rides

**Purpose**: Create new ride

**Request Body**:

```json
{
  "pickup_location": "Hyderabad",
  "destination": "Vijayawada",
  "departure_date": "2024-01-15",
  "departure_time": "10:00",
  "available_seats": 3,
  "price_per_seat": 500,
  "vehicle_id": "uuid",
  "preferences": {
    "smoking": false,
    "pets": true,
    "music": true,
    "ac": true
  }
}
```

#### GET /api/rides/search

**Purpose**: Search available rides

**Query Parameters**:

- `pickup_location` (required)
- `destination` (required)
- `departure_date` (required)
- `seats_needed` (optional)

**Response**:

```json
[
  {
    "id": "uuid",
    "driver": {
      "id": "uuid",
      "full_name": "John Doe",
      "rating": 4.5
    },
    "vehicle": {
      "type": "Car",
      "model": "Honda City"
    },
    "pickup_location": "Hyderabad",
    "destination": "Vijayawada",
    "departure_date": "2024-01-15",
    "departure_time": "10:00",
    "available_seats": 3,
    "price_per_seat": 500
  }
]
```

#### GET /api/rides/driver

**Purpose**: Get driver's rides

**Query Parameters**:

- `status` (optional): scheduled, in_progress, completed

#### GET /api/rides/:id

**Purpose**: Get ride details

### Booking APIs (`services/api/bookings.ts`)

#### POST /api/bookings

**Purpose**: Create booking

**Request Body**:

```json
{
  "ride_id": "uuid",
  "seats_booked": 2,
  "total_amount": 1000,
  "payment_method": "wallet",
  "promo_code": "SAVE50"
}
```

#### GET /api/bookings/passenger

**Purpose**: Get passenger bookings

#### GET /api/bookings/driver

**Purpose**: Get driver's ride bookings

#### PUT /api/bookings/:id/status

**Purpose**: Update booking status

**Request Body**:

```json
{
  "status": "confirmed"
}
```

### Wallet APIs (`services/api/wallet.ts`)

#### GET /api/wallet/balance

**Purpose**: Get wallet balance

**Response**:

```json
{
  "balance": 5000,
  "currency": "INR"
}
```

#### POST /api/wallet/add-money

**Purpose**: Add money to wallet

**Request Body**:

```json
{
  "amount": 1000,
  "payment_method": "upi"
}
```

#### GET /api/wallet/transactions

**Purpose**: Get transaction history

#### POST /api/wallet/payment

**Purpose**: Process payment

**Request Body**:

```json
{
  "booking_id": "uuid",
  "amount": 1000,
  "method": "wallet"
}
```

### Vehicle APIs (`services/api/vehicles.ts`)

#### POST /api/vehicles

**Purpose**: Register vehicle

**Request Body**:

```json
{
  "vehicle_type": "Car",
  "brand": "Honda",
  "model": "City",
  "year": 2020,
  "color": "White",
  "license_plate": "TS09AB1234",
  "rc_book_url": "https://...",
  "insurance_url": "https://...",
  "vehicle_photo_url": "https://..."
}
```

#### POST /api/vehicles/upload

**Purpose**: Upload vehicle document

**Request**: FormData with file

**Response**:

```json
{
  "url": "https://supabase.co/storage/..."
}
```

### Chat APIs (`services/api/chat.ts`)

#### GET /api/chat/:rideId

**Purpose**: Get chat messages

#### POST /api/chat

**Purpose**: Send message

**Request Body**:

```json
{
  "ride_id": "uuid",
  "receiver_id": "uuid",
  "message": "Hello!"
}
```

### Rating APIs (`services/api/ratings.ts`)

#### POST /api/ratings

**Purpose**: Rate driver

**Request Body**:

```json
{
  "booking_id": "uuid",
  "driver_id": "uuid",
  "rating": 5,
  "review": "Excellent ride!"
}
```

#### GET /api/ratings/driver/:driverId

**Purpose**: Get driver ratings

### Admin APIs (`services/api/admin.ts`)

#### GET /api/admin/stats

**Purpose**: Get system statistics

#### GET /api/admin/users

**Purpose**: Get all users

#### PUT /api/admin/users/:id/suspend

**Purpose**: Suspend user

#### GET /api/admin/drivers/pending

**Purpose**: Get pending driver verifications

#### PUT /api/admin/drivers/:id/verify

**Purpose**: Verify driver

**Request Body**:

```json
{
  "status": "verified",
  "rejection_reason": null
}
```

### Complaint APIs (`services/api/complaints.ts`)

#### POST /api/complaints

**Purpose**: Submit complaint

**Request Body**:

```json
{
  "ride_id": "uuid",
  "type": "driver_behavior",
  "description": "Driver was rude",
  "priority": "medium"
}
```

#### GET /api/complaints

**Purpose**: Get all complaints

#### PUT /api/complaints/:id/resolve

**Purpose**: Resolve complaint

**Request Body**:

```json
{
  "status": "resolved",
  "resolution": "Refund processed"
}
```

---

## Database Schema

### Tables Overview

#### 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'passenger', 'admin')),
  phone_number VARCHAR(20),
  gender VARCHAR(10),
  date_of_birth DATE,
  address TEXT,
  profile_photo_url TEXT,
  driving_license VARCHAR(50),
  license_photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. vehicles

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50),
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  rc_book_url TEXT,
  insurance_url TEXT,
  vehicle_photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. rides

```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  pickup_location VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  available_seats INTEGER NOT NULL,
  price_per_seat DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. bookings

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seats_booked INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  promo_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. wallet_balances

```sql
CREATE TABLE wallet_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'INR',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. chat_messages

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. ratings

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 9. complaints

```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id),
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. loyalty_points

```sql
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'bronze',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 11. eco_savings

```sql
CREATE TABLE eco_savings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  co2_saved DECIMAL(10, 2),
  distance_km DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---
