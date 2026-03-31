import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import SearchScreen from "./BookRide";
import RideScreen from "./PostRide";
import NotificationsScreen from "./Notifications";
import MyRidesScreen from "./MyRides";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        
        headerTintColor: "#1E88E5",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#212121",
        },
        tabBarActiveTintColor: "#1E88E5",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          height: 70,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          backgroundColor: "#FFFFFF",
          paddingBottom: 5,
          paddingTop: 5,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "400",
        },
      }}
    >

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Ride"
        component={RideScreen}
        options={{
          title: "Rides",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "car" : "car-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyRides"
        component={MyRidesScreen}
        options={{
          title: "My Rides",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
}