import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const MyRidesScreen = () => {

  const [activeTab, setActiveTab] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedRide, setSelectedRide] = useState(null);

  const rides = [
    {
      id: '1',
      role: 'driver',
      from: 'Mumbai',
      to: 'Pune',
      date: '15 Mar 2025',
      time: '09:30 AM',
      price: 450,
      seats: 3,
      status: 'active',
      passengers: 2,
      earnings: 900,
    },
    {
      id: '2',
      role: 'driver',
      from: 'Delhi',
      to: 'Jaipur',
      date: '18 Feb 2026',
      time: '07:00 AM',
      price: 650,
      seats: 4,
      status: 'active',
      passengers: 1,
      earnings: 650,
      isReturn: true,
    },
    {
      id: '3',
      role: 'driver',
      from: 'Bangalore',
      to: 'Mysore',
      date: '10 Jan 2026',
      time: '08:00 AM',
      price: 350,
      seats: 3,
      status: 'completed',
      passengers: 3,
      earnings: 1050,
    },
    {
      id: '4',
      role: 'driver',
      from: 'Chennai',
      to: 'Pondicherry',
      date: '05 Dec 2025',
      time: '06:30 AM',
      price: 400,
      seats: 4,
      status: 'completed',
      passengers: 4,
      earnings: 1600,
    },
    {
      id: '7',
      role: 'driver',
      from: 'Ahmedabad',
      to: 'Surat',
      date: '12 Oct 2025',
      time: '02:00 PM',
      price: 300,
      seats: 4,
      status: 'cancelled',
    },
    {
      id: '5',
      role: 'passenger',
      from: 'Hyderabad',
      to: 'Bangalore',
      date: '20 Nov 2025',
      time: '10:00 PM',
      price: 550,
      status: 'active',
      driverName: 'Rajesh Kumar',
      driverRating: 4.8,
    },
    {
      id: '6',
      role: 'passenger',
      from: 'Kolkata',
      to: 'Bhubaneswar',
      date: '25 Nov 2025',
      time: '11:00 PM',
      price: 500,
      status: 'active',
      driverName: 'Priya Singh',
      driverRating: 4.9,
    },
  ];

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const roleFilters = [
    { label: 'All Rides', value: 'all' },
    { label: '🚗 As Driver', value: 'driver' },
    { label: '🧑 As Passenger', value: 'passenger' },
  ];

  const filteredRides = rides
    .filter(ride => activeTab === 'all' || ride.status === activeTab)
    .filter(ride => roleFilter === 'all' || ride.role === roleFilter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#1A7A4A';
      case 'completed': return '#003580';
      case 'cancelled': return '#E05252';
      default: return '#8A9BB0';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🚗';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⏺️';
    }
  };

  const stats = {
    totalEarnings: rides
      .filter(r => r.role === 'driver' && r.status === 'completed')
      .reduce((sum, r) => sum + (r.earnings || 0), 0),

    totalSpent: rides
      .filter(r => r.role === 'passenger' && r.status === 'completed')
      .reduce((sum, r) => sum + r.price, 0),

    activeRides: rides.filter(r => r.status === 'active').length,
    completedRides: rides.filter(r => r.status === 'completed').length,
    asDriver: rides.filter(r => r.role === 'driver').length,
    asPassenger: rides.filter(r => r.role === 'passenger').length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1ba7e3" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Rides</Text>

          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tab,
                activeTab === tab.value && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.value)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.value && styles.activeTabText,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Role Filters */}
      <View style={styles.roleFilters}>
        {roleFilters.map(filter => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.roleChip,
              roleFilter === filter.value && styles.roleChipActive,
            ]}
            onPress={() => setRoleFilter(filter.value)}
          >
            <Text style={[
              styles.roleChipText,
              roleFilter === filter.value && styles.roleChipTextActive,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ride List */}
      <ScrollView style={styles.ridesList}>
        {
          filteredRides.map(ride => (
            <TouchableOpacity
              key={ride.id}
              style={[
                styles.rideCard,
                selectedRide === ride.id && styles.selectedRide,
                ride.role === 'passenger' && styles.passengerCard,
              ]}
              onPress={() => setSelectedRide(ride.id === selectedRide ? null : ride.id)}
              activeOpacity={0.7}
            >
              {/* Role Badge */}
              <View style={[
                styles.roleBadge,
                ride.role === 'driver' ? styles.driverBadge : styles.passengerBadge
              ]}>
                <Text style={styles.roleBadgeText}>
                  {ride.role === 'driver' ? '🚗 DRIVER' : '🧑 PASSENGER'}
                </Text>
              </View>

              {/* Status Bar */}
              <View style={[styles.statusBar, { backgroundColor: getStatusColor(ride.status) }]}>
                <Text style={styles.statusText}>
                  {getStatusIcon(ride.status)} {ride.status.toUpperCase()}
                </Text>
                {/* {ride.isReturn && (
                  <View style={styles.returnBadge}>
                    <Text style={styles.returnText}>🔄 Return</Text>
                  </View>
                )} */}
              </View>

              {/* Main Content */}
              <View style={styles.rideMain}>
                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDotFrom, ride.role === 'passenger' && styles.passengerDot]} />
                    <Text style={styles.routeCity}>{ride.from}</Text>
                  </View>
                  
                  <View style={styles.routeLine}>
                    <View style={styles.routeDash} />
                    <Text style={styles.routeTime}>{ride.time}</Text>
                    <View style={styles.routeDash} />
                  </View>
                  
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDotTo, ride.role === 'passenger' && styles.passengerDotTo]} />
                    <Text style={styles.routeCity}>{ride.to}</Text>
                  </View>
                </View>

                {/* Driver/Passenger Info */}
                {ride.role === 'passenger' && ride.driverName && (
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverLabel}>Driver</Text>
                    <View style={styles.driverDetails}>
                      <Text style={styles.driverName}>{ride.driverName}</Text>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingStar}>★</Text>
                        <Text style={styles.ratingText}>{ride.driverRating}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.rideDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>{ride.date}</Text>
                  </View>
                  
                  {ride.role === 'driver' ? (
                    <>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>💺</Text>
                        <Text style={styles.detailText}>{ride.passengers || 0}/{ride.seats} seats</Text>
                      </View>
                      <View style={styles.priceTag}>
                        <Text style={styles.priceText}>₹{ride.price}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🎫</Text>
                        <Text style={styles.detailText}>1 seat</Text>
                      </View>
                      <View style={[styles.priceTag, styles.passengerPrice]}>
                        <Text style={styles.priceText}>₹{ride.price}</Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Expanded Details */}
                {selectedRide === ride.id && (
                  <View style={styles.expandedDetails}>
                    <View style={styles.expandedDivider} />
                    
                    {ride.role === 'driver' ? (
                      // Driver expanded view
                      <>
                        <View style={styles.expandedRow}>
                          <Text style={styles.expandedLabel}>Passengers</Text>
                          <Text style={styles.expandedValue}>
                            {ride.passengers || 0} / {ride.seats}
                          </Text>
                        </View>
                        
                        {ride.earnings && (
                          <View style={styles.expandedRow}>
                            <Text style={styles.expandedLabel}>Earnings</Text>
                            <Text style={styles.expandedValue}>₹{ride.earnings}</Text>
                          </View>
                        )}

                        <View style={styles.expandedRow}>
                          <Text style={styles.expandedLabel}>Price per seat</Text>
                          <Text style={styles.expandedValue}>₹{ride.price}</Text>
                        </View>
                      </>
                    ) : (
                      // Passenger expanded view
                      <>
                        <View style={styles.expandedRow}>
                          <Text style={styles.expandedLabel}>Booking ID</Text>
                          <Text style={styles.expandedValue}>#BLB{ride.id.padStart(6, '0')}</Text>
                        </View>
                        
                        <View style={styles.expandedRow}>
                          <Text style={styles.expandedLabel}>Seat booked</Text>
                          <Text style={styles.expandedValue}>1 seat</Text>
                        </View>
                        
                        <View style={styles.expandedRow}>
                          <Text style={styles.expandedLabel}>Amount paid</Text>
                          <Text style={styles.expandedValue}>₹{ride.price}</Text>
                        </View>

                        {ride.driverName && (
                          <View style={styles.expandedRow}>
                            <Text style={styles.expandedLabel}>Driver contact</Text>
                            <TouchableOpacity style={styles.contactBtn}>
                              <Text style={styles.contactBtnText}>Contact</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}
                    
                    <View style={styles.actionButtons}>
                      {ride.status === 'active' && ride.role === 'driver' && (
                        <>
                          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
                            <Text style={styles.actionBtnText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
                            <Text style={styles.actionBtnText}>View Details</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      
                      {ride.status === 'active' && ride.role === 'passenger' && (
                        <>
                          <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
                            <Text style={styles.actionBtnText}>Trip Details</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtn, styles.contactBtnLarge]}>
                            <Text style={styles.actionBtnText}>Message Driver</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      
                      {ride.status === 'completed' && ride.role === 'driver' && (
                        <TouchableOpacity style={[styles.actionBtn, styles.repeatBtn]}>
                          <Text style={styles.actionBtnText}>Repeat Ride 🔄</Text>
                        </TouchableOpacity>
                      )}

                      {ride.status === 'completed' && ride.role === 'passenger' && (
                        <TouchableOpacity style={[styles.actionBtn, styles.reviewBtn]}>
                          <Text style={styles.actionBtnText}>Rate Driver ⭐</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

    </SafeAreaView>
  );
};

export default MyRidesScreen;


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    marginTop:50
  },
  header: {
    backgroundColor: '#7ec0db',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 22,
  },
  statsScroll: {
    paddingLeft: 20,
  },
  statsContainer: {
    paddingRight: 30,
  },
  statCard: {
    width: 140,
    height: 100,
    borderRadius: 20,
    padding: 15,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  statCardIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    opacity: 0.3,
  },
  statCardIconText: {
    fontSize: 40,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tabsScroll: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#F0F7FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A9BB0',
  },
  activeTabText: {
    color: '#003580',
    fontWeight: '800',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 15,
    right: 15,
    height: 3,
    backgroundColor: '#003580',
    borderRadius: 3,
  },
  roleFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  roleChipActive: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  roleChipTextActive: {
    color: '#fff',
  },
  ridesList: {
    flex: 1,
    marginTop: 15,
  },
  ridesContent: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  passengerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B44CA',
  },
  selectedRide: {
    shadowColor: '#003580',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  roleBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  driverBadge: {
    backgroundColor: 'rgba(0,53,128,0.1)',
  },
  passengerBadge: {
    backgroundColor: 'rgba(139,68,202,0.1)',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  returnBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  returnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  rideMain: {
    padding: 16,
  },
  routeContainer: {
    marginBottom: 15,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  routeDotFrom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#003580',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E8EEF8',
  },
  routeDotTo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1A7A4A',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E8EEF8',
  },
  passengerDot: {
    backgroundColor: '#8B44CA',
  },
  passengerDotTo: {
    backgroundColor: '#E05252',
  },
  routeCity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2332',
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginVertical: 5,
  },
  routeDash: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E7FF',
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#C5CDD8',
  },
  routeTime: {
    fontSize: 11,
    color: '#8A9BB0',
    fontWeight: '600',
    marginHorizontal: 10,
  },
  driverInfo: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  driverLabel: {
    fontSize: 11,
    color: '#8A9BB0',
    fontWeight: '600',
    marginBottom: 4,
  },
  driverDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2332',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingStar: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2332',
  },
  rideDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FF',
    borderRadius: 15,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
  },
  priceTag: {
    backgroundColor: '#003580',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  passengerPrice: {
    backgroundColor: '#8B44CA',
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  expandedDetails: {
    marginTop: 15,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: '#F0F4FA',
    marginBottom: 15,
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  expandedLabel: {
    fontSize: 14,
    color: '#8A9BB0',
    fontWeight: '500',
  },
  expandedValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2332',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#F0F4FA',
  },
  viewBtn: {
    backgroundColor: '#003580',
  },
  contactBtnLarge: {
    backgroundColor: '#8B44CA',
  },
  repeatBtn: {
    backgroundColor: '#1A7A4A',
  },
  reviewBtn: {
    backgroundColor: '#FFA500',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  contactBtn: {
    backgroundColor: '#003580',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2332',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8A9BB0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  browseBtn: {
    backgroundColor: '#003580',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 30,
  },
});
