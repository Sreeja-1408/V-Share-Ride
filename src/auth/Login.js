import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Login = ({ navigation }) => {
  const [emailMobile, setEmailMobile] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Validation
  const validate = () => {
    if (!emailMobile.trim()) {
      return "Please enter email or mobile number";
    }

    // email OR mobile validation
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(emailMobile) && !mobileRegex.test(emailMobile)) {
      return "Enter valid email or 10-digit mobile number";
    }

    if (!password) {
      return "Please enter password";
    }

    if (password.length < 4) {
      return "Password must be at least 4 characters";
    }

    return "";
  };

  const handleLogin = () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        {/* INPUT */}
        <TextInput
          placeholder="Email or Mobile"
          style={styles.input}
          value={emailMobile}
          onChangeText={(text) => {
            setEmailMobile(text);
            setError("");
          }}
        />

        {/* PASSWORD */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={secureText}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
          />

          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons
              name={secureText ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* ERROR */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            (!emailMobile || !password) && { opacity: 0.6 },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* SIGNUP */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>
            Don’t have an account? <Text style={{ fontWeight: "bold" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },

  button: {
    backgroundColor: "#6B4EFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
  },

  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
  },
});