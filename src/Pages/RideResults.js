import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const RideResults = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { from, to, passengers, date } = route.params;

  // ✅ Normalize inputs
  const fromText = from.trim().toLowerCase();
  const toText = to.trim().toLowerCase();
  const selectedDate = new Date(date).toISOString().split("T")[0];

  // 🔥 Dummy rides
  const rides = [
    {
      id: "1",
      driver: "Ravi Kumar",
      car: "Swift Dzire",
      rating: 4.5,
      from: "Hyderabad",
      to: "Karimnagar",
      date: "2026-03-18",
      time: "07:30 AM",
      price: 350,
      seats: 3,
      stop: "true",
      stopPlace: "Kamareddy",
    },
    {
      id: "2",
      driver: "Suresh",
      car: "Hyundai i20",
      rating: 4.2,
      from: "KPHB",
      to: "Peddapalli",
      date: "2026-03-18",
      time: "09:00 AM",
      price: 300,
      seats: 1,
      stop: "false",
      stopPlace: "",
    },
    {
      id: "3",
      driver: "Anil",
      car: "Innova",
      rating: 4.8,
      from: "Hyderabad",
      to: "Peddapalli",
      date: "2026-03-18",
      time: "06:00 AM",
      price: 500,
      seats: 5,
      stop: "false",
      stopPlace: "",
    },
    {
      id: "4",
      driver: "Mahesh",
      car: "Ertiga",
      rating: 4.3,
      from: "Secunderabad",
      to: "Karimnagar",
      date: "2026-03-18",
      time: "08:15 AM",
      price: 400,
      seats: 2,
      stop: "true",
      stopPlace: "Siddipet",
    },
    {
      id: "5",
      driver: "Naresh",
      car: "Alto",
      rating: 4.0,
      from: "Hyderabad",
      to: "Warangal",
      date: "2026-03-18",
      time: "10:00 AM",
      price: 250,
      seats: 3,
      stop: "true",
      stopPlace: "Yadagirigutta",
    },
    {
      id: "6",
      driver: "Kiran",
      car: "Baleno",
      rating: 4.6,
      from: "Kukatpally",
      to: "Karimnagar",
      date: "2026-03-18",
      time: "07:00 AM",
      price: 370,
      seats: 4,
      stop: "true",
      stopPlace: "Duddeda Siddipet",
    },
    {
      id: "7",
      driver: "Ramesh",
      car: "Innova",
      rating: 4.9,
      from: "Kamareddy",
      to: "Hyderabad",
      date: "2026-03-19",
      time: "05:30 AM",
      price: 550,
      seats: 6,
      stop: "false",
      stopPlace: "",
    },
    {
      id: "8",
      driver: "Ajay",
      car: "Swift",
      rating: 4.1,
      from: "Kamareddy",
      to: "Hyderabad",
      date: "2026-03-19",
      time: "11:00 AM",
      price: 320,
      seats: 2,
      stop: "false",
      stopPlace: "",
    },
    {
      id: "9",
      driver: "Vijay",
      car: "Creta",
      rating: 4.7,
      from: "Hyderabad",
      to: "Karimnagar",
      date: "2026-03-27",
      time: "12:30 PM",
      price: 600,
      seats: 3,
      stop: "true",
      stopPlace: "Kamareddy",
    },
    {
      id: "10",
      driver: "Sathish",
      car: "WagonR",
      rating: 4.2,
      from: "Miyapur",
      to: "Karimnagar",
      date: "2026-03-18",
      time: "01:00 PM",
      price: 280,
      seats: 1,
      stop: "false",
      stopPlace: "",
    },
    {
      id: "11",
      driver: "Praveen",
      car: "i10",
      rating: 4.3,
      from: "Hyderabad",
      to: "Peddapalli",
      date: "2026-03-18",
      time: "02:30 PM",
      price: 300,
      seats: 2,
      stop: "true",
      stopPlace: "Gajwel Karimnagar",
    },
    {
      id: "12",
      driver: "Lokesh",
      car: "XUV500",
      rating: 4.8,
      from: "Hyderabad",
      to: "Karimnagar",
      date: "2026-03-18",
      time: "03:00 PM",
      price: 650,
      seats: 5,
      stop: "false",
      stopPlace: "",
    },
  ];

  // ✅ Match functions
  const matchLocation = (rideLoc, userLoc) => {
    const rideCity = rideLoc.toLowerCase();
    return (
      userLoc.includes(rideCity) ||
      rideCity.includes(userLoc) ||
      userLoc
        .split(/[,\s]+/)
        .some((word) => word.length > 2 && rideCity.includes(word))
    );
  };

  const isStopMatch = (stopPlace, userLoc) => {
    if (!stopPlace) return false;

    return stopPlace
      .toLowerCase()
      .split(/[,\s]+/)
      .some(
        (stop) =>
          userLoc.includes(stop) || stop.includes(userLoc)
      );
  };

  // ✅ FILTER + STOP FLAG
  const finalRides = rides
    .filter((ride) => {
      const fromMatch = matchLocation(ride.from, fromText);

      const toFinalMatch = matchLocation(ride.to, toText);
      const toStopMatch = isStopMatch(ride.stopPlace, toText);

      return (
        ride.date === selectedDate &&
        ride.seats >= passengers &&
        fromMatch &&
        (toFinalMatch || toStopMatch)
      );
    })
    .map((ride) => ({
      ...ride,
      isStopRide: isStopMatch(ride.stopPlace, toText),
    }));

  // ✅ UI
  const renderRide = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RideDetails", { ride: item })
      }
    >
      <View style={styles.topRow}>
        <Text style={styles.driver}>{item.driver}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>

      <Text style={styles.route}>
        {item.from} → {item.to}
      </Text>

      {/* STOP / FINAL */}
      <Text style={styles.stopInfo}>
        {item.isStopRide
          ? `📍 Your drop: ${to} (Stop)`
          : "🎯 Direct Drop"}
      </Text>

      {/* VIA */}
      {item.stop === "true" && item.stopPlace !== "" && (
        <Text style={styles.stopText}>
          Via: {item.stopPlace}
        </Text>
      )}

      <View style={styles.bottomRow}>
        <Text style={styles.time}>🕒 {item.time}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
      </View>

      <Text style={styles.seats}>
        🪑 {item.seats} seats left
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rides</Text>

      <FlatList
        data={finalRides}
        keyExtractor={(item) => item.id}
        renderItem={renderRide}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No rides available 😔
          </Text>
        }
      />
    </View>
  );
};

export default RideResults;

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  driver: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "#555",
  },
  route: {
    fontSize: 15,
    marginVertical: 5,
  },
  stopInfo: {
    fontSize: 13,
    color: "#FF6B6B",
    marginTop: 4,
    fontWeight: "600",
  },
  stopText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B4EFF",
  },
  seats: {
    marginTop: 5,
    fontSize: 13,
    color: "green",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
});