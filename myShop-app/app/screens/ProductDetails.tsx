// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { fetchProductDetails } from "@/api/api";
// import useCartStore from "../state/cartStore";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// const ProductDetails = ({ route }) => {
//   const { id } = route.params;
//   const [product, setProduct] = useState(null);
//   // const [count, setCount] = useState(0);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(null);
//   const [isStartDatePickerVisible, setStartDatePickerVisibility] =
//     useState(false);
//   const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const { products, addProduct, reduceProduct } = useCartStore((state) => ({
//     products: state.products,
//     addProduct: state.addProduct,
//     reduceProduct: state.reduceProduct,
//   }));
  
//   // Remove useState for count
//   const productInCart = products.find((item) => item.id === id);
//   const count = productInCart ? productInCart.quantity : 0;

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   useEffect(() => {
//     updateProductQuantity();
//   }, [products]);

//   const fetchProduct = async () => {
//     setLoading(true);
//     try {
//       const productData = await fetchProductDetails(id);
//       setProduct(productData);
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const updateProductQuantity = () => {
//   //   const result = products.filter((product) => product.id === id);
//   //   if (result.length > 0) {
//   //     setCount(result[0].quantity);
//   //   } else {
//   //     setCount(0);
//   //   }
//   // };

//   const showStartDatePicker = () => {
//     setStartDatePickerVisibility(true);
//   };

//   const hideStartDatePicker = () => {
//     setStartDatePickerVisibility(false);
//   };

//   const handleStartConfirm = (date) => {
//     setStartDate(date);
//     // console.log("A start date is picked", startDate);
//     hideStartDatePicker(); // Hide the date picker
//   };

//   const showEndDatePicker = () => {
//     setEndDatePickerVisibility(true);
//   };

//   const hideEndDatePicker = () => {
//     setEndDatePickerVisibility(false);
//   };

//   const handleEndConfirm = (date) => {
//     setEndDate(date);
//     // console.log("A end date is picked", startDate);
//     hideEndDatePicker(); // Hide the date picker
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         {loading ? (
//           <View style={styles.containerloading}>
//             <ActivityIndicator size={"large"} color={"#1FE687"} />
//           </View>
//         ) : (
//           product && (
//             <>
//               <Image
//                 style={styles.productImage}
//                 source={{ uri: product.product_image }}
//               />
//               <Text style={styles.productName}>{product.product_name}</Text>
//               <Text style={styles.productCategory}>
//                 {product.product_category}
//               </Text>
//               <Text style={styles.productDescription}>
//                 {product.product_description}
//               </Text>
//               <Text style={styles.productPrice}>
//                 Price: ${product.product_price}
//               </Text>

//               {/* Quantity Control */}
//               <View style={styles.buttonsContainer}>
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => reduceProduct(product) }
//                 >
//                   <Ionicons name="remove" size={24} color={"#1FE687"} />
//                 </TouchableOpacity>
//                 <Text style={styles.quantity}>{count}</Text>
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => addProduct(product)}
//                 >
//                   <Ionicons name="add" size={24} />
//                 </TouchableOpacity>
//               </View>

//               {/* Start Date Selection */}
//               {/* <TouchableOpacity
//                 style={styles.selectButton}
//                 onPress={showStartDatePicker}
//               >
//                 <Text style={styles.buttonText}>
//                   {startDate ? `Start Date: ${startDate}` : "Select Start Date"}
//                 </Text>
//               </TouchableOpacity> */}

//               {/* DateTimePicker for Start Date */}
//               {/* <DateTimePickerModal
//                 isVisible={isStartDatePickerVisible}
//                 mode="date"
//                 onConfirm={handleStartConfirm} // Handle date selection
//                 onCancel={hideStartDatePicker} // Hide picker on cancel
//                 minimumDate={new Date()}
//               /> */}

//               {/* End Date Selection */}
//               {/* <TouchableOpacity
//                 style={[styles.selectButton, { opacity: startDate ? 1 : 0.6 }]}
//                 onPress={showEndDatePicker}
//                 disabled={!startDate}
//               >
//                 <Text style={styles.buttonText}>
//                   {endDate ? `End Date: ${endDate}` : "Select End Date"}
//                 </Text>
//               </TouchableOpacity> */}

//               {/* DateTimePicker for End Date */}
//               {/* <DateTimePickerModal
//                 isVisible={isEndDatePickerVisible}
//                 mode="date"
//                 onConfirm={handleEndConfirm} // Handle date selection
//                 onCancel={hideEndDatePicker} // Hide picker on cancel
//                 minimumDate={new Date()}
//               /> */}

//               {/* Display Selected Date Range */}
//               {/* {startDate && endDate && (
//                 <Text style={styles.dateRangeText}>
//                   Selected Range: {startDate.toLocaleDateString()} -{" "}
//                   {endDate.toLocaleDateString()}
//                 </Text>
//               )} */}
//             </>
//           )
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   containerloading: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 250,
//     // padding: 20,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   productImage: {
//     width: "100%",
//     height: 300,
//     resizeMode: "contain",
//     borderRadius: 8,
//   },
//   productName: {
//     marginTop: 20,
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   productCategory: {
//     marginTop: 5,
//     fontSize: 16,
//     color: "#666",
//   },
//   productDescription: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   productPrice: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   buttonsContainer: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 20,
//   },
//   button: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     flex: 1,
//     borderColor: "#1FE687",
//     borderWidth: 2,
//   },
//   quantity: {
//     fontSize: 20,
//     width: 50,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   selectButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: "#1FE687",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   dateRangeText: {
//     fontSize: 16,
//     color: "#333",
//     marginTop: 10,
//   },
// });

// export default ProductDetails;
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { fetchProductDetails } from "@/api/api";
import useCartStore from "../state/cartStore";
import { Ionicons } from "@expo/vector-icons";

const ProductDetails = ({ route }) => {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { products, addProduct, reduceProduct } = useCartStore((state) => ({
    products: state.products,
    addProduct: state.addProduct,
    reduceProduct: state.reduceProduct,
  }));

  
  const updateProductQuantity = useCallback(() => {
    const result = products.find((p) => p.id === id);
    setCount(result ? result.quantity : 0);
  }, [products, id]);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    updateProductQuantity();
  }, [products, updateProductQuantity]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productData = await fetchProductDetails(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    // Add the product to the cart
    addProduct(product);
    
    // Update the count (if you're tracking total products in the cart)
    setCount(count + 1);  // Increment count when adding a product
  };
  
  const handleReduceProduct = () => {
    // Reduce the product from the cart
    reduceProduct(product);
    
    // Update the count (if you're tracking total products in the cart)
    if (count > 0) {
      setCount(count - 1);  // Decrement count when reducing a product
    }
  };
  

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.containerloading}>
            <ActivityIndicator size={"large"} color={"#1FE687"} />
          </View>
        ) : (
          product && (
            <>
              <Image style={styles.productImage} source={{ uri: product.product_image }} />
              <Text style={styles.productName}>{product.product_name}</Text>
              <Text style={styles.productCategory}>{product.product_category}</Text>
              <Text style={styles.productDescription}>{product.product_description}</Text>
              <Text style={styles.productPrice}>Price: ${product.product_price}</Text>

              {/* Quantity Control */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleReduceProduct}>
                  <Ionicons name="remove" size={24} color={"#1FE687"} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{count}</Text>
                <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                  <Ionicons name="add" size={24} />
                </TouchableOpacity>
              </View>
            </>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  containerloading: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 250,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
  },
  productName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  productCategory: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },
  productDescription: {
    marginTop: 10,
    fontSize: 16,
  },
  productPrice: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    flex: 1,
    borderColor: "#1FE687",
    borderWidth: 2,
  },
  quantity: {
    fontSize: 20,
    width: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductDetails;
