const fetch = require("node-fetch");

// Setup headers and requestOptions
const myHeaders = {
  Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with your actual access token
  "User-Agent": "Apidog/1.0.0 (https://apidog.com)",
};

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

// Function to fetch all orders
async function fetchOrders() {
  const url = "https://api.salla.dev/admin/v2/orders";
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

// Function to fetch details for a single order
async function fetchOrderDetails(orderId) {
  const url = `https://api.salla.dev/admin/v2/orders/${orderId}?format=light`;
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.text();
    console.log(`Order Details for ${orderId}:`, result);
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
}

// Main function to process each order
async function processOrders() {
  const orders = await fetchOrders();
  for (const order of orders) {
    await fetchOrderDetails(order.id); // Assuming each order has an 'id' attribute
  }
}

processOrders();
