import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";
import mpesaService from "../services/mpesa.service.js";

/**
 * Initiate M-Pesa STK Push payment for subscription
 */
const initiatePayment = async (req, res) => {
  try {
    console.log("Payment initiation request received:", req.body);
    const { phoneNumber, userId } = req.body;
    
    if (!phoneNumber || !userId) {
      console.log("Missing required fields:", { phoneNumber, userId });
      return responseHandler.badrequest(res, "Phone number and user ID are required");
    }
    
    // Format phone number to ensure it's in the correct format (254XXXXXXXXX)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = `254${phoneNumber.substring(1)}`;
    } else if (phoneNumber.startsWith('+254')) {
      formattedPhone = phoneNumber.substring(1);
    }
    
    console.log("Initiating STK push to phone:", formattedPhone);
    
    // Initiate STK Push using the M-Pesa service
    const paymentResult = await mpesaService.initiateSTKPush(formattedPhone, userId);
    
    // Update user with checkout request ID
    await userModel.findByIdAndUpdate(userId, {
      'subscription.checkoutRequestId': paymentResult.checkoutRequestId
    });
    
    responseHandler.ok(res, {
      message: "Payment initiated successfully",
      checkoutRequestId: paymentResult.checkoutRequestId,
      customerMessage: paymentResult.customerMessage
    });
  } catch (error) {
    console.error("M-Pesa payment initiation error:", error);
    responseHandler.error(res, error.message);
  }
};

/**
 * M-Pesa callback handler
 */
const mpesaCallback = async (req, res) => {
  try {
    console.log("M-Pesa callback received:", req.body);
    const userId = req.params.userId;
    const { Body } = req.body;
    
    // Check if payment was successful
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const transactionId = Body.stkCallback.CallbackMetadata.Item.find(
        item => item.Name === "MpesaReceiptNumber"
      ).Value;
      
      // Set subscription to active and add 30 days validity
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      await userModel.findByIdAndUpdate(userId, {
        'subscription.status': 'active',
        'subscription.expiresAt': expiryDate,
        'subscription.transactionId': transactionId
      });
      
      responseHandler.ok(res, { message: "Payment successful" });
    } else {
      // Payment failed
      await userModel.findByIdAndUpdate(userId, {
        'subscription.status': 'pending'
      });
      
      responseHandler.ok(res, { 
        message: "Payment failed", 
        reason: Body.stkCallback.ResultDesc 
      });
    }
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    responseHandler.error(res);
  }
};

/**
 * Check payment status
 */
const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    console.log("Checking payment status for:", checkoutRequestId);
    
    const statusResult = await mpesaService.checkTransactionStatus(checkoutRequestId);
    
    if (statusResult.success) {
      // Find user with this checkout request ID
      const user = await userModel.findOne({
        'subscription.checkoutRequestId': checkoutRequestId
      });
      
      if (user) {
        // Set subscription to active and add 30 days validity
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        user.subscription.status = 'active';
        user.subscription.expiresAt = expiryDate;
        await user.save();
        
        responseHandler.ok(res, { 
          success: true,
          message: "Payment confirmed successfully",
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            subscription: user.subscription
          }
        });
      } else {
        responseHandler.notfound(res, "User not found");
      }
    } else {
      responseHandler.ok(res, { 
        success: false,
        message: "Payment not completed",
        description: statusResult.resultDesc
      });
    }
  } catch (error) {
    console.error("Check payment status error:", error);
    responseHandler.error(res);
  }
};

export default {
  initiatePayment,
  mpesaCallback,
  checkPaymentStatus
};