import { useEffect, useState } from "react";
import axios from "axios";

function DeleteProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      alert("Product deleted successfully!");
      setProducts(products.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteProduct;
