import styles from "./MainBanner.module.css";

function MainBanner() {
  return (
    <div className={styles.banner}>
      {/* Left Section */}
      <div className={styles.left}>
        <h2 className={styles.kickoff}>Kick-Off</h2>
        <h1 className={styles.grand}>Grand Slam</h1>
        <h1 className={styles.bash}>Bash</h1>
        <p className={styles.date}>1 to 30th SEP</p>
      </div>

      {/* Center Image */}
      <div className={styles.center}>
        <img
          src="/Banner/pexels-zakaria-2827400 (1).jpg"
          alt="banner image"
          className={styles.bannerImg}
        />
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        <h2 className={styles.discount}>EXTRA 25% OFF</h2>
        <h2 className={styles.everything}>ON EVERYTHING*</h2>
        <p className={styles.checkout}>Discount auto applied at checkout</p>

        <div className={styles.btnGroup}>
          <button className={`${styles.ctaBtn} ${styles.forHim}`}>FOR HIM</button>
          <button className={`${styles.ctaBtn} ${styles.forHer}`}>FOR HER</button>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
