// DeleteProductPopup.js
import React from "react";

function DeleteProductPopup({ product, onDelete, onClose }) {
  const handleDelete = () => {
    onDelete(product);
    onClose();
  };

  return (
    <div className="delete-product-popup">
      <h3>Delete Product</h3>
      <p>Are you sure you want to delete this product?</p>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={onClose}>No</button>
    </div>
  );
}

export default DeleteProductPopup;
