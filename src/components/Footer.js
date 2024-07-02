import React from "react";
import "./Footer.css";
import e_rayonLogo from "../assets/logo-greybg.jpg";
import DropDown from "./DropDown";

const languages = [
  "English",
];
const currency = ["KES - Ksh"];
const footerLinks = [
  {
    title: "Get to Know Us",
    list: ["About Jaybee Cakes ", "Shop with Us", "We provide quality"],
  },
  {
    title: "Mpesa Payment",
    list: [
      "We offer fast deliveries ",
      "We offer quality software at a considerate price",
      "BIG Tech companies should be the only ones having e-commerce websites",
      "The common citizen, trader , sme startup etc. ",
      "And even big retailers not fully broached into the e-commerce part of their business",
    ],
  }
];

function Footer() {
  return (
    <div className="footer">
      <div className="footer__inner">
        <div className="footer__links">
          {footerLinks.map((link) => (
            <div className="footer__row">
              <h6>{link.title}</h6>
              <ul>
                {link.list.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <img src={e_rayonLogo} className="footer__logo" alt="footer" />
          <span className="footer__copy">
            &copy; 2024 | Developed by{" "}
            <a href="https://github.com/spaceadh">Jaybee Cakes | KENYA</a>
          </span>
          </div>
      </div>
    </div>
  );
}
export default Footer;
