"use client";
import styles from "@/app/styles/pages/auth.module.css";

export function ErrorFormMessage(props) {
  console.log(props);
  return (
    <div className={styles.error_section}>
      <p className={styles.error_message}>{props.Message}</p>
    </div>
  );
}
