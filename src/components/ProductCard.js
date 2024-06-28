// ProductCard.js
import React from "react";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imgUrl} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      {/* <p className="product-category">Category: {product.category}</p> */}
      {/* <p className="product-price">Price: ${product.price.toFixed(2)}</p> */}
      {/* <p className="product-rating">Rating: {product.rating}</p> */}
    </div>
  );
}

export default ProductCard;
