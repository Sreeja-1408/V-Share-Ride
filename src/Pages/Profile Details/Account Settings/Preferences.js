import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";

const Preferences = () => {
  const [settings, setSettings] = useState({
    push_booking: true,
    push_messages: true,
    push_marketing: false,

    email_messages: true,
    email_updates: true,
    email_surveys: false,
    email_marketing: true,

    sms_booking: true,
    sms_cancel: true,
    sms_alerts: true,

    call_updates: true,
    call_marketing: false,
  });

  const toggleSwitch = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );

  const Item = ({ label, desc, value, onToggle }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* PUSH */}
      <Section title="Push Notifications">
        <Item
          label="Booking Updates"
          desc="Bookings, cancellations, payments"
          value={settings.push_booking}
          onToggle={() => toggleSwitch("push_booking")}
        />
        <Item
          label="Messages"
          desc="Messages from passengers/drivers"
          value={settings.push_messages}
          onToggle={() => toggleSwitch("push_messages")}
        />
        <Item
          label="Promotions"
          desc="Offers & discounts"
          value={settings.push_marketing}
          onToggle={() => toggleSwitch("push_marketing")}
        />
      </Section>

      {/* EMAIL */}
      <Section title="Emails">
        <Item
          label="Messages"
          value={settings.email_messages}
          onToggle={() => toggleSwitch("email_messages")}
        />
        <Item
          label="App Updates"
          value={settings.email_updates}
          onToggle={() => toggleSwitch("email_updates")}
        />
        {/* <Item
          label="Surveys"
          value={settings.email_surveys}
          onToggle={() => toggleSwitch("email_surveys")}
        />
        <Item
          label="Promotions"
          value={settings.email_marketing}
          onToggle={() => toggleSwitch("email_marketing")}
        /> */}
      </Section>

      {/* SMS */}
      <Section title="Text Messages (SMS)">
        <Item
          label="Booking Reminders"
          value={settings.sms_booking}
          onToggle={() => toggleSwitch("sms_booking")}
        />
        <Item
          label="Cancellation Alerts"
          value={settings.sms_cancel}
          onToggle={() => toggleSwitch("sms_cancel")}
        />
       
      </Section>

      {/* CALLS */}
      <Section title="Phone Calls">
        <Item
          label="Ride Updates"
          value={settings.call_updates}
          onToggle={() => toggleSwitch("call_updates")}
        />
        <Item
          label="Call after booking confirmation"
          value={settings.call_marketing}
          onToggle={() => toggleSwitch("call_marketing")}
        />
      </Section>
    </ScrollView>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 15,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  desc: {
    fontSize: 12,
    color: "#666",
  },
});