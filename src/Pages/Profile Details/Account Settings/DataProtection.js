import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import styles from "./AccountStyles.js"

const DataProtection = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Protection & Privacy</Text>

      <Text style={styles.text}>
        We value your privacy and are committed to protecting your data.
      </Text>

      <Text style={styles.section}>1. Data Collection</Text>
      <Text style={styles.text}>
        We collect your name, phone number, location, and ride history to provide services.
      </Text>

      <Text style={styles.section}>2. Data Usage</Text>
      <Text style={styles.text}>
        Your data is used for booking rides, improving services, and communication.
      </Text>

      <Text style={styles.section}>3. Data Sharing</Text>
      <Text style={styles.text}>
        Your data is only shared with drivers/passengers for ride purposes.
      </Text>

      <Text style={styles.section}>4. Security</Text>
      <Text style={styles.text}>
        We use secure authentication and encryption to protect your data.
      </Text>

      <Text style={styles.section}>5. User Rights</Text>
      <Text style={styles.text}>
        You can update or delete your account anytime.
      </Text>
    </ScrollView>
  );
};

export default DataProtection;