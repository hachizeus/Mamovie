import privateClient from "../client/private.client";
import publicClient from "../client/public.client";
import localClient from "../client/local.client";

// Use localClient for M-Pesa operations
const client = localClient; // Make sure this is pointing to your local server

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  passwordUpdate: "user/update-password",
  verifyPayment: "user/verify-payment"
};

const mpesaEndpoints = {
  initiatePayment: "mpesa/initiate",
  checkStatus: "mpesa/status"
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      console.log("Sending signin request to local server");
      const response = await localClient.post(
        userEndpoints.signin,
        { username, password }
      );

      return { response };
    } catch (err) { console.log("Signin error:", err); return { err }; }
  },
  signup: async ({ username, password, confirmPassword, displayName, phoneNumber }) => {
    try {
      console.log("Sending signup request to server:", userEndpoints.signup);
      console.log("With data:", { username, displayName, phoneNumber });
      
      // Use direct URL for production without credentials
      const directUrl = "https://mamovie-api.onrender.com/api/v1/user/signup";
      
      const response = await fetch(directUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit', // Don't send credentials
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword, displayName, phoneNumber })
      }).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      });
      
      console.log("Signup response:", response);
      return { response };
    } catch (err) { 
      console.error("Signup error:", err);
      return { err: { message: err.message || "Network error during signup" } }; 
    }
  },
  initiatePayment: async ({ phoneNumber, userId }) => {
    try {
      console.log("Sending payment request to:", mpesaEndpoints.initiatePayment);
      console.log("With data:", { phoneNumber, userId });
      
      const response = await client.post(
        mpesaEndpoints.initiatePayment,
        { phoneNumber, userId }
      );
      
      console.log("Payment initiation successful:", response);
      return { response };
    } catch (err) { 
      console.error("Payment initiation failed:", err);
      return { err }; 
    }
  },
  checkPaymentStatus: async (checkoutRequestId) => {
    try {
      const response = await client.get(
        `${mpesaEndpoints.checkStatus}/${checkoutRequestId}`
      );

      return { response };
    } catch (err) { return { err }; }
  },
  verifyPaymentAndActivate: async ({ userId, checkoutRequestId }) => {
    try {
      const response = await client.post(
        userEndpoints.verifyPayment,
        { userId, checkoutRequestId }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  getInfo: async () => {
    try {
      // Get user data from localStorage instead of API call
      const userData = localStorage.getItem("user_data");
      if (userData) {
        return { response: JSON.parse(userData) };
      } else {
        return { err: { message: "User not logged in" } };
      }
    } catch (err) { return { err }; }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(
        userEndpoints.passwordUpdate,
        { password, newPassword, confirmNewPassword }
      );

      return { response };
    } catch (err) { return { err }; }
  }
};

export default userApi;