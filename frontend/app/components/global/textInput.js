"use client";
import styles from "@/app/styles/components/searchInput.module.css"

export function SearchInput({ placeHolder, handler }) {
  return (
    <input className={styles.searchInput}
      placeholder={placeHolder}
      type="text"
      onChange={(e) => {
        handler(e.target.value);
      }}
    ></input>
  );
}
