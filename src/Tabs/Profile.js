import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

// ─── Micro Components ─────────────────────────────────────
const ChevronRight = () => <Text style={styles.chevron}>›</Text>;
const CheckCircle = () => <Text style={styles.checkIcon}>✓</Text>;
const PlusCircle = () => <Text style={styles.plusIcon}>⊕</Text>;


// ─── About You Tab ─────────────────────────────────────
const AboutYouScreen = () => {
  const navigation=useNavigation();
  return (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>

    <View style={styles.profileCard} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Sreeja</Text>
        <Text style={styles.profileBadge}>Newcomer</Text>
      </View>

      {/* <ChevronRight /> */}
    </View>

    <TouchableOpacity
      style={styles.linkRow}
      onPress={() => navigation.navigate("Personal Details")}
    >
      <Text style={styles.linkText}>Edit personal details</Text>
    </TouchableOpacity>

    <View style={styles.divider} />

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Verify your profile</Text>

      <TouchableOpacity style={styles.verifyRow}>
        <PlusCircle />
        <Text style={styles.verifyText}>Verify your Govt. ID</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyRow}>
        <PlusCircle />
        <Text style={styles.verifyText}>Confirm email sreeja1425@gmail.com</Text>
      </TouchableOpacity>

      <View style={styles.verifyRow}>
        <View style={styles.verifiedBadge}>
          <CheckCircle />
        </View>
        <Text style={styles.verifiedText}>+918341189900</Text>
      </View>
    </View>

    <View style={styles.divider} />

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your carpooling reliability</Text>
      <View style={styles.reliabilityRow}>
        <Text style={styles.reliabilityIcon}>📅</Text>
        <Text style={styles.reliabilityText}>
          Rarely cancels bookings as a passenger
        </Text>
      </View>
    </View>

    <View style={styles.divider} />

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About you</Text>

      <TouchableOpacity style={styles.verifyRow}>
        <PlusCircle />
        <Text style={styles.verifyText}>Add a mini bio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyRow}>
        <PlusCircle />
        <Text style={styles.verifyText}>Edit travel preferences</Text>
      </TouchableOpacity>
    </View>

    <View style={{ height: 32 }} />
  </ScrollView>
)};


// ─── Account Tab ─────────────────────────────────────
const accountSections = [
  [
    { label: 'Ratings' },
    // { label: 'Saved passengers' },
    { label: 'Preferences' },
  ],
  [{ label: 'Password & Saved Address' }],
  [
    { label: 'Payments' },
    // { label: 'Payouts' },
    // { label: 'Payment methods' },
    // { label: 'Payments & refunds' },
  ],
  [
    { label: 'Help' },
    { label: 'Terms and Conditions' },
    { label: 'Data protection' },
  ],
  [
    { label: 'Log out', danger: true },
    { label: 'Close my account', danger: true },
  ],
];

const AccountScreen = () => {
  const navigation = useNavigation();
  return(
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    {accountSections.map((section, si) => (
      <View key={si}>
        {section.map((item, ii) => (
          <TouchableOpacity
  key={ii}
  style={styles.accountRow}
  onPress={() => {
    if (item.label === "Log out") {
      alert("Logged out");
    } else if (item.label === "Close my account") {
      alert("Account closed");
    } else {
      navigation.navigate(screenMap[item.label]);
    }
  }}
>
            <Text style={[styles.accountLabel, item.danger && styles.dangerLabel]}>
              {item.label}
            </Text>
            {!item.danger && <ChevronRight />}
          </TouchableOpacity>
        ))}

        {si < accountSections.length - 1 && <View style={styles.sectionDivider} />}
      </View>
    ))}

    <View style={{ height: 32 }} />
  </ScrollView>
  )
};

const screenMap = {
  "Ratings": "All Ratings",
  // "Saved passengers": "SavedPassengersScreen",
  "Preferences": "Preferences",
  "Password & Saved Address": "Account Settings",
  // "Postal address": "AddressScreen",
  "Payments": "Payments",
  // "Payouts": "PayoutsScreen",
  // "Payment methods": "PaymentMethodsScreen",
  // "Payments & refunds": "PaymentsScreen",
  "Help": "Help",
  "Terms and Conditions": "Terms And Conditions",
  "Data protection": "Data Protection",
};

// ─── Main Profile Screen ─────────────────────────────────────
const Profile = () => {

  const [activeTab, setActiveTab] = useState('about');
  const indicatorAnim = useRef(new Animated.Value(0)).current;


  const handleTabPress = (tab) => {
    setActiveTab(tab);

    Animated.spring(indicatorAnim, {
      toValue: tab === 'about' ? 0 : 1,
      useNativeDriver: false,
      tension: 80,
      friction: 12,
    }).start();
  };

  const indicatorLeft = indicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Top Tabs */}
      <View style={styles.topTabBar}>

        <TouchableOpacity
          style={styles.topTab}
          onPress={() => handleTabPress('about')}
        >
          <Text style={[
            styles.topTabLabel,
            activeTab === 'about' && styles.topTabLabelActive
          ]}>
            About you
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topTab}
          onPress={() => handleTabPress('account')}
        >
          <Text style={[
            styles.topTabLabel,
            activeTab === 'account' && styles.topTabLabelActive
          ]}>
            Account
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />

      </View>

      {activeTab === 'about'
        ? <AboutYouScreen  />
        : <AccountScreen />
      }

    </SafeAreaView>
  );
};

export default Profile;


// ─── Styles ─────────────────────────────────────
const BLUE = '#003580';
const ACCENT = '#0070F3';
const LIGHT_BG = '#F5F7FA';
const BORDER = '#E8ECF0';

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop:50
  },

  topTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    position: 'relative',
  },

  topTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },

  topTabLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9AA5B4',
  },

  topTabLabelActive: {
    color: BLUE,
    fontWeight: '700',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 2.5,
    backgroundColor: BLUE,
  },

  tabContent: {
    flex: 1,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8ECF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  avatarIcon: {
    fontSize: 28,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: BLUE,
  },

  profileBadge: {
    fontSize: 13,
    color: '#9AA5B4',
  },

  chevron: {
    fontSize: 24,
    color: '#C5CDD8',
  },

  linkRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  linkText: {
    color: ACCENT,
    fontWeight: '600',
  },

  divider: {
    height: 8,
    backgroundColor: LIGHT_BG,
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BLUE,
    marginBottom: 12,
  },

  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  plusIcon: {
    fontSize: 22,
    marginRight: 12,
    color: ACCENT,
  },

  verifyText: {
    color: ACCENT,
    fontWeight: '600',
  },

  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  checkIcon: {
    color: '#fff',
  },

  verifiedText: {
    color: '#4A5568',
  },

  reliabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reliabilityIcon: {
    marginRight: 10,
  },

  reliabilityText: {
    color: '#4A5568',
  },

  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  accountLabel: {
    fontSize: 15,
    fontWeight: '600',
  },

  dangerLabel: {
    color: ACCENT,
  },

  sectionDivider: {
    height: 8,
    backgroundColor: LIGHT_BG,
  },

});