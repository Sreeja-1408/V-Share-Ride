// BookRide.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BookRide = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showDatePicker, setShowDatePicker] = useState(false);
const navigation = useNavigation();

const [date, setDate] = useState(new Date());
const [showPicker, setShowPicker] = useState(false);
  const dates = ['Today', 'Tomorrow', 'This Week'];

  const recentSearches = [
    {
      id: '1',
      from: 'Block -C, INDU FORTUNE FIELDS, Kukatpally Housing Board Colony, Fortune Fields, Kukatpally, Hyderabad, Telangana',
      to: 'Peddapalli Bus Station',
      passengers: 1,
    },
    {
      id: '2',
      from: 'JBS BUS STOP STAND',
      to: 'Yellareddypet',
      passengers: 1,
    },
    {
      id: '3',
      from: 'Block -C, INDU FORTUNE FIELDS, Fortune Fields, Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Telangana',
      to: 'Kamareddy, Telangana',
      passengers: 1,
    },
  ];

  const truncateAddress = (address, maxLength = 35) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };
  const onChangeDate = (event, selectedDate) => {
  setShowPicker(false);
  if (selectedDate) {
    setDate(selectedDate);
    setSelectedDate(selectedDate.toDateString()); // store readable date
  }
};
const handleSearch = () => {
  navigation.navigate('RideResults', {
    from: fromLocation,
    to: toLocation,
    passengers,
    date: date.toISOString(), // important
  });
};

const handleSwap = () => {
  setFromLocation(toLocation);
  setToLocation(fromLocation);
};

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0FF" />

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section with Gradient Background */}
        <View style={styles.heroSection}>
          <View style={styles.wavePattern}>
            <View style={[styles.wave, styles.wave1]} />
            <View style={[styles.wave, styles.wave2]} />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.greeting}>Hello, Sreeja! 👋</Text>
            <Text style={styles.heroTitle}>
              Travel anywhere{'\n'}
              <Text style={styles.heroHighlight}>together. Spend smarter.</Text>
            </Text>
          </View>

          {/* Search Card */}
          <View style={styles.searchCard}>
            {/* From Location */}
            <View style={styles.locationInputContainer}>
              <View style={styles.locationIconWrapper}>
                <View style={styles.fromDot} />
              </View>
              <TextInput
                style={styles.locationInput}
                placeholder="Leaving from"
                placeholderTextColor="#9AA6B8"
                value={fromLocation}
                onChangeText={setFromLocation}
              />
            </View>

            <View style={styles.locationConnector}>
              <View style={styles.connectorLine} />
            </View>

            {/* To Location */}
            <View style={styles.locationInputContainer}>
              <View style={styles.locationIconWrapper}>
                <View style={styles.toDot} />
              </View>
              <TextInput
                style={styles.locationInput}
                placeholder="Going to"
                placeholderTextColor="#9AA6B8"
                value={toLocation}
                onChangeText={setToLocation}
              />
<TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                  <Text style={styles.swapIcon}>⇄</Text>
              </TouchableOpacity>
            </View>

            {/* Date and Passengers Row */}
            <View style={styles.searchOptions}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.dateScroll}
              >
             {dates.map((item) => (
  <TouchableOpacity
    key={item}
    style={[
      styles.dateChip,
      selectedDate === item && styles.dateChipActive,
    ]}
    onPress={() => {
      if (item === 'Today') {
        const today = new Date();
        setDate(today);
        setSelectedDate(today.toDateString());
      } else if (item === 'Tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow);
        setSelectedDate(tomorrow.toDateString());
      } else {
        setShowPicker(true); // open calendar
      }
    }}
  >
    <Text style={[
      styles.dateChipText,
      selectedDate === item && styles.dateChipTextActive,
    ]}>
      {item}
    </Text>
  </TouchableOpacity>
))}

{showPicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onChangeDate}
  />
)}
              </ScrollView>

              <View style={styles.passengerSelector}>
                <TouchableOpacity 
                  style={styles.passengerBtn}
                  onPress={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <Text style={styles.passengerBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.passengerCount}>{passengers}</Text>
                <TouchableOpacity 
                  style={styles.passengerBtn}
                  onPress={() => setPassengers(Math.min(8, passengers + 1))}
                >
                  <Text style={styles.passengerBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search Rides →</Text>
            </TouchableOpacity>
          </View>
        </View>

      

        {/* Recent Searches Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent searches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentSearches.map((search, index) => (
            <TouchableOpacity key={search.id} style={styles.recentCard}>
              <View style={styles.recentHeader}>
                <View style={styles.routeIcons}>
                  <View style={styles.recentFromDot} />
                  <View style={styles.recentLine} />
                  <View style={styles.recentToDot} />
                </View>
                <Text style={styles.passengerInfo}>{search.passengers} passenger</Text>
              </View>

              <View style={styles.routeContainer}>
                <Text style={styles.locationText}>
                  {truncateAddress(search.from)}
                </Text>
                <View style={styles.routeArrow}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
                <Text style={styles.locationText}>
                  {truncateAddress(search.to)}
                </Text>
              </View>

              {index < recentSearches.length - 1 && (
                <View style={styles.recentDivider} />
              )}
            </TouchableOpacity>
          ))}

          {/* Bottom CTA */}
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore More Rides</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F0FF',
    marginTop:50
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  heroSection: {
    backgroundColor: '#7ec0db',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    position: 'relative',
    overflow: 'hidden',
  },
  wavePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  wave1: {
    transform: [{ skewY: '-8deg' }, { translateY: -50 }],
  },
  wave2: {
    transform: [{ skewY: '8deg' }, { translateY: 50 }],
  },
  heroContent: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
  },
  heroHighlight: {
    color: '#FFE77A',
  },
  searchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    shadowColor: '#6B4EFF',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  locationIconWrapper: {
    width: 30,
    alignItems: 'center',
  },
  fromDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B4EFF',
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  toDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FFE5E5',
  },
  locationInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A2332',
    fontWeight: '500',
    paddingVertical: 8,
  },
  locationConnector: {
    paddingLeft: 30,
    height: 20,
  },
  connectorLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#E0E7FF',
    marginLeft: 5,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIcon: {
    fontSize: 18,
    color: '#6B4EFF',
    fontWeight: '700',
  },
  searchOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  dateScroll: {
    flex: 1,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
    marginRight: 10,
  },
  dateChipActive: {
    backgroundColor: '#6B4EFF',
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  dateChipTextActive: {
    color: '#fff',
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    borderRadius: 25,
    padding: 4,
  },
  passengerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  passengerBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B4EFF',
  },
  passengerCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2332',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#6B4EFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  adSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  adCard: {
    backgroundColor: 'linear-gradient(135deg, #1877F2 0%, #0C5B9E 100%)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1877F2',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adIconText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1877F2',
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  adSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  adButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  adButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A2332',
  },
  seeAllText: {
    fontSize: 13,
    color: '#6B4EFF',
    fontWeight: '700',
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentFromDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B4EFF',
  },
  recentLine: {
    width: 20,
    height: 2,
    backgroundColor: '#E0E7FF',
    marginHorizontal: 4,
  },
  recentToDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  passengerInfo: {
    fontSize: 12,
    color: '#8A9BB0',
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  routeArrow: {
    width: 24,
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#6B4EFF',
    fontWeight: '700',
  },
  recentDivider: {
    height: 1,
    backgroundColor: '#F0F4FA',
    marginTop: 12,
  },
  exploreButton: {
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderStyle: 'dashed',
  },
  exploreButtonText: {
    color: '#6B4EFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default BookRide;