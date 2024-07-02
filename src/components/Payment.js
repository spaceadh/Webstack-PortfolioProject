import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "../StateProvider";
import { getCartTotal } from "../reducer";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, errorAnim } from "../util";
import axios from "axios";
import db, { auth } from "../firebase";
import successImg from "../assets/success.svg";
import { toast } from "react-toastify";
import { stkPush } from '../apis/paymentsapi';

function Payment() {
  const history = useHistory();
  const query = useQuery();

  const [{ user, cart, loadingBar }, dispatch] = useStateValue();
  const [orderId, setOrderId] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [response, setResponse] = useState(null);
  const [phoneHolder, setphoneHolder] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [cartTotalWithTax, setCartTotalWithTax] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(false);
  const [method, setMethod] = useState("card");

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUserDetails(snapshot.data());
          } else {
            history.replace("/welcome?next=payment", { update: true });
          }
        });
    }
  }, [user, history]);

  useEffect(() => {
    const calculateTotal = async () => {
      const totalAmount = parseFloat(getCartTotal(cart));
      setCartTotal(totalAmount);
    };
    calculateTotal();
  }, [cart]);

  const changeMethod = (e) => {
    if (e.target.checked) {
      setMethod(e.target.value);
    }
    if (e.target.checked && e.target.value === "cod") {
      setError(null);
    }
  };

  const updateDb = (usr, id, amount, created, cartItems, type) => {
    db.collection("users")
      .doc(usr.uid)
      .collection("orders")
      .doc(id)
      .set({
        created: created || (new Date().getTime() / 1000),
        amount: amount,
        items: cartItems,
        type: type,
      })
      .then(() => {
        setSucceeded(true);
        setProcessing(false);
        setError(null);
        setDisabled(false);
        setTimeout(() => {
          if (loadingBar) loadingBar.current.complete();
          setShowSuccess(true);
          dispatch({
            type: "EMPTY_CART",
          });
        }, 2000);
      });
  };

  const createCheckoutSession = async (e) => {
    e.preventDefault();
    console.log(phoneHolder);
    if (phoneHolder.length !== 10) {
      return toast.error("Enter a valid phone number");
    }
    if (!/^07|011/.test(phoneHolder)) {
      return toast.error("Enter a valid phone number starting with 07 or 011");
    }    

    function generateOrderId() {
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      const timestamp = Date.now();
      return `${timestamp}-${randomString}`;
    }

    try {
      setProcessing(true);
      const orderId = generateOrderId();
      console.log(orderId);
      const url = "https://api.rotsi.co.ke/payments/stkPush/v1";
      const amount = cartTotal.toFixed(0);
      console.log(amount);
      const phone = "254" + phoneHolder.substring(1);
      const amountWithoutDecimals = Math.trunc(amount);

      const requestBody = {
        phone,
        amount: amountWithoutDecimals,
      };

      const responseData = await stkPush(requestBody);
      setResponse(responseData);
      setSucceeded(true);
      setShowSuccess(true);

      // Update the database with the payment details
      updateDb(user, orderId, amountWithoutDecimals, Date.now() / 1000, cart, 'card');
    } catch (error) {
      toast.error("Payment failed.", error);
      setPaymentError(error);
    } finally {
      setIsSubmitting(false);
      setProcessing(false);
    }
  };

  useEffect(() => {
    let date = new Date();
    let orderId =
      date.getFullYear() +
      date.getMonth() +
      date.getDay() +
      date.getTime() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds();
    setOrderId(orderId);
  }, []);

  useEffect(() => {
    const success = query.get("success");
    if (success && cart.length > 0) {
      setProcessing(true);
      if (loadingBar) loadingBar.current.continuousStart();
      try {
        auth.onAuthStateChanged((signedIn) => {
          if (signedIn) {
            axios
              .get(`/api/retrieve-session?sessionId=${success}`)
              .then((data) => {
                const { metadata, payment_intent, amount_total } = data.data;
                if (metadata.uid === signedIn.uid) {
                  console.log(metadata);
                  setTimeout(() => {
                    updateDb(
                      signedIn,
                      payment_intent,
                      (amount_total / 7300).toFixed(2),
                      parseInt(metadata.orderId),
                      cart,
                      'card'
                    );
                    history.replace("/payment");
                  }, 1000);
                }
              });
          }
        });
      } catch (e) {
        setError(e.error ? e.error.message : "Some error occured. Try again!");
        setProcessing(false);
        if (loadingBar) loadingBar.current.complete();
      }
    }
  }, [cart, history, query, loadingBar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method === "card") {
      updateDb(
        user,
        user.uid,
        cartTotal.toFixed(0),
        new Date().getTime() / 1000,
        cart,
        'card'
      );
    } else if (method === "cod") {
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .add({
          created: new Date().getTime() / 1000,
          amount: parseFloat(cartTotal.toFixed(2)),
          items: cart,
          type: "cod",
        })
        .then(() => {
          setSucceeded(true);
          setProcessing(false);
          setError(null);
          setDisabled(false);
          setTimeout(() => {
            if (loadingBar) loadingBar.current.complete();
            dispatch({
              type: "EMPTY_CART",
            });
            history.replace("/orders");
          }, 2000);
        });
    }
  };

  return (
    <div className={`payment ${succeeded ? "payment__success" : ""}`}>
      <h4>Complete your Order, {user?.displayName.split(" ", 1)}!</h4>
      <div className="payment__inner">
        <div className="payment__method">
          <h5 style={{ marginTop: "2rem" }}>How'd you like to pay?</h5>
          <p style={{ marginBottom: "2rem", maxWidth: "400px" }}>
            Choose a payment method and verify your details to successfully
            place the order.
          </p>
          {method === "card" && (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={errorAnim}
              className="payment__cardContainer"
            >
              <div className="payment__card">
                <input
                  disabled={processing || succeeded}
                  value={phoneHolder}
                  onChange={(e) => setphoneHolder(e.target.value)}
                  type="text"
                  placeholder="PhoneNumber(07XX)"
                  className="payment__cardName"
                />
              </div>
            </motion.div>
          )}
          {paymentError && (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={errorAnim}
              className="payment__cardError"
            >
              <h5>{paymentError.status}</h5>
              <p>{paymentError.Service}</p>
              <p>{paymentError.message}</p>
            </motion.div>
          )}
          <div className="form__element">
            <input
              disabled={processing || succeeded}
              name="method"
              id="card"
              value="card"
              type="radio"
              checked={method === "card"}
              onChange={(e) => changeMethod(e)}
            />
            <label for="card">Pay Via M-PESA</label>
          </div>
          <div className="form__element">
            <input
              disabled={processing || succeeded}
              name="method"
              id="cod"
              value="cod"
              type="radio"
              checked={method === "cod"}
              onChange={(e) => changeMethod(e)}
            />
            <label for="cod">Cash on Delivery</label>
          </div>
          {userDetails && (
            <div className="payment__shippingDetails">
              <h5>Shipping Details</h5>
              <p>
                {userDetails.name}
                <br />
                {`${userDetails.address}, ${userDetails.state}, ${userDetails.country} - ${userDetails.postal_code}`}
                <br />
                {userDetails.phone}
                <br />
                {userDetails.email}
              </p>
            </div>
          )}
        </div>
        {!showSuccess ? (
        <div className="payment__summary">
        <h5>Order Summary</h5>
        <p>Order ID: {orderId ? orderId : "Generating..."}</p>
        <div className="payment__summaryList">
          {cart.map((item) => (
            <div className="payment__item">
              <span className="payment__name">{item.name}</span>
              <small className="payment__quantity">x{item.quantity}</small>
              <span className="payment__price">
                <small>KES</small>
                {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          {deliveryCharges && (
            <div className="payment__item">
              <span className="payment__name">Delivery Charges</span>
              <span className="payment__price">
                <small>KES</small>150.00
              </span>
            </div>
          )}
          <hr />
          <div className="payment__item">
            <span className="payment__name">Total</span>
            <span className="payment__price">
              <small>KES</small>
              {cartTotal.toFixed(2)}
            </span>
          </div>

          <div style={{ marginTop: "1.5rem" }} className="payment__item">
            <span className="payment__name">Grand Total</span>
            <span className="payment__price">
              <strong style={{ fontSize: "1.25em", fontWeight: "900" }}>
                <small>KES </small>
                {cartTotal.toFixed(0)}
              </strong>
            </span>
          </div>
        </div>
        <div className="buttons">
          <button
            disabled={
              !method ||
              (method === "card" &&
                (disabled || processing || !phoneHolder || error))
            }
            onClick={(e) => handleSubmit(e)}
            className="button buttonPrimary"
          >
            {processing
              ? "Processing..."
              : succeeded
              ? "Success!"
              : method === "cod"
              ? "Confirm Order"
              : "Waiting For Payment"}
          </button>
          {method === "card" && (
            <button
              onClick={createCheckoutSession}
              disabled={processing || !phoneHolder}
              className="button buttonSecondary outline"
            >
              <span>Pay via </span>
              <img
                width={70}
                src="https://www.pngitem.com/pimgs/m/388-3889985_lipa-na-mpesa-logo-hd-png-download.png"
                alt="MPESA"
              />
            </button>
          )}
        </div>
      </div>
    ) : (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={errorAnim}
        className="payment__summary"
      >
        <img src={successImg} alt="success_img" />
        <h5>Yay, it's done!</h5>
        {orderId && <p>Order ID: {orderId}</p>}
        <p>
          Your payment has been successfully processed and we have received
          your order. Check your email for further details.
        </p>
        <div className="buttons">
          <button
            onClick={() => history.replace("/orders")}
            className="buttonPrimary"
          >
            My Orders
          </button>
        </div>
      </motion.div>
    )}
  </div>
</div>
);
}

export default Payment;
