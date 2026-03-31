import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const EditPersonalDetails = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [riderVerified, setRiderVerified] = useState(false);

  // User Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Car Details
  const [carName, setCarName] = useState("");
  const [carColor, setCarColor] = useState("");
  const [carPlate, setCarPlate] = useState("");
  
  // Documents
  const [drivingLicense, setDrivingLicense] = useState(null);
  const [rcDocument, setRcDocument] = useState(null);

  // Ride Preferences
  const [petsAllowed, setPetsAllowed] = useState("no");
  const [musicAllowed, setMusicAllowed] = useState("yes");
  const [luggageSize, setLuggageSize] = useState("medium");
  const [smokingAllowed, setSmokingAllowed] = useState("no");

  useEffect(() => {
    let timer;
    if (showVerification && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showVerification, countdown]);

  const pickDocument = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission needed", "Please grant gallery access to upload documents");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'license') {
        setDrivingLicense(result.assets[0]);
      } else {
        setRcDocument(result.assets[0]);
      }
    }
  };

  const handleSendVerification = () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    setShowVerification(true);
    setCountdown(60);
    setCanResend(false);
    Alert.alert("Success", `Verification code sent to ${email}`);
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (verificationCode === "123456") {
        setVerified(true);
        setShowVerification(false);
        Alert.alert("Success", "Email verified successfully!");
      } else {
        Alert.alert("Error", "Invalid verification code");
      }
    }, 1000);
  };

  const handleSave = () => {
    // Validations
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!verified) {
      Alert.alert("Error", "Please verify your email first");
      return;
    }
    if (!carName || !carColor || !carPlate) {
      Alert.alert("Error", "Please fill all car details");
      return;
    }
    if (!drivingLicense || !rcDocument) {
      Alert.alert("Error", "Please upload both Driving License and RC");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRiderVerified(true);
      Alert.alert(
        "Success!",
        "Your profile is verified! You can now post rides.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.radioOption} onPress={onPress}>
      <View style={[styles.radioCircle, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const DocumentUpload = ({ title, icon, onPress, file }) => (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
      <Text style={styles.uploadIcon}>{icon}</Text>
      <View style={styles.uploadTextContainer}>
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadSubtitle}>
          {file ? "✓ Uploaded" : "Tap to upload (JPG/PNG)"}
        </Text>
      </View>
      {file && <Text style={styles.uploadCheck}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
       

        {/* Personal Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Personal Info</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.emailContainer}>
            <TextInput
              style={[styles.input, styles.emailInput]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              editable={!verified}
            />
            {!verified ? (
              <TouchableOpacity style={styles.verifyBtn} onPress={handleSendVerification}>
                <Text style={styles.verifyBtnText}>Verify</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.verifiedChip}>
                <Text style={styles.verifiedChipText}>✓ Verified</Text>
              </View>
            )}
          </View>

          {showVerification && (
            <View style={styles.verifyBox}>
              <TextInput
                style={styles.codeInput}
                placeholder="6-digit code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <View style={styles.verifyActions}>
                <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
                  <Text style={[styles.resendText, !canResend && styles.disabled]}>
                    Resend {!canResend && `(${countdown}s)`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitVerify} onPress={handleVerifyCode}>
                  <Text style={styles.submitVerifyText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Car Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚗 Car Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Car Name (e.g., Honda City)"
            value={carName}
            onChangeText={setCarName}
          />
          <TextInput
            style={styles.input}
            placeholder="Car Color"
            value={carColor}
            onChangeText={setCarColor}
          />
          <TextInput
            style={styles.input}
            placeholder="License Plate Number"
            value={carPlate}
            onChangeText={setCarPlate}
            autoCapitalize="characters"
          />
        </View>

        {/* Documents - Mandatory */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📄 Documents (Mandatory)</Text>
          <DocumentUpload 
            title="Driving License"
            icon="🪪"
            onPress={() => pickDocument('license')}
            file={drivingLicense}
          />
          <DocumentUpload 
            title="RC Certificate"
            icon="📑"
            onPress={() => pickDocument('rc')}
            file={rcDocument}
          />
        </View>

        {/* Ride Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Ride Preferences</Text>
          
          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>🐶 Pets</Text>
            <View style={styles.radioGroup}>
              <RadioButton label="Yes" selected={petsAllowed==="yes"} onPress={() => setPetsAllowed("yes")} />
              <RadioButton label="No" selected={petsAllowed==="no"} onPress={() => setPetsAllowed("no")} />
            </View>
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>🎵 Music</Text>
            <View style={styles.radioGroup}>
              <RadioButton label="Yes" selected={musicAllowed==="yes"} onPress={() => setMusicAllowed("yes")} />
              <RadioButton label="No" selected={musicAllowed==="no"} onPress={() => setMusicAllowed("no")} />
            </View>
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>🛄 Luggage</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity 
                style={[styles.optionBtn, luggageSize==="heavy" && styles.optionSelected]}
                onPress={() => setLuggageSize("heavy")}
              >
                <Text style={styles.optionIcon}>📦</Text>
                <Text style={[styles.optionText, luggageSize==="heavy" && styles.optionTextSelected]}>Heavy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionBtn, luggageSize==="medium" && styles.optionSelected]}
                onPress={() => setLuggageSize("medium")}
              >
                <Text style={styles.optionIcon}>💼</Text>
                <Text style={[styles.optionText, luggageSize==="medium" && styles.optionTextSelected]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionBtn, luggageSize==="small" && styles.optionSelected]}
                onPress={() => setLuggageSize("small")}
              >
                <Text style={styles.optionIcon}>🎒</Text>
                <Text style={[styles.optionText, luggageSize==="small" && styles.optionTextSelected]}>1 Bag</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>🚭 Smoking</Text>
            <View style={styles.radioGroup}>
              <RadioButton label="Yes" selected={smokingAllowed==="yes"} onPress={() => setSmokingAllowed("yes")} />
              <RadioButton label="No" selected={smokingAllowed==="no"} onPress={() => setSmokingAllowed("no")} />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>✓ Verify & Save</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          * Driving License and RC are mandatory for verification
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  backIcon: {
    fontSize: 24,
    color: "#6B4EFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2332",
  },
  verifiedBadge: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2332",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F8FAFD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#EFF3F8",
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
  },
  emailContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
  },
  verifyBtn: {
    backgroundColor: "#6B4EFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  verifiedChip: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  verifiedChipText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "600",
  },
  verifyBox: {
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  codeInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 10,
  },
  verifyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resendText: {
    color: "#6B4EFF",
    fontSize: 13,
    fontWeight: "600",
  },
  disabled: {
    color: "#C5CDD8",
  },
  submitVerify: {
    backgroundColor: "#6B4EFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  submitVerifyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFF3F8",
    borderStyle: "dashed",
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2332",
  },
  uploadSubtitle: {
    fontSize: 11,
    color: "#8A9BB0",
    marginTop: 2,
  },
  uploadCheck: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "700",
  },
  prefItem: {
    marginBottom: 16,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2332",
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#C5CDD8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#6B4EFF",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6B4EFF",
  },
  radioLabel: {
    fontSize: 13,
    color: "#4A5568",
  },
  optionGroup: {
    flexDirection: "row",
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: "#F8FAFD",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFF3F8",
  },
  optionSelected: {
    backgroundColor: "#6B4EFF",
    borderColor: "#6B4EFF",
  },
  optionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  optionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8A9BB0",
  },
  optionTextSelected: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#6B4EFF",
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
  },
  saveBtnDisabled: {
    backgroundColor: "#C5CDD8",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  note: {
    fontSize: 11,
    color: "#8A9BB0",
    textAlign: "center",
    margin: 16,
    marginTop: 8,
  },
});

export default EditPersonalDetails;