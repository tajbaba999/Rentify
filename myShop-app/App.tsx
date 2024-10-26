import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ProductsStackNav from "./app/navigation/ProductsStack";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebaseConfig";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

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
