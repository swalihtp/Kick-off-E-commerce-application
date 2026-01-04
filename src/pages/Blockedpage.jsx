// BlockedPage.jsx
import React from "react";
import styles from "./BlockedPage.module.css";

export default function Blockedpage() {


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🚫 Account Blocked</h1>
        <p className={styles.message}>
          Your account has been blocked. Please contact support for more
          information.
        </p>
      </div>
    </div>
  );
}
