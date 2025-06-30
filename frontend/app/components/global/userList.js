"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/styles/components/userList.module.css";
import { useAuth } from "./authProvider";

export function UserList({ url, onClose, children }) {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = `?q=${searchValue}&offset=${offset}`;
        const fullUrl = `${url}${query}`;
        const response = await fetchWithAuth(fullUrl, "GET");

        if (response.users) {
          if (offset === 1) {
            setUsers(response.users);
          } else {
            setUsers((prev) => [...prev, ...response.users]);
          }
          setHasMore(response.hasMore);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [searchValue, offset]);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setOffset(1); // Reset pagination when search changes
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.close} onClick={onClose}>
          X
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search users..."
          value={searchValue}
          onChange={handleInputChange}
        />
        {users.length > 0 ? (
          users.map((user, i) => (
            <div key={i} className={styles.userCard}>
              <Link href={`/user/${user.id}`}>
                <span>{user.nickname}</span>
              </Link>
              {typeof children === "function" ? children(user) : children}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
        {hasMore && (
          <button
            className={styles.loadMore}
            onClick={() => setOffset((prev) => prev + 1)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
