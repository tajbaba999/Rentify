// const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_URL = "http://192.168.1.7:8000";

export interface Product {
  id: number;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_image: string;
}

interface CreateOrder {
  email: string;
  products: Array<{ product_id: number; quantity: number }>;
  start_date: string;
  end_date: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Order {
  id: number;
  order_date: Date;
  customer_email: string;
  total: number;
}

// export async function fetchProducts(): Promise<Product[]> {
//   try {
//     const response = await fetch(`${API_URL}/products`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });
//     // console.log("hits" + response.json());
//     // const response = await response.json();
//     // console.log("Products data:", data);
//     // const formattedData: Product[] = rawData.map((item: any) => ({
//     //   id: item._id,
//     //   product_name: item.product_name,
//     //   product_category: item.product_category,
//     //   product_description: item.product_description,
//     //   product_price: item.product_price,
//     //   product_stock: item.product_stock,
//     //   product_image: item.product_image,
//     // }));

//     // console.log("hits: " + JSON.stringify(formattedData));

//     if (!response.ok) {
//       throw new Error("Failed to fetch products.");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const data = await response.json();
    console.log("Fetched products:", data);

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}




// export async function fetchProductDetails(
//   productId: number
// ): Promise<Product | null> {
//   try {
//     const response = await fetch(`${API_URL}/products/${productId}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch product details.");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     return null;
//   }
// }

export async function fetchProductDetails(
  productId: number
): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product details.");
    }

    const data = await response.json();
    console.log("Product details:", data);

    return data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}


// export async function createOrder(
//   orderData: CreateOrder
// ): Promise<Order | null> {
//   try {
//     const response = await fetch(`${API_URL}/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderData),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch order details.");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching order details:", error);
//     return null;
//   }
// }

export async function createOrder(orderData: CreateOrder): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order.");
    }

    const data = await response.json();
    console.log("Order created:", data);

    return data;  // Ensure you're returning the expected Order data structure
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}


