import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import e_rayonIcon from "../assets/e-logoo.jpg";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import BookmarksRoundedIcon from "@material-ui/icons/BookmarksRounded";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
//import EditNoteIcon from '@material-ui/icons/EditNote';
import EditNoteIcon from '@material-ui/icons/Edit';
import WatchLaterRoundedIcon from "@material-ui/icons/WatchLaterRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { NavLink, useHistory } from "react-router-dom";
import defaultImage from "../assets/default.jpg";
import ReactTooltip from "react-tooltip";
import { useStateValue } from "../StateProvider";
import db, { auth } from "../firebase";

const iconStyle = (fontsize) => {
  return {
    fill: "transparent",
    stroke: "#1a1a2c",
    strokeWidth: 1,
    fontSize: fontsize,
  };
};

function Sidebar() {
  const history = useHistory();
  const [{ user, cart, bookmarks }] = useStateValue();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const toggleSidebar = () =>
    setSidebarActive((sidebarActive) => !sidebarActive);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((response) => {
            if (response.exists) {
              setUserDetails(response.data());
            }
          });
          unsubscribe();
      }
    });
  });

  return (
    <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
      <img
        src={e_rayonIcon}
        className="sidebar__icon"
        onClick={toggleSidebar}
        alt="e-icon"
      />
      <div className="sidebar__menu">
        <NavLink
          to="/"
          exact
          className="sidebar__menuItem"
          activeClassName="active"
          data-tip="Home"
          data-for="sidebarTooltip"
          onClick={toggleSidebar}
        >
          <HomeRoundedIcon
            className="sidebar__menuIcon"
            style={iconStyle(36)}
          />
        </NavLink>
        <NavLink
          to="/cart"
          className="sidebar__menuItem"
          activeClassName="active"
          data-tip="Cart"
          data-for="sidebarTooltip"
          onClick={toggleSidebar}
        >
          <ShoppingCartRoundedIcon
            className="sidebar__menuIcon"
            style={iconStyle(34)}
          />
          <span className="sidebar__itemValue">{cart?.length || 0}</span>
        </NavLink>
        <NavLink
          to="/bookmarks"
          className="sidebar__menuItem"
          activeClassName="active"
          data-tip="Bookmarks"
          data-for="sidebarTooltip"
          onClick={toggleSidebar}
        >
          <BookmarksRoundedIcon
            className="sidebar__menuIcon"
            style={iconStyle(30)}
          />
          <span className="sidebar__itemValue">{bookmarks?.length || 0}</span>
        </NavLink>

        <NavLink
          to="/orders"
          className="sidebar__menuItem"
          activeClassName="active"
          data-tip="Orders"
          data-for="sidebarTooltip"
          onClick={toggleSidebar}
        >
          <WatchLaterRoundedIcon
            className="sidebar__menuIcon"
            style={iconStyle(32)}
          />
        </NavLink>

        {userDetails?.admin === true && (
          <NavLink
            to="/admin"
            className="sidebar__menuItem"
            activeClassName="active"
            data-tip="Admin-DashBoard"
            data-for="sidebarTooltip"
            onClick={toggleSidebar}
          >
            <SupervisorAccountIcon
              className="sidebar__menuIcon"
              style={iconStyle(32)}
            />
          </NavLink>
        )}  

        {userDetails?.admin === true && (
          <NavLink
            to="/ManageProducts"
            className="sidebar__menuItem"
            activeClassName="active"
            data-tip="Admin-DashBoard"
            data-for="sidebarTooltip"
            onClick={toggleSidebar}
          >
            <EditNoteIcon
              className="sidebar__menuIcon"
              style={iconStyle(32)}
            />
          </NavLink>
        )}
      </div>
      {user ? (
        <img
          src={user?.photoURL || defaultImage}
          onClick={() => {
            history.push("/profile");
            toggleSidebar();
          }}
          data-tip="My Account"
          data-for="sidebarTooltip"
          className="sidebar__avatar"
          alt="user_image"
        />
      ) : (
        <NavLink
          to="/login"
          className="sidebar__menuItem"
          activeClassName="active"
          data-tip="Login / Register"
          data-for="sidebarTooltip"
          onClick={toggleSidebar}
        >
          <AccountCircleRoundedIcon
            className="sidebar__menuIcon"
            style={iconStyle(36)}
          />
        </NavLink>
      )}
      <ReactTooltip
        place="right"
        className="app__toolTip"
        id="sidebarTooltip"
        backgroundColor="#1a1a2cee"
        effect="solid"
      />
    </div>
  );
}
export default Sidebar;
