import React, { useState ,useEffect} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ReviewsScreen = () => {
   const navigation = useNavigation();
  const route = useRoute(); // Add this to get params
  const { rideId } = route.params; // Get rideId from navigation params
  
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([]); // Make reviews stateful
  const [loading, setLoading] = useState(true);

  // Fetch reviews based on rideId
  useEffect(() => {
    // In a real app, you would fetch reviews from an API using rideId
    // For now, using mock data but filtered by rideId
    fetchReviews(rideId);
  }, [rideId]);

 const fetchReviews = (id) => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      // You can have different reviews for different ride IDs
      const mockReviews = {
        ride1: [
          {
            id: "1",
            name: "Ramesh",
            rating: 5,
            comment: "Very smooth ride! Driver was punctual and car was clean. Highly recommended!",
            date: "2 days ago",
            avatar: "R",
            verified: true,
          },
          {
            id: "2",
            name: "Anjali",
            rating: 4,
            comment: "Good driver, comfortable journey. Would book again.",
            date: "1 week ago",
            avatar: "A",
            verified: true,
          },
        ],
        ride2: [
          {
            id: "3",
            name: "Kiran",
            rating: 3,
            comment: "Average experience. Ride was okay but driver was late by 10 minutes.",
            date: "2 weeks ago",
            avatar: "K",
            verified: false,
          },
          {
            id: "4",
            name: "Priya",
            rating: 5,
            comment: "Excellent service! Very professional driver and clean car.",
            date: "3 weeks ago",
            avatar: "P",
            verified: true,
          },
        ],
        ride3: [
          {
            id: "5",
            name: "Suresh",
            rating: 4,
            comment: "Good value for money. Would recommend.",
            date: "1 month ago",
            avatar: "S",
            verified: true,
          },
        ],
      };

      // Use the rideId to get specific reviews, or default to ride1
      const rideReviews = mockReviews[id] || mockReviews.ride1;
      setReviews(rideReviews);
      setLoading(false);
    }, 500); // Simulate network delay
  };
  // Calculate stats
 const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  
  const totalReviews = reviews.length;
  
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const filterOptions = ["all", "5", "4", "3", "2", "1"];

  const filteredReviews = selectedFilter === "all" 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(selectedFilter));

  const getRatingPercentage = (count) => totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={[styles.star, star <= rating && styles.starFilled]}>
            ★
          </Text>
        ))}
      </View>
    );
  };

  const renderRatingBar = (rating, count) => (
    <TouchableOpacity 
      style={styles.ratingBarRow}
      onPress={() => setSelectedFilter(rating.toString())}
      activeOpacity={0.7}
    >
      <Text style={styles.ratingBarLabel}>{rating} ★</Text>
      <View style={styles.ratingBarContainer}>
        <View 
          style={[
            styles.ratingBarFill, 
            { width: `${getRatingPercentage(count)}%` },
            selectedFilter === rating.toString() && styles.ratingBarFillActive
          ]} 
        />
      </View>
      <Text style={styles.ratingBarCount}>{count}</Text>
    </TouchableOpacity>
  );
  // Add loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
     
      {/* Rating Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.ratingOverview}>
          <View style={styles.averageContainer}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            <View style={styles.averageStars}>
              {renderStars(Math.round(averageRating))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
          </View>
          
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map(rating => 
              renderRatingBar(rating, ratingCounts[rating] || 0)
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive
              ]}>
                {filter === "all" ? "All" : `${filter} ★`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={[styles.reviewCard, index === 0 && { marginTop: 0 }]}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{item.avatar}</Text>
                </View>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.reviewerName}>{item.name}</Text>
                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingNumber}>{item.rating}</Text>
                <Text style={styles.ratingStar}>★</Text>
              </View>
            </View>
            
            <Text style={styles.reviewComment}>{item.comment}</Text>
            
            {/* Helpful section */}
            <View style={styles.reviewFooter}>
              <TouchableOpacity style={styles.helpfulButton}>
                <Text style={styles.helpfulIcon}>👍</Text>
                <Text style={styles.helpfulText}>Helpful</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportButton}>
                <Text style={styles.reportText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to write a review!</Text>
          </View>
        }
      />

      {/* Write Review Modal */}
      <Modal
        visible={showWriteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWriteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowWriteModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Your Rating</Text>
              <View style={styles.modalStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUserRating(star)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.modalStar,
                      star <= userRating && styles.modalStarActive
                    ]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Your Review</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Share your experience..."
                placeholderTextColor="#AAB4C4"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={userComment}
                onChangeText={setUserComment}
              />

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!userRating || !userComment.trim()) && styles.submitButtonDisabled
                ]}
                disabled={!userRating || !userComment.trim()}
                onPress={() => {
                  // Handle submit
                  setShowWriteModal(false);
                  setUserRating(0);
                  setUserComment("");
                }}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewsScreen;

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
  writeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6B4EFF",
    alignItems: "center",
    justifyContent: "center",
  },
  writeIcon: {
    fontSize: 18,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingOverview: {
    flexDirection: "row",
    marginBottom: 20,
  },
  averageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    marginRight: 20,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1A2332",
    lineHeight: 52,
  },
  averageStars: {
    marginVertical: 5,
  },
  totalReviews: {
    fontSize: 12,
    color: "#8A9BB0",
    fontWeight: "500",
  },
  ratingBars: {
    flex: 1,
    justifyContent: "center",
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingBarLabel: {
    width: 35,
    fontSize: 12,
    fontWeight: "600",
    color: "#8A9BB0",
  },
  ratingBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0F4FA",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 3,
  },
  ratingBarFillActive: {
    backgroundColor: "#6B4EFF",
  },
  ratingBarCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A2332",
    width: 25,
    textAlign: "right",
  },
  filterContainer: {
    marginTop: 5,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F7FF",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#6B4EFF",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A9BB0",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6B4EFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2332",
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: "#4CAF50",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedIcon: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "800",
  },
  reviewDate: {
    fontSize: 11,
    color: "#8A9BB0",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2332",
    marginRight: 2,
  },
  ratingStar: {
    fontSize: 14,
    color: "#FFC107",
  },
  reviewComment: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F4FA",
    paddingTop: 12,
  },
  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  helpfulIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  helpfulText: {
    fontSize: 12,
    color: "#8A9BB0",
    fontWeight: "600",
  },
  reportButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reportText: {
    fontSize: 12,
    color: "#C5CDD8",
    fontWeight: "600",
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 14,
    color: "#E0E7F0",
    marginRight: 2,
  },
  starFilled: {
    color: "#FFC107",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2332",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8A9BB0",
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2332",
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#8A9BB0",
    fontWeight: "600",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2332",
    marginBottom: 8,
  },
  modalStars: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalStar: {
    fontSize: 32,
    color: "#E0E7F0",
    marginHorizontal: 6,
  },
  modalStarActive: {
    color: "#FFC107",
  },
  modalInput: {
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    color: "#1A2332",
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#6B4EFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#C5CDD8",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
   loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B4EFF",
    fontWeight: "600",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#8A9BB0",
    fontWeight: "500",
    marginTop: 2,
  },
});