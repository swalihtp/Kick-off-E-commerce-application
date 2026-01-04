import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './SportWearBanner.module.css';

function SportWearBanner() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/trendingSportswear')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.titleSection}>
                <h1>Trending Sportswear</h1>
                <h4>Gear up with the latest styles and must-have performance essentials.</h4>
            </div>

            <div className={styles.productsWrapper}>
                {products.length > 0 ? (
                    products.map(item => (
                        <div className={styles.cardContainer} key={item.id}>
                        <div className={styles.card} key={item.id}>
                            <img src={item.image} alt={item.name} />
                            <div className={styles.cardName}>
                                <h3>{item.name}</h3>
                                <h5>{item.category}</h5>
                            </div>
                        </div>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default SportWearBanner;
