"use client";

import styles from "@/app/styles/components/navbar.module.css";
import Link from "next/link";
import { useState } from "react";

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log(styles)

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">SNetwork</Link>
      </div>

      <div className={styles.actions}>
        <input type="text" placeholder="Search users..." className={styles.search} />
        
        <div className={styles.icons}>
          <span>💬</span>
          <span>🔔</span>
          <div
            className={styles.profileIcon}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            👤
            {menuOpen && (
              <div className={styles.dropdown}>
                <Link href="/profile">Profile</Link>
                <Link href="/logout">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}