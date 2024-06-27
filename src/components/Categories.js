import React from "react";
import "./Categories.css";
import { useStateValue } from "../StateProvider";

const categories = [
  "Diabetic Medications",
  "Antidiarrheals",
  "Antibiotics",
  "Vaccines",
  "Laxatives",
  "Antihistamines",
  "Antipyretics (Fever Reducers)",
  "Antiseptics and Disinfectants",
  "Analgesics (Pain Relievers)",
  "Antiviral Medications",
  "Antacids and Anti-Ulcerants",
  ""
 ];

function Categories() {
  const [{}, dispatch] = useStateValue();

  const setActive = (e, category) => {
    let prevActive = document.querySelector(".categories__category.active");
    if (prevActive) prevActive.classList.remove("active");
    e.preventDefault();
    e.target.classList.add("active");
    dispatch({
      type: "SET_CATEGORY",
      category: category,
    });
  };

  return (
    <div className="categories">
      <span
        className="categories__category active"
        onClick={(e) => setActive(e, "all")}
      >
        Pharmacy products
      </span>
      {categories.map((category) => (
        <span
          className="categories__category"
          onClick={(e) => setActive(e, category)}
          key={category}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
export default Categories;
