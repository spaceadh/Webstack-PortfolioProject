import React, { useState, useEffect } from "react";
import "./ManageProducts.css";
import ProductCard from "./ProductCard";
import { useStateValue } from "../StateProvider";
import db from "../firebase";

function ManageProducts() {
  const [{ loadingBar }] = useStateValue();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editName, setEditName] = useState(""); // Define editName and setEditName
  const [editPrice, setEditPrice] = useState(""); // Define editPrice and setEditPrice
  const [editimgUrl, seteditimgUrl]= useState("");

  useEffect(() => {
    if (loadingBar) {
      loadingBar.current.continuousStart();
    }

    if (editProduct) {
      setEditName(editProduct.name);
    }

    db.collection("products")
      .get()
      .then((querySnapshot) => {
        if (loadingBar) {
          loadingBar.current.complete();
        }

        const productData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [loadingBar]);

  const handleEdit = (product) => {
    setEditProduct(product);
  }
  
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  }

  const handleConfirmDelete = () => {
    if (productToDelete) {
      db.collection("products")
        .doc(productToDelete.id)
        .delete()
        .then(() => {
          // Remove the product from the local state (products array)
          setProducts(products.filter((p) => p.id !== productToDelete.id));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
  
      // Close the confirmation pop-up
      setShowDeleteConfirmation(false);
    }
  }
  
  const handleCancelDelete = () => {
    // Close the confirmation pop-up
    setShowDeleteConfirmation(false);
  }
  
  const handleSave = () => {
    if (editProduct) {
      // Create an updated product object with the form values
      const updatedProduct = {
        ...editProduct,
        name: editName,
        price: editPrice,
        imgUrl:editimgUrl,
        // Add other form state variables for other product details here
      };

      // Update the product in the local state (products array)
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === editProduct.id ? updatedProduct : p))
      );

      // Update the editProduct state with the updated product
      setEditProduct(updatedProduct);

      // Clear the edit mode
      setEditProduct(null);

      // Use the Firestore update method to update the product in the collection
      db.collection("products")
        .doc(editProduct.id)
        .update(updatedProduct)
        .then(() => {
          // Product updated successfully
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    }
  };


  return (
    <div className="manage-products">
      <h4>Your Products</h4>
      <div className="manage-products__inner">
        {products.map((product) => (
          <div className="manage-products__summary" key={product.id}>
            <ProductCard product={product} />
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product)}>Delete</button>
          </div>
        ))}
      </div>
  
      {editProduct && (
        <div className="edit-product-popup-container">
          <div className="edit-product-popup">
            <h3>Edit Product</h3>
            <form>
              <div className="form-field">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Image Url:</label>
                <input
                  type="text"
                  name="imgUrl"
                  value={editimgUrl}
                  onChange={(e) => seteditimgUrl(e.target.value)}
                />
              </div>
              {/* Add input fields for other product details here */}
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="delete-product-popup-container">
          <div className="delete-product-popup">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product?</p>
            <button onClick={handleConfirmDelete}>Delete</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );  
}

export default ManageProducts;