import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import useCartStore from "@/state/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { Order, createOrder } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const CartScreen = () => {
  const { products, total, reduceProduct, addProduct, clearCart } =
    useCartStore((state) => ({
      products: state.products,
      total: state.total,
      reduceProduct: state.reduceProduct,
      addProduct: state.addProduct,
      clearCart: state.clearCart,
    }));

  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  //house fields
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();

  const onSubmitOrder = async () => {
    setSubmitting(true);
    Keyboard.dismiss();
    try {
      const formattedStartDate = startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : null;
      const formattedEndDate = endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : null;

      const orderData: any = {
        email,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        productIdsArray: products.map((product) => product.id),
        orderTotal: total,
        house_number: houseNumber,
        city,
        state,
        country,
        pincode,
      };
      console.log(orderData);

      const response = await createOrder(orderData);

      setOrder(response);
      console.log("Order Created:", response);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {order && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fallSpeed={2500}
          fadeOut={false}
          autoStart={true}
        />
      )}
      {order && (
        <View style={styles.orderConfirmation}>
          <Text style={styles.orderConfirmationText}>Order submitted!</Text>
          <Text style={styles.orderIdText}>Order ID: {order.id}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
      {!order && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={65}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.cartTitle}>Your Cart</Text>
            {products.length === 0 && (
              <Text style={{ textAlign: "center" }}>Your cart is empty!</Text>
            )}
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItemContainer}>
                  <Image
                    style={styles.cartItemImage}
                    source={{ uri: item.product_image }}
                  />
                  <View style={styles.itemContainer}>
                    <Text style={styles.cartItemName}>{item.product_name}</Text>
                    <Text>Price: ${item.product_price}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => reduceProduct(item)}
                      style={{ padding: 10 }}
                    >
                      <Ionicons name="remove" size={20} color={"#000"} />
                    </TouchableOpacity>
                    <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => addProduct(item)}
                      style={{ padding: 10 }}
                    >
                      <Ionicons name="add" size={20} color={"#000"} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListFooterComponent={
                <View style={styles.footer}>
                  <Text style={styles.totalText}>
                    Total: ${total.toFixed(2)}
                  </Text>
                  {/* Address Fields */}
                  <TextInput
                    style={styles.input}
                    placeholder="House Number"
                    onChangeText={setHouseNumber}
                    value={houseNumber}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    onChangeText={setCity}
                    value={city}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    onChangeText={setState}
                    value={state}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Country"
                    onChangeText={setCountry}
                    value={country}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Pincode"
                    keyboardType="numeric"
                    onChangeText={setPincode}
                    value={pincode}
                  />
                  {/* Date Pickers */}
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateButtonText}>
                      {startDate
                        ? `Start: ${startDate.toLocaleDateString()}`
                        : "Select Start Date"}
                    </Text>
                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) setStartDate(selectedDate);
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateButtonText}>
                      {endDate
                        ? `End: ${endDate.toLocaleDateString()}`
                        : "Select End Date"}
                    </Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) setEndDate(selectedDate);
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Enter your email"
                    onChangeText={setEmail}
                    value={email}
                  />
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      email === "" ? styles.inactive : null,
                    ]}
                    onPress={onSubmitOrder}
                    disabled={email === "" || submitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {submitting ? "Creating Order..." : "Submit Order"}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  cartTitle: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1FE687",
  },
  cartItemContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
  },
  cartItemQuantity: {
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#1FE687",
    padding: 5,
    width: 30,
    color: "#fff",
    textAlign: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  emailInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  inactive: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#1FE687",
    fontSize: 16,
    fontWeight: "bold",
  },
  orderConfirmation: {
    marginTop: "50%",
    padding: 20,
    backgroundColor: "#000",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  orderConfirmationText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
  orderIdText: {
    color: "#fff",
    fontSize: 16,
    margin: 20,
  },
  continueButton: {
    backgroundColor: "#1FE687",
    padding: 10,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 20,
  },
});

export default CartScreen;
