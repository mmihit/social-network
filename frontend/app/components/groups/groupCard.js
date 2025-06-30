"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/styles/components/groupCard.module.css";
import { useAuth } from "../global/authProvider";

export function GroupCard({
  id,
  title,
  description,
  created_at,
  creatorId,
  creatorNickname,
  countMembers,
  status,
}) {
  const [clicked, setClicked] = useState(false);
  const [joinSent, setJoinSent] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    async function joinHandle() {
      const data = await fetchWithAuth(
        `http://localhost:8080/api/groups/${id}/sentJoinRequest`,
        "POST",
        JSON.stringify({
          creatorId: creatorId,
          groupId: id,
        })
      );
      if (data?.message) {
        setJoinSent(true);
        alert(data.message);
      } else if (data?.error_message) {
        setClicked(false);
      }
    }
    if (clicked) {
      joinHandle();
    }
  }, [clicked]);

  return (
    <div className={styles.card}>
      <h1>{title}</h1>

      <div className={styles.details}>
        <p>{description}</p>
        <p>Created at: {created_at}</p>
      </div>

      <div className={styles.meta}>
        <p>
          <span>By:</span> {creatorNickname}
        </p>
        <p>
          <span>Members:</span> {countMembers}
        </p>
      </div>

      <div className={styles.actions}>
        {status ? (
          status === "request" ? (
            <p className="info">Invitation sent</p>
          ) : (
            <Link href={`groups/${id}`}>
              <button>Open</button>
            </Link>
          )
        ) : !joinSent ? (
          <button onClick={() => setClicked(true)}>Join</button>
        ) : (
          <p className="info">Invitation sent</p>
        )}
      </div>
    </div>
  );
}
