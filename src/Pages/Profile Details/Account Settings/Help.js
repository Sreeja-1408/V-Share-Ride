import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./AccountStyles";

const Help = () => {
  const faqs = [
    {
      q: "How to book a ride?",
      a: "Search → Select → Confirm booking",
    },
    {
      q: "How to cancel ride?",
      a: "Go to My Rides → Cancel",
    },
    {
      q: "How payment works?",
      a: "Pay after booking confirmation",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      {/* FAQ */}
      <View style={styles.card}>
        <Text style={styles.section}>❓ FAQs</Text>

        {faqs.map((item, i) => (
          <View key={i} style={{ marginTop: 8 }}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}
      </View>

      {/* CONTACT */}
      <View style={styles.card}>
        <Text style={styles.section}>📞 Contact</Text>

        <TouchableOpacity>
          <Text style={styles.link}>📧 support@rideshare.com</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>📱 +91 90000 00000</Text>
        </TouchableOpacity>
      </View>

      {/* EMERGENCY */}
      <View style={styles.card}>
        <Text style={styles.section}>🚨 Emergency</Text>
        <Text style={styles.answer}>Use SOS during ride</Text>
      </View>
    </ScrollView>
  );
};

export default Help;