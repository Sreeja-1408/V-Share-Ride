import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

const PasswordAndSavedAddress = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  // Address
  const [address, setAddress] = useState({
    full: "",
    pincode: "",
    state: "",
    city: "",
  });

  const [savedAddress, setSavedAddress] = useState(null);

  // Toggle section
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Save password
  const handlePasswordSave = () => {
    if (newPassword !== rePassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password Updated Successfully");
    setOldPassword("");
    setNewPassword("");
    setRePassword("");
  };

  // Save address
  const handleAddressSave = () => {
    setSavedAddress(address);
    setAddress({
      full: "",
      pincode: "",
      state: "",
      city: "",
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* PASSWORD SECTION */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => toggleSection("password")}
      >
        <Text style={styles.headerText}>🔒 Change Password</Text>
      </TouchableOpacity>

      {activeSection === "password" && (
        <View style={styles.card}>
          <TextInput
            placeholder="Old Password"
            secureTextEntry
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Re-enter Password"
            secureTextEntry
            style={styles.input}
            value={rePassword}
            onChangeText={setRePassword}
          />

          <TouchableOpacity style={styles.btn} onPress={handlePasswordSave}>
            <Text style={styles.btnText}>Save Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ADDRESS SECTION */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => toggleSection("address")}
      >
        <Text style={styles.headerText}>📍 Postal Address</Text>
      </TouchableOpacity>

      {activeSection === "address" && (
        <View style={styles.card}>
          {/* SHOW SAVED ADDRESS */}
          {savedAddress && (
            <View style={styles.savedBox}>
              <Text style={styles.savedTitle}>Saved Address:</Text>
              <Text>{savedAddress.full}</Text>
              <Text>
                {savedAddress.city}, {savedAddress.state} -{" "}
                {savedAddress.pincode}
              </Text>
            </View>
          )}

          {/* ADD NEW ADDRESS */}
          <Text style={styles.sectionTitle}>Add Address</Text>

          <TextInput
            placeholder="Full Address"
            style={styles.input}
            value={address.full}
            onChangeText={(text) =>
              setAddress({ ...address, full: text })
            }
          />
          <TextInput
            placeholder="Pincode"
            keyboardType="numeric"
            style={styles.input}
            value={address.pincode}
            onChangeText={(text) =>
              setAddress({ ...address, pincode: text })
            }
          />
          <TextInput
            placeholder="State"
            style={styles.input}
            value={address.state}
            onChangeText={(text) =>
              setAddress({ ...address, state: text })
            }
          />
          <TextInput
            placeholder="City"
            style={styles.input}
            value={address.city}
            onChangeText={(text) =>
              setAddress({ ...address, city: text })
            }
          />

          <TouchableOpacity style={styles.btn} onPress={handleAddressSave}>
            <Text style={styles.btnText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default PasswordAndSavedAddress;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 15,
  },

  header: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: "#6B4EFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  savedBox: {
    backgroundColor: "#E8F0FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  savedTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});