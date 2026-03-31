import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const RideDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { ride } = route.params;

  // ✅ Derived values
  const isInstant = ride.seats > 2;
  const driverRating = ride.rating;
  const passengerRating = (ride.rating - 0.3).toFixed(1);
  const overallRating = (
    (driverRating + Number(passengerRating)) /
    2
  ).toFixed(1);

  const isStopRide = ride.isStopRide;

  // Mock driver image - in real app, you'd use actual image from ride data
  const driverInitial = ride.driver.charAt(0).toUpperCase();

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
    

      {/* DRIVER CARD */}
      <View style={styles.card}>
        <View style={styles.driverHeader}>
          <View style={styles.driverAvatar}>
            <Text style={styles.avatarText}>{driverInitial}</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ride.driver}</Text>
            <Text style={styles.carInfo}>{ride.car}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>⭐ {overallRating}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reviewsLink}
          onPress={() =>
            navigation.navigate("ReviewsScreen", {
              rideId: ride.id,
            })
          }
          activeOpacity={0.7}
        >
          <Text style={styles.reviewsLinkText}>
            View all reviews ({Math.floor(Math.random() * 50) + 10})
          </Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.ratingRow}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Driver</Text>
            <Text style={styles.ratingValue}>⭐ {driverRating}</Text>
          </View>
          <View style={styles.ratingDivider} />
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Passenger</Text>
            <Text style={styles.ratingValue}>⭐ {passengerRating}</Text>
          </View>
        </View>

        {/* Verification badges */}
        <View style={styles.verificationRow}>
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationIcon}>✓</Text>
            <Text style={styles.verificationText}>Identity verified</Text>
          </View>
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationIcon}>✓</Text>
            <Text style={styles.verificationText}>Phone verified</Text>
          </View>
        </View>
      </View>

      {/* ROUTE CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>📍</Text> Trip Route
        </Text>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={styles.routeDotStart} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.routeContent}>
            <Text style={styles.routeLabel}>FROM</Text>
            <Text style={styles.routeText}>{ride.from}</Text>
          </View>
        </View>

        {/* Stop if exists */}
        {ride.stop === "true" && ride.stopPlace !== "" && (
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={styles.routeDotStop} />
              <View style={styles.routeLine} />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>STOP</Text>
              <Text style={styles.routeText}>{ride.stopPlace}</Text>
            </View>
          </View>
        )}

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={styles.routeDotEnd} />
          </View>
          <View style={styles.routeContent}>
            <Text style={styles.routeLabel}>TO</Text>
            <Text style={styles.routeText}>{ride.to}</Text>
          </View>
        </View>

        {/* Stop info banner */}
        <View style={[styles.infoBanner, isStopRide ? styles.stopBanner : styles.directBanner]}>
          <Text style={styles.infoBannerIcon}>
            {isStopRide ? "🛑" : "🎯"}
          </Text>
          <Text style={[styles.infoBannerText, isStopRide ? styles.stopBannerText : styles.directBannerText]}>
            {isStopRide
              ? "Your drop is a STOP (not final destination)"
              : "You will be dropped at final destination"}
          </Text>
        </View>

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeItem}>
            <Text style={styles.dateTimeIcon}>📅</Text>
            <View>
              <Text style={styles.dateTimeLabel}>DATE</Text>
              <Text style={styles.dateTimeValue}>{ride.date}</Text>
            </View>
          </View>
          <View style={styles.dateTimeItem}>
            <Text style={styles.dateTimeIcon}>⏰</Text>
            <View>
              <Text style={styles.dateTimeLabel}>TIME</Text>
              <Text style={styles.dateTimeValue}>{ride.time}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* BOOKING INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>💰</Text> Pricing & Availability
        </Text>

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Price per seat</Text>
            <Text style={styles.priceValue}>₹{ride.price}</Text>
          </View>
          <View style={styles.seatsContainer}>
            <Text style={styles.seatsCount}>{ride.seats}</Text>
            <Text style={styles.seatsLabel}>seats left</Text>
          </View>
        </View>

        <View style={styles.bookingTypeContainer}>
          <View style={[styles.bookingTypeBadge, isInstant ? styles.instantBadge : styles.approvalBadge]}>
            <Text style={styles.bookingTypeIcon}>{isInstant ? "⚡" : "⏳"}</Text>
            <Text style={[styles.bookingTypeText, isInstant ? styles.instantText : styles.approvalText]}>
              {isInstant ? "Instant Booking" : "Approval Required"}
            </Text>
          </View>
          <Text style={styles.bookingNote}>
            {isInstant 
              ? "Book immediately without waiting" 
              : "Driver will respond within 30 minutes"}
          </Text>
        </View>
      </View>

      {/* PREFERENCES CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>⚙️</Text> Ride Preferences
        </Text>

        <View style={styles.preferencesGrid}>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceIcon}>🐶</Text>
            <View>
              <Text style={styles.preferenceLabel}>Pets</Text>
              <Text style={[styles.preferenceValue, ride.id % 2 === 0 ? styles.allowed : styles.notAllowed]}>
                {ride.id % 2 === 0 ? "Allowed" : "Not Allowed"}
              </Text>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceIcon}>🚭</Text>
            <View>
              <Text style={styles.preferenceLabel}>Smoking</Text>
              <Text style={[styles.preferenceValue, styles.notAllowed]}>Not Allowed</Text>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceIcon}>🎵</Text>
            <View>
              <Text style={styles.preferenceLabel}>Music</Text>
              <Text style={[styles.preferenceValue, styles.allowed]}>Allowed</Text>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceIcon}>🛄</Text>
            <View>
              <Text style={styles.preferenceLabel}>Luggage</Text>
              <Text style={styles.preferenceValue}>Medium</Text>
            </View>
          </View>
        </View>
      </View>

      {/* DRIVER MESSAGE CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>💬</Text> Driver's Message
        </Text>
        
        <View style={styles.messageContainer}>
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>{driverInitial}</Text>
          </View>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Please be on time. Pickup will be exact location. Call before boarding.
            </Text>
          </View>
        </View>
      </View>

      {/* BOOK BUTTON */}
      <View style={styles.bookButtonContainer}>
        <TouchableOpacity 
          style={[styles.bookBtn, isInstant ? styles.instantBtn : styles.approvalBtn]}
          activeOpacity={0.9}
        >
          <View style={styles.bookBtnContent}>
            <Text style={styles.bookBtnIcon}>{isInstant ? "⚡" : "📝"}</Text>
            <View>
              <Text style={styles.bookBtnTitle}>
                {isInstant ? "Book Instantly" : "Request Booking"}
              </Text>
              <Text style={styles.bookBtnSubtitle}>
                {isInstant 
                  ? "No approval needed" 
                  : "Driver will confirm"}
              </Text>
            </View>
          </View>
          <Text style={styles.bookBtnPrice}>₹{ride.price}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EFF3F8",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: "#6B4EFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2332",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6B4EFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2332",
    marginBottom: 4,
  },
  carInfo: {
    fontSize: 14,
    color: "#8A9BB0",
    fontWeight: "500",
  },
  ratingBadge: {
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF8A4C",
  },
  reviewsLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4FA",
    marginTop: 5,
  },
  reviewsLinkText: {
    fontSize: 14,
    color: "#6B4EFF",
    fontWeight: "600",
  },
  chevron: {
    fontSize: 18,
    color: "#C5CDD8",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },
  ratingItem: {
    alignItems: "center",
    flex: 1,
  },
  ratingLabel: {
    fontSize: 12,
    color: "#8A9BB0",
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2332",
  },
  ratingDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E4E9F2",
  },
  verificationRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  verificationIcon: {
    fontSize: 12,
    color: "#4CAF50",
    marginRight: 4,
    fontWeight: "700",
  },
  verificationText: {
    fontSize: 11,
    color: "#2E7D32",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2332",
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  routePoint: {
    width: 30,
    alignItems: "center",
  },
  routeDotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  routeDotStop: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF9800",
    borderWidth: 2,
    borderColor: "#fff",
  },
  routeDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F44336",
    borderWidth: 2,
    borderColor: "#fff",
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: "#E0E7F0",
    marginTop: 2,
  },
  routeContent: {
    flex: 1,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FA",
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#8A9BB0",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2332",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 15,
  },
  stopBanner: {
    backgroundColor: "#FFF3E0",
  },
  directBanner: {
    backgroundColor: "#E8F5E9",
  },
  infoBannerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  stopBannerText: {
    color: "#E65100",
  },
  directBannerText: {
    color: "#2E7D32",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 12,
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateTimeIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  dateTimeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#8A9BB0",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2332",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 12,
    color: "#8A9BB0",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6B4EFF",
  },
  seatsContainer: {
    alignItems: "center",
  },
  seatsCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A2332",
  },
  seatsLabel: {
    fontSize: 11,
    color: "#8A9BB0",
    fontWeight: "500",
  },
  bookingTypeContainer: {
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 15,
  },
  bookingTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  instantBadge: {
    backgroundColor: "#E8F5E9",
  },
  approvalBadge: {
    backgroundColor: "#FFF3E0",
  },
  bookingTypeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  bookingTypeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  instantText: {
    color: "#2E7D32",
  },
  approvalText: {
    color: "#E65100",
  },
  bookingNote: {
    fontSize: 12,
    color: "#8A9BB0",
  },
  preferencesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // margin:5,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    width: (width - 72) / 2,
    backgroundColor: "#F8FAFD",
    padding: 12,
    borderRadius: 12,
  },
  preferenceIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  preferenceLabel: {
    fontSize: 11,
    color: "#8A9BB0",
    fontWeight: "600",
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  allowed: {
    color: "#2E7D32",
  },
  notAllowed: {
    color: "#C62828",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6B4EFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  messageAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  messageBubble: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    borderRadius: 18,
    padding: 15,
  },
  messageText: {
    fontSize: 14,
    color: "#1A2332",
    lineHeight: 20,
  },
  bookButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#F8FAFD",
  },
  bookBtn: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#6B4EFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  instantBtn: {
    backgroundColor: "#4CAF50",
  },
  approvalBtn: {
    backgroundColor: "#FF9800",
  },
  bookBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  bookBtnIcon: {
    fontSize: 28,
    marginRight: 12,
    color: "#fff",
  },
  bookBtnTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  bookBtnSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  bookBtnPrice: {
    position: "absolute",
    right: 16,
    top: 22,
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
});