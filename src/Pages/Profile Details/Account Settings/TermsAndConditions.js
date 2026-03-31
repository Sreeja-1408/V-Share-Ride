import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import styles from "./AccountStyles.js"

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>

      <Text style={styles.text}>
        Welcome to our Ride Sharing App. By using this app, you agree to the following terms:
      </Text>

      <Text style={styles.section}>1. Usage</Text>
      <Text style={styles.text}>
        Users can book rides as passengers or post rides as drivers. All users must provide accurate information.
      </Text>

      <Text style={styles.section}>2. Booking</Text>
      <Text style={styles.text}>
        Bookings depend on availability. Drivers can accept or reject ride requests.
      </Text>

      <Text style={styles.section}>3. Payments</Text>
      <Text style={styles.text}>
        Payments shown in the app are indicative and must be honored by both parties.
      </Text>

      <Text style={styles.section}>4. Cancellation</Text>
      <Text style={styles.text}>
        Users can cancel rides. Frequent cancellations may lead to restrictions.
      </Text>

      <Text style={styles.section}>5. Safety</Text>
      <Text style={styles.text}>
        Users must follow safety guidelines. Misuse of the platform may result in account suspension.
      </Text>

      <Text style={styles.section}>6. Liability</Text>
      <Text style={styles.text}>
        The app acts as a platform and is not responsible for disputes between users.
      </Text>
    </ScrollView>
  );
};

export default TermsAndConditions;

