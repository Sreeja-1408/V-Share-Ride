// NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'profile',
      title: 'Get a Verified Profile',
      message: 'Sreeja, you\'re only missing three steps from having a Verified Profile.',
      subMessage: 'So close to saving money, Sreeja 😊😊',
      action: 'Finish publishing your ride',
      time: '2 hours ago',
      read: false,
      icon: '✨',
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Complete your ride posting',
      message: 'Your ride draft is waiting!',
      subMessage: 'Publish now to find passengers',
      action: 'Continue',
      time: '1 day ago',
      read: true,
      icon: '🚗',
    },
    {
      id: '3',
      type: 'promo',
      title: 'Special offer for you',
      message: 'Get 20% off on your next ride',
      subMessage: 'Limited time offer',
      action: 'Claim now',
      time: '3 days ago',
      read: true,
      icon: '🎉',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getTimeColor = (time) => {
    if (time.includes('hour')) return '#FF6B6B';
    return '#8A9BB0';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notifications.filter(n => !n.read).length}
            </Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Today's Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          {notifications
            .filter(n => n.time.includes('hour'))
            .map(notif => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notificationCard,
                  !notif.read && styles.unreadCard,
                ]}
                onPress={() => markAsRead(notif.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: !notif.read ? '#003580' : '#E8EEF8' }
                  ]}>
                    <Text style={styles.iconText}>{notif.icon}</Text>
                  </View>
                  <View style={styles.timelineDot}>
                    <View style={[
                      styles.dot,
                      { backgroundColor: getTimeColor(notif.time) }
                    ]} />
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={[
                      styles.cardTitle,
                      !notif.read && styles.unreadTitle
                    ]}>
                      {notif.title}
                    </Text>
                    <Text style={[
                      styles.timeText,
                      { color: getTimeColor(notif.time) }
                    ]}>
                      {notif.time}
                    </Text>
                  </View>
                  
                  <Text style={styles.cardMessage}>{notif.message}</Text>
                  <Text style={styles.cardSubMessage}>{notif.subMessage}</Text>
                  
                  <TouchableOpacity 
                    style={[
                      styles.actionButton,
                      !notif.read && styles.unreadAction
                    ]}
                  >
                    <Text style={[
                      styles.actionText,
                      !notif.read && styles.unreadActionText
                    ]}>
                      {notif.action} →
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {!notif.read && <View style={styles.unreadBadge} />}
              </TouchableOpacity>
            ))}
        </View>

        {/* Earlier Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EARLIER</Text>
          {notifications
            .filter(n => !n.time.includes('hour'))
            .map(notif => (
              <TouchableOpacity
                key={notif.id}
                style={styles.notificationCard}
                onPress={() => markAsRead(notif.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconContainer, styles.readIcon]}>
                    <Text style={styles.iconText}>{notif.icon}</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{notif.title}</Text>
                    <Text style={[styles.timeText, styles.readTime]}>
                      {notif.time}
                    </Text>
                  </View>
                  
                  <Text style={styles.cardMessage}>{notif.message}</Text>
                  <Text style={styles.cardSubMessage}>{notif.subMessage}</Text>
                  
                  <TouchableOpacity style={styles.readActionButton}>
                    <Text style={styles.readActionText}>{notif.action} →</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
    backgroundColor: '#F8F9FF',
    marginTop: 50,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#003580',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#003580',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 22,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FF',
    borderRadius: 20,
    padding: 16,
    marginTop: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#003580',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8A9BB0',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E7FF',
    marginHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A9BB0',
    marginBottom: 15,
    letterSpacing: 1,
    marginLeft: 5,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#00358020',
  },
  cardLeft: {
    marginRight: 15,
    position: 'relative',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  readIcon: {
    backgroundColor: '#F0F4FA',
  },
  timelineDot: {
    position: 'absolute',
    bottom: -8,
    left: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2332',
    flex: 1,
  },
  unreadTitle: {
    color: '#003580',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 10,
  },
  readTime: {
    color: '#8A9BB0',
  },
  cardMessage: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubMessage: {
    fontSize: 13,
    color: '#8A9BB0',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#003580',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unreadAction: {
    backgroundColor: '#003580',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  unreadActionText: {
    color: '#fff',
  },
  readActionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readActionText: {
    color: '#003580',
    fontSize: 12,
    fontWeight: '700',
  },
  unreadBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default NotificationsScreen;