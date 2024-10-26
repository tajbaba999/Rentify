import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import auth from "../../firebaseConfig";
import AppTextInput from "../components/AppTextInput"; // Custom input component
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Products");
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Products");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      <AppTextInput placeholder="Email" value={email} onChangeText={setEmail} />

      <AppTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing * 2,
  },
  title: {
    fontSize: FontSize.xLarge,
    fontFamily: Font["poppins-bold"],
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Spacing * 3,
    fontWeight: "bold",
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.small,
    textAlign: "center",
    marginBottom: Spacing,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing * 2,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: Spacing },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
    marginVertical: Spacing,
  },
  buttonText: {
    color: Colors.onPrimary,
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.large,
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: Colors.secondary,
  },
});

export default Login;
