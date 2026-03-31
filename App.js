import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./src/Tabs/BottomTabs";
import Login from "./src/auth/Login";
import RideResults from "./src/Pages/RideResults";
import RideDetails from "./src/Pages/RideDetails";
import ReviewsScreen from "./src/Pages/ReviewsScreen";
import EditPersonalDetails from "./src/Pages/Profile Details/EditPersonalDetails";
import Ratings from "./src/Pages/Profile Details/Account Settings/Ratings";
import Preferences from "./src/Pages/Profile Details/Account Settings/Preferences";
import PasswordAndSavedAddress from "./src/Pages/Profile Details/Account Settings/PasswordAndSavedAddress";
import PaymentsScreen from "./src/Pages/Profile Details/Account Settings/PaymentsScreen";
import Help from "./src/Pages/Profile Details/Account Settings/Help";
import TermsAndConditions from "./src/Pages/Profile Details/Account Settings/TermsAndConditions";
import DataProtection from "./src/Pages/Profile Details/Account Settings/DataProtection";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="RideResults" 
            component={RideResults} 
            options={{ headerShown: true }} />
        <Stack.Screen 
            name="RideDetails" 
            component={RideDetails} 
            title="Ride Details" 
            options={{ headerShown: true }} />
        <Stack.Screen 
            name="ReviewsScreen" 
            component={ReviewsScreen} 
            title="Reviews" 
            options={{ headerShown: true }} />
        <Stack.Screen 
            name="Personal Details"  
            options={{ headerShown: true }}
            component={EditPersonalDetails} /> 
<Stack.Screen name="All Ratings"
      options={{ headerShown: true }}
            component={Ratings} /> 
            <Stack.Screen name="Preferences"
      options={{ headerShown: true }}
            component={Preferences} /> 
              <Stack.Screen name="Account Settings"
      options={{ headerShown: true }}
            component={PasswordAndSavedAddress} /> 
             <Stack.Screen name="Payments"
      options={{ headerShown: true }}
            component={PaymentsScreen} /> 
             <Stack.Screen name="Help"
      options={{ headerShown: true }}
            component={Help} /> 
             <Stack.Screen name="Terms And Conditions"
      options={{ headerShown: true }}
            component={TermsAndConditions} /> 
             <Stack.Screen name="Data Protection"
      options={{ headerShown: true }}
            component={DataProtection} /> 





      </Stack.Navigator>
    </NavigationContainer>
  );
}