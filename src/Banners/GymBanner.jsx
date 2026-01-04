import React from 'react';
import styles from './GymBanner.module.css';
import gymImage from '../assets/Gym-theme.jpg';
import {useNavigate} from 'react-router-dom'


function GymBanner() {
  const nav=useNavigate()
  return (
    <div className={styles.banner}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <div>
            <h1>Fuel Your Fitness Journey</h1>
            <p>Discover premium gym wear, accessories, and essentials to power your workouts.</p>
            <button className={styles.cta} onClick={()=>nav('/gym')}>Shop Gym Collection</button>
          </div>
            <div>
            <img src={gymImage} alt="Gym Gear" className={styles.image}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GymBanner;
