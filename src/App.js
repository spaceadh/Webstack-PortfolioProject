import React, { useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./components/Button.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import OrdersPage from "./views/OrdersPage";
import AdminPage from "./views/AdminPage";
import ProductPage from "./views/ProductPage";
import PaymentPage from "./views/PaymentPage";
import CartPage from "./views/CartPage";
import BookmarkPage from "./views/BookmarkPage";
import UserPage from "./views/UserPage";
import ManageProductsPage from "./views/ManageProductsPage";

import { Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import "./App.css";
import db, { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import LoadingBar from "react-top-loading-bar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { shuffleArray } from "./util";
import Fuse from "fuse.js";
import dotenv from "dotenv";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FloatingWhatsApp } from "react-floating-whatsapp-button";
import "react-floating-whatsapp-button/dist/index.css";

import { useState } from "react";
dotenv.config();

const promise = loadStripe(
  "pk_test_51HdsPRE4K4vYNE8J6n2SZ7Q68Z8mqdHJROiHxnm7U5yeTk8oBed7LF3IqSZGSlr1vso40SYgMc3NWeYCvuhKfv6H00pu5ZkJi3"
);
const elFonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@800&display=swap",
  },
];

function App() {
  const location = useLocation();
  const [{ user }, dispatch] = useStateValue();
  const loadingBar = useRef(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    const localBookmarks = localStorage.getItem("bookmarks");
    if (localCart) {
      dispatch({
        type: "RESTORE_CART",
        cart: JSON.parse(localCart),
      });
    }
    if (localBookmarks) {
      dispatch({
        type: "RESTORE_BOOKMARKS",
        bookmarks: JSON.parse(localBookmarks),
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (loadingBar) {
      dispatch({
        type: "LOADING_BAR",
        loadingBar: loadingBar,
      });
    }
  }, [loadingBar, dispatch]);

  useEffect(() => {
    loadingBar.current.continuousStart();
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    function fetchUserdetails() {
      const storedDetails = localStorage.getItem("userDetails");
      auth.onAuthStateChanged(async (logged_user) => {
        if (logged_user) {
          await db
            .collection("users")
            .doc(logged_user.uid)
            .get()
            .then((response) => {
              if (response.exists) {
                return setUserDetails(response.data());
              }
            });
          dispatch({
            type: "SET_USER_DETAILS",
            userDetails: userDetails,
          });
        } else {
          dispatch({
            type: "SET_USER_DETAILS",
            userDetails: JSON.parse(storedDetails),
          });
        }
      });
    }

    fetchUserdetails();

    // pull firebase databse products
    async function fetchAllProducts() {
      const products = await db.collection("medicine_inventory").get();
      console.log(products);
      const productsObj = products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(productsObj);
      dispatch({
        type: "SET_PRODUCTS",
        products: shuffleArray(productsObj),
      });
      const fuse = new Fuse(productsObj, { keys: ["name", "category"] });
      dispatch({
        type: "SET_FUSE",
        fuse: fuse,
      });
      loadingBar.current.complete();
    }
    fetchAllProducts();
  }, [dispatch]);

  return (
    <div className="app">
      <div className="whatsapp_icon">
        <FloatingWhatsApp
          phone={process.env.REACT_APP_WHATSAPP_CONTACT}
          size="40px"
          popupMessage="Hello, have a question about our Pharmacy Products?. We reply instantly"
          headerTitle="Chat with a RosePharmacy"
        />
      </div>

      <LoadingBar height={3} color="#f90" ref={loadingBar} shadow={true} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <Sidebar />
      <div className="app__inner">
        <AnimatePresence exitBeforeEnter>
          <AnimateSharedLayout>
            <Header />
            <Switch location={location} key={location.pathname}>
              <Route path="/product/:id">
                <ProductPage />
              </Route>
              <Route path="/cart">
                <CartPage />
              </Route>
              <Route path="/bookmarks">
                <BookmarkPage />
              </Route>
              <Route path="/login">
                <UserPage type="login" />
              </Route>
              <Route path="/signup">
                <UserPage type="signup" />
              </Route>
              <Route path="/welcome">
                <UserPage type="welcome" />
              </Route>
              <Route path="/password-reset">
                <UserPage type="passwordReset" />
              </Route>
              <Route path="/profile">
                <UserPage type="profile" />
              </Route>
              <Route path="/auth">
                <Auth />
              </Route>
              <Route path="/ManageProducts">
                <ManageProductsPage />
              </Route>
              <Route path="/payment">
                <Elements options={{ fonts: elFonts }} stripe={promise}>
                  <PaymentPage />
                </Elements>
              </Route>
              <Route path="/orders">
                <OrdersPage />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </AnimateSharedLayout>
        </AnimatePresence>
      </div>
      <div
        className="app__spacing"
        style={{ marginTop: "auto", marginBottom: "5rem" }}
      ></div>
      <Footer />
    </div>
  );
}

export default App;
