import axios from 'axios';
import moment from 'moment';

/**
 * M-Pesa API integration service for Safaricom Sandbox
 */
class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.baseUrl = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
    this.subscriptionAmount = 1; // 1 KSH for testing
  }

  /**
   * Get OAuth token for M-Pesa API authentication
   */
  async getAccessToken() {
    try {
      console.log("Getting M-Pesa access token");
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      console.log("Access token received");
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  /**
   * Initiate STK Push to customer's phone
   * @param {string} phoneNumber - Customer phone number (format: 254XXXXXXXXX)
   * @param {string} userId - User ID to track the transaction
   */
  async initiateSTKPush(phoneNumber, userId) {
    try {
      console.log(`Initiating STK push to ${phoneNumber} for user ${userId}`);
      
      const accessToken = await this.getAccessToken();
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const password = Buffer.from(
        `${this.shortcode}${this.passkey}${timestamp}`
      ).toString('base64');

      console.log("Making STK push request");
      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: this.subscriptionAmount,
          PartyA: phoneNumber,
          PartyB: this.shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: `${this.callbackUrl}`,
          AccountReference: 'Movie Subscription',
          TransactionDesc: 'Movie Website Subscription',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("STK push response:", response.data);
      
      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        customerMessage: response.data.CustomerMessage,
      };
    } catch (error) {
      console.error('Error initiating STK push:', error.response?.data || error.message);
      throw new Error('Failed to initiate M-Pesa payment: ' + (error.response?.data?.errorMessage || error.message));
    }
  }

  /**
   * Check the status of an STK Push transaction
   * @param {string} checkoutRequestId - The checkout request ID from STK push
   */
  async checkTransactionStatus(checkoutRequestId) {
    try {
      console.log(`Checking transaction status for ${checkoutRequestId}`);
      
      const accessToken = await this.getAccessToken();
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const password = Buffer.from(
        `${this.shortcode}${this.passkey}${timestamp}`
      ).toString('base64');

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Transaction status response:", response.data);
      
      return {
        success: response.data.ResultCode === "0",
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
      };
    } catch (error) {
      console.error('Error checking transaction status:', error.response?.data || error.message);
      throw new Error('Failed to check M-Pesa transaction status');
    }
  }
}

export default new MpesaService();