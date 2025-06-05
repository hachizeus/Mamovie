import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField, Typography, Stepper, Step, StepLabel, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const steps = ['Account Details', 'Payment', 'Confirmation'];

  const signupForm = useFormik({
    initialValues: {
      password: "",
      username: "",
      displayName: "",
      confirmPassword: "",
      phoneNumber: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      displayName: Yup.string()
        .min(8, "displayName minimum 8 characters")
        .required("displayName is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirmPassword not match")
        .min(8, "confirmPassword minimum 8 characters")
        .required("confirmPassword is required"),
      phoneNumber: Yup.string()
        .matches(/^(?:\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number")
        .required("Phone number is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      
      try {
        // For testing, create a temporary user ID
        const tempUserId = "temp_" + Date.now();
        setUserId(tempUserId);
        setActiveStep(1); // Move to payment step
        toast.success("Account created! Please complete payment to activate.");
        setIsLoginRequest(false);
      } catch (error) {
        setIsLoginRequest(false);
        setErrorMessage("An error occurred during signup");
      }
    }
  });

  const handleInitiatePayment = async () => {
    console.log("Initiating payment for user:", userId);
    console.log("Phone number:", signupForm.values.phoneNumber);
    
    setIsLoginRequest(true);
    
    try {
      // For testing, simulate a successful payment
      // Create a mock checkout request ID with timestamp
      const mockCheckoutId = "ws_CO_" + Date.now().toString();
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoginRequest(false);
      setCheckoutRequestId(mockCheckoutId);
      toast.success("Payment request sent to your phone (simulated)");
      setPaymentStatus("Please check your phone and enter your M-Pesa PIN to complete payment");
    } catch (error) {
      console.error("Exception during payment:", error);
      setIsLoginRequest(false);
      setErrorMessage("An unexpected error occurred");
    }
  };

  const checkPaymentStatus = async () => {
    if (!checkoutRequestId) return;
    
    setIsCheckingPayment(true);
    
    try {
      // For testing, check if 15 seconds have passed since payment initiation
      const now = new Date().getTime();
      const requestTime = parseInt(checkoutRequestId.split('_')[2] || '0');
      const elapsed = now - requestTime;
      
      // After 15 seconds, simulate payment success
      if (elapsed > 15000) {
        setIsCheckingPayment(false);
        setPaymentStatus("Payment successful!");
        setActiveStep(2); // Move to confirmation step
        
        // Create a mock user object for testing
        const mockUser = {
          id: userId,
          username: signupForm.values.username,
          displayName: signupForm.values.displayName,
          subscription: {
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Use ISO string to avoid serialization issues
          }
        };
        
        // Set the user in Redux
        dispatch(setUser(mockUser));
        
        // Close the auth modal
        setTimeout(() => {
          dispatch(setAuthModalOpen(false));
          toast.success("Account activated successfully!");
        }, 2000);
      } else {
        setIsCheckingPayment(false);
        setPaymentStatus(`Payment pending: Please complete the payment on your phone (${Math.round((15000 - elapsed) / 1000)}s remaining)`);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setIsCheckingPayment(false);
      setErrorMessage("Failed to check payment status");
    }
  };

  // Check payment status every 3 seconds after payment is initiated
  useEffect(() => {
    let interval;
    if (checkoutRequestId && activeStep === 1) {
      // Initial check after 1 second
      const initialTimeout = setTimeout(() => {
        checkPaymentStatus();
      }, 1000);
      
      // Then check every 3 seconds
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);
      
      return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
      };
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutRequestId, activeStep]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              type="text"
              placeholder="username"
              name="username"
              fullWidth
              value={signupForm.values.username}
              onChange={signupForm.handleChange}
              color="success"
              error={signupForm.touched.username && signupForm.errors.username !== undefined}
              helperText={signupForm.touched.username && signupForm.errors.username}
            />
            <TextField
              type="text"
              placeholder="display name"
              name="displayName"
              fullWidth
              value={signupForm.values.displayName}
              onChange={signupForm.handleChange}
              color="success"
              error={signupForm.touched.displayName && signupForm.errors.displayName !== undefined}
              helperText={signupForm.touched.displayName && signupForm.errors.displayName}
            />
            <TextField
              type="text"
              placeholder="phone number (e.g., 0712345678)"
              name="phoneNumber"
              fullWidth
              value={signupForm.values.phoneNumber}
              onChange={signupForm.handleChange}
              color="success"
              error={signupForm.touched.phoneNumber && signupForm.errors.phoneNumber !== undefined}
              helperText={signupForm.touched.phoneNumber && signupForm.errors.phoneNumber}
            />
            <TextField
              type="password"
              placeholder="password"
              name="password"
              fullWidth
              value={signupForm.values.password}
              onChange={signupForm.handleChange}
              color="success"
              error={signupForm.touched.password && signupForm.errors.password !== undefined}
              helperText={signupForm.touched.password && signupForm.errors.password}
            />
            <TextField
              type="password"
              placeholder="confirm password"
              name="confirmPassword"
              fullWidth
              value={signupForm.values.confirmPassword}
              onChange={signupForm.handleChange}
              color="success"
              error={signupForm.touched.confirmPassword && signupForm.errors.confirmPassword !== undefined}
              helperText={signupForm.touched.confirmPassword && signupForm.errors.confirmPassword}
            />
          </Stack>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Subscription Payment - 1 KSH
            </Typography>
            <Typography variant="body1" gutterBottom>
              To complete your registration, please pay the subscription fee of 1 KSH using M-Pesa.
            </Typography>
            
            {!checkoutRequestId ? (
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                sx={{ marginTop: 4 }}
                loading={isLoginRequest}
                onClick={handleInitiatePayment}
              >
                Pay with M-Pesa
              </LoadingButton>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  {paymentStatus || "Payment initiated. Please check your phone."}
                </Alert>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  {isCheckingPayment && <CircularProgress size={24} />}
                </Box>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Checking payment status automatically...
                </Typography>
                
                {/* Simulation note */}
                <Alert severity="warning" sx={{ mt: 3 }}>
                  SIMULATION MODE: For testing purposes, the payment will be automatically 
                  confirmed after 15 seconds. In production, you would receive an actual 
                  M-Pesa prompt on your phone.
                </Alert>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Payment successful! Your account is now active.
            </Alert>
            <Typography variant="body1">
              Thank you for subscribing. You now have full access to our movie platform.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box component="form" onSubmit={signupForm.handleSubmit}>
        {renderStepContent(activeStep)}

        {activeStep === 0 && (
          <>
            <LoadingButton
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ marginTop: 4 }}
              loading={isLoginRequest}
            >
              Continue to Payment
            </LoadingButton>

            <Button
              fullWidth
              sx={{ marginTop: 1 }}
              onClick={() => switchAuthState()}
            >
              sign in instead
            </Button>
          </>
        )}

        {errorMessage && (
          <Box sx={{ marginTop: 2 }}>
            <Alert severity="error" variant="outlined">{errorMessage}</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SignupForm;