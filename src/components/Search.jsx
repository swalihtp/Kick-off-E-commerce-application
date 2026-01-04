import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../context/searchContext";
import axios from "axios";
import styles from "./Search.module.css";
import {useNavigate} from 'react-router-dom'

function Search() {
  const { search, setSearch } = useContext(SearchContext);
  const [products, setProducts] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts =
    search.trim() === ""
      ? []
      : products.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <>
      <nav className={styles.searchNav}>
        <h2>Kick-Off</h2>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      {search.trim() !== "" && (
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.productCard}>
              <h3>No products found</h3>
            </div>
          ) : (
            filteredProducts.map((item) => (
              <div key={item.id} className={styles.productCard} onClick={()=>navigate(`/product/${item.id}`)}>
                <h3>{item.name}</h3>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Search;
