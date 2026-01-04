import React from 'react';
import styles from './FootballBanner.module.css';
import footballImage from '../assets/pexels-eslames1-31160153.jpg'; 
import {useNavigate} from 'react-router-dom'


function FootballBanner() {
    const navigate=useNavigate()
    return (
        <div className={styles.banner}>
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <div>
                        <img src={footballImage} alt="Football Gear" className={styles.image}/>
                    </div>
                    <div>
                        <h1>The Ultimate Football Season is Here!</h1>
                        <p>Gear up with official jerseys, boots, and training essentials for all leagues.</p>
                        <button className={styles.cta}onClick={()=>navigate('/football')}>Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FootballBanner;
