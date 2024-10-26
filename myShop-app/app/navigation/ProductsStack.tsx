import React from "react";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import ProductDetails from "../screens/ProductDetails";
import Products from "../screens/Products";
import CartModal from "../screens/CartModal";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Profile from "../screens/Profile";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCartStore from "@/state/cartStore";
import { Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: { id: number };
  CartModal: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
};

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

const CartButton = () => {
  const navigation = useNavigation<NavigationProp<ProductsStackParamList>>();
  const { products } = useCartStore((state) => ({
    products: state.products,
  }));
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const count = products.reduce(
      (prev, product) => prev + product.quantity,
      0
    );
    setCount(count);
  }, [products]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate("CartModal")}>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      <Ionicons name="cart" size={28} color="#000" />
    </TouchableOpacity>
  );
};

const ProfileButton = () => {
  const navigation = useNavigation<NavigationProp<ProductsStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Profile")}
      style={styles.profileButton}
    >
      <Ionicons name="person" size={28} color="#000" />
    </TouchableOpacity>
  );
};

const ProductsStackNav = ({ user }) => {
  return (
    <ProductsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1FE687",
        },
        headerTintColor: "#141414",
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <CartButton />
            <ProfileButton />
          </View>
        ),
      }}
    >
      {!user ? (
        <>
          <ProductsStack.Screen
            name="Login"
            component={Login}
            options={{ headerTitle: "Login" }}
          />
          <ProductsStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerTitle: "Sign Up" }}
          />
        </>
      ) : (
        <>
          <ProductsStack.Screen
            name="Products"
            component={Products}
            options={{ headerTitle: "Rentfiy" }}
          />
          <ProductsStack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{ headerTitle: "" }}
          />
          <ProductsStack.Screen
            name="CartModal"
            component={CartModal}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <ProductsStack.Screen
            name="Profile"
            component={Profile}
            options={{ headerTitle: "Profile" }}
          />
        </>
      )}
    </ProductsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  countContainer: {
    position: "absolute",
    zIndex: 1,
    bottom: -5,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    marginLeft: 20,
  },
});
export type ProductsPageProps = NativeStackScreenProps<
  ProductsStackParamList,
  "Products"
>;
export type ProductDetailsPageProps = NativeStackScreenProps<
  ProductsStackParamList,
  "ProductDetails"
>;

export default ProductsStackNav;
