import axios from "axios";

// Function to create a checkout session for M-Pesa STK push
const createCheckoutSession = async (amount, phoneNumber, orderId, accessToken) => {
  try {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; // Update with the actual M-Pesa API endpoint
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const requestBody = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE, // Replace with your business short code
      Password: "YOUR_PASSWORD_GENERATION_LOGIC_HERE", // Replace with your password generation logic
      Timestamp: "YOUR_TIMESTAMP_GENERATION_LOGIC_HERE", // Replace with your timestamp generation logic
      TransactionType: "CustomerPayBillOnline", // Change to your desired transaction type
      Amount: amount,
      PartyA: phoneNumber, // Paying user's phone number
      PartyB: process.env.BUSINESS_SHORT_CODE, // Your business shortcode
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.BASE_URL}/api/stkPushCallback/${orderId}`, // Using your callback URL
      AccountReference: "YOUR_ACCOUNT_REFERENCE", // Replace with a relevant account reference
      TransactionDesc: "Payment for Order", // Customize the description
    };

    const response = await axios.post(url, requestBody, { headers });

    if (response.status === 200) {
      // Transaction initiation successful
      const responseData = response.data;
      return responseData;
    } else {
      // Handle the error response from Safaricom M-Pesa API
      throw new Error("Failed to initiate M-Pesa STK push transaction");
    }
  } catch (error) {
    throw error;
  }
};

export default createCheckoutSession;
