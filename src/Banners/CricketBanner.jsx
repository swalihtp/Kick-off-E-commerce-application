import React from 'react';
import styles from './CricketBanner.module.css';
import cricketImage from '../assets/cricket theme.jpg'; 
import {useNavigate} from 'react-router-dom'

function CricketBanner() {
    const navigate=useNavigate()
    return (
        <div className={styles.banner}>
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h1>Catch the Cricket Fever – Asia Cup Specials!</h1>
                    <p>Official bats, balls, and cricket gear for champions in the making.</p>
                    <button className={styles.cta} onClick={()=>navigate('/cricket')}>Shop Now</button>
                </div>
                <div>
                    <img src={cricketImage} alt="Cricket Gear" className={styles.image}/>
                </div>
            </div>
        </div>
    );
}

export default CricketBanner;
