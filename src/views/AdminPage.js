import React, { useEffect, useState } from "react";
import Admin from "../components/Admin";
import { motion } from "framer-motion";
import { pageTransition, pageSlide } from "../util";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userDetails"));
    console.log("userDetails", user);
    if (user.admin) {
      setLoading(false);
    } else {
      history.replace("/");
      toast.error("you're not allowed to visit this page, contact admin");
    }
    console.log(user.admin);
  }, [history]);

  return (
    <div>
      {loading ? (
        <p style={{ padding: "3rem" }}>Checking access...</p>
      ) : (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageSlide}
          transition={pageTransition}
        >
          <Admin />
        </motion.div>
      )}
    </div>
  );
}
export default AdminPage;
