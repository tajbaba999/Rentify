import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ProductsStackNav from "./app/navigation/ProductsStack";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [user, setUser] = useState<User| null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1FE687" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ProductsStackNav user={user} />
    </NavigationContainer>
  );
}
