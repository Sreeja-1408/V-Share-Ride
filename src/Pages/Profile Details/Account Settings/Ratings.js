import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const RatingsScreen = () => {
  const [activeTab, setActiveTab] = useState("received");

  // 🔥 Dummy Data
  const receivedReviews = [
    {
      id: "1",
      name: "Ramesh",
      rating: 5,
      comment: "Very smooth ride, friendly driver!",
      date: "18 Mar 2026",
    },
    {
      id: "2",
      name: "Anjali",
      rating: 4,
      comment: "Good driving, reached on time",
      date: "17 Mar 2026",
    },
    {
      id: "3",
      name: "Kiran",
      rating: 3,
      comment: "Average experience",
      date: "15 Mar 2026",
    },
  ];

  const givenReviews = [
    {
      id: "4",
      name: "Suresh (Driver)",
      rating: 4,
      comment: "Car was clean and comfortable",
      date: "19 Mar 2026",
    },
    {
      id: "5",
      name: "Mahesh (Driver)",
      rating: 5,
      comment: "Very punctual and polite",
      date: "14 Mar 2026",
    },
  ];

  const data =
    activeTab === "received" ? receivedReviews : givenReviews;

  // ⭐ Star Render
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.topRow}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      {/* Rating */}
      <Text style={styles.stars}>{renderStars(item.rating)}</Text>

      {/* Comment */}
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Ratings & Reviews</Text>

      {/* TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "received" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText,
            ]}
          >
            As Driver 🚗
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "given" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("given")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "given" && styles.activeTabText,
            ]}
          >
            As Passenger 🧍
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No reviews found</Text>
        }
      />
    </View>
  );
};

export default RatingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EAEFFF",
    marginRight: 5,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#6B4EFF",
  },
  tabText: {
    color: "#333",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  stars: {
    marginVertical: 5,
    fontSize: 14,
    color: "#FFD700",
  },
  comment: {
    fontSize: 14,
    color: "#444",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
});