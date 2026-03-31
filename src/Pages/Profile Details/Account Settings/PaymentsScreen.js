import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PaymentsScreen = () => {
  // 🔥 Dummy MyRides Data
  const rides = [
    { id: "1", price: 350, date: "2026-03-23", role: "passenger" },
    { id: "2", price: 500, date: "2026-03-23", role: "driver" },
    { id: "3", price: 200, date: "2026-03-22", role: "passenger" },
    { id: "4", price: 800, date: "2026-03-21", role: "driver" },
    { id: "5", price: 150, date: "2026-03-23", role: "passenger" },
  ];

  const today = new Date().toISOString().split("T")[0];

  // ✅ TOTAL SPENT
  const totalSpent = rides
    .filter((r) => r.role === "passenger")
    .reduce((sum, r) => sum + r.price, 0);

  // ✅ TOTAL EARNED
  const totalEarned = rides
    .filter((r) => r.role === "driver")
    .reduce((sum, r) => sum + r.price, 0);

  // ✅ TODAY SPENT
  const todaySpent = rides
    .filter((r) => r.role === "passenger" && r.date === today)
    .reduce((sum, r) => sum + r.price, 0);

  // ✅ TODAY EARNED
  const todayEarned = rides
    .filter((r) => r.role === "driver" && r.date === today)
    .reduce((sum, r) => sum + r.price, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Finance</Text>


    {/* EXTRA */}
      <View style={styles.card}>
        <Text style={styles.section}>📊 Summary</Text>

        <Text>Total Rides: {rides.length}</Text>
        <Text>
          Passenger Rides:{" "}
          {rides.filter((r) => r.role === "passenger").length}
        </Text>
        <Text>
          Driver Rides:{" "}
          {rides.filter((r) => r.role === "driver").length}
        </Text>
      </View>

      {/* PASSENGER */}
      <View style={styles.card}>
        <Text style={styles.section}>💸 Passenger Spending</Text>

        <Text style={styles.amount}>₹ {totalSpent}</Text>
        <Text style={styles.sub}>Total Spent</Text>

        <Text style={styles.small}>Today: ₹ {todaySpent}</Text>
      </View>

      {/* DRIVER */}
      <View style={styles.card}>
        <Text style={styles.section}>💰 Driver Earnings</Text>

        <Text style={styles.amount}>₹ {totalEarned}</Text>
        <Text style={styles.sub}>Total Earned</Text>

        <Text style={styles.small}>Today: ₹ {todayEarned}</Text>
      </View>

  
    </ScrollView>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6B4EFF",
  },
  sub: {
    fontSize: 13,
    color: "#666",
  },
  small: {
    marginTop: 5,
    fontSize: 12,
    color: "#888",
  },
});