"use client";

import { fetchData } from "@/app/helpers/fetch";
import styles from "@/app/styles/components/navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./authProvider";

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const {fetchWithAuth}=useAuth()
  const router = useRouter();

  useEffect(() => {
    async function logOutHandler() {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/logout`,
        "POST"
      );
      console.log(response)

      if (!response?.error_message) {
        router.push("/login");
        alert(response.message);
      }
    }

    if (logOut) logOutHandler();
  }, [logOut]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">SNetwork</Link>
      </div>

      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search users..."
          className={styles.search}
        />

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
                <button onClick={() => setLogOut(true)}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
