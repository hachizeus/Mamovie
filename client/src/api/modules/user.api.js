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
      console.log("Sending signup request to local server");
      const response = await localClient.post(
        userEndpoints.signup,
        { username, password, confirmPassword, displayName, phoneNumber }
      );
      console.log("Signup response:", response);
      return { response };
    } catch (err) { 
      console.error("Signup error:", err);
      return { err }; 
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
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
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