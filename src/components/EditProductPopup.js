import React, { useState } from "react";

function EditProductPopup({ product, onSave, onClose }) {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  return (
    <div className="edit-product-popup">
      <h3>Edit Product</h3>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={editedProduct.name}
          onChange={handleInputChange}
        />
        <label>Price:</label>
        <input
          type="text"
          name="name"
          value={editedProduct.price}
          onChange={handleInputChange}
        />
        <label>Image Url:</label>
        <input
          type="text"
          name="name"
          value={editedProduct.imgUrl}
          onChange={handleInputChange}
        />
        {/* Add input fields for other product details here */}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default EditProductPopup;
