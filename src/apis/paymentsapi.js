import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const url = process.env.REACT_APP_SERVER_URL;
// console.log("Url :",url);

const PaymentsAPI = (secretKey) =>
  axios.create({
    baseURL: "https://api.rotsi.co.ke",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': secretKey,
    },
});

export const stkPush = async (body) => {
  try { 
    const {amount, phone} = body;
  
    const PaymentsAPIInstance = PaymentsAPI("f6e25003d3d0b6a0673f531406ed0ad3");
    const { data } = await PaymentsAPIInstance.post(`/payments/stkPush/v1`, { username:"Bluezee", amount, phone });
    // console.log('Response Data:', data);
    return data;
  } catch (error) {
    // console.error('Error in Email:', error);
    toast.error('Please Try Again later.');
    throw error.response.data;
  }
};