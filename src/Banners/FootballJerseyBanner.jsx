import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './FootballJerseyBanner.module.css'; // import module

function FootballJerseyBanner() {
  const [jersey, setJerseys] = useState([]);
  const reference = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/jerseys`)
      .then(res => setJerseys(res.data))
      .catch(err => console.log(err));
  }, []);

  const [index, setIndex] = useState(0);

const prevJersey = () => {
  setIndex((prev) => (prev === 0 ? jersey.length - 1 : prev - 1));
};

const nextJersey = () => {
  setIndex((prev) => (prev === jersey.length - 1 ? 0 : prev + 1));
};


  return (
        <div className={styles.banner}>
  <button className={styles.leftBtn} onClick={prevJersey}>‹</button>

  {jersey.length > 0 && (
    <div className={styles.currentJersey}>
      <div>
        <h2>{jersey[index].tagline}</h2>
        <button>Shop now</button>
      </div>
      <div>
        <img src={jersey[index].image} alt={jersey[index].name} />
        <h2>{jersey[index].name}</h2>
      </div>
    </div>
  )}

  <button className={styles.rightBtn} onClick={nextJersey}>›</button>
</div>


  );
}

export default FootballJerseyBanner;
