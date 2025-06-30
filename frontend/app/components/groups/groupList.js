"use client";

import { useEffect, useState } from "react";
import { GroupCard } from "./groupCard";
import styles from "@/app/styles/components/groupList.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../global/authProvider";

export function GroupList({ input }) {
  const [searchMessage, setSearchMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(1);
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setGroups([]);
    setOffset(1);
    setSearchMessage("");
  }, [input]);

  useEffect(() => {
    let isCancelled = false;

    const getData = async () => {
      const data = await fetchWithAuth(
        `http://localhost:8080/api/groups/search?q=${encodeURIComponent(
          input
        )}&offset=${offset}`,
        "GET"
      );

      if (isCancelled) return;

      if (data?.groups) {
        if (offset === 1) {
          setGroups(data.groups);
        } else {
          setGroups((prev) => [...prev, ...data.groups]);
        }
        setHasMore(data.hasMore);
      } else if (data?.message) {
        setSearchMessage(data.message);
        setGroups([]);
        setHasMore(false);
      }
    };

    getData();

    return () => {
      isCancelled = true;
    };
  }, [input, offset]);

  return (
    <div className={styles.groupListContainer}>
      {groups.length > 0 ? (
        groups.map((group, idx) => {
          const date = new Date(group.created_at);
          return (
            <GroupCard
              key={idx}
              id={group.id}
              title={group.title}
              description={group.description}
              created_at={date.toDateString()}
              creatorId={group.creator.id}
              creatorNickname={group.creator.nickname}
              countMembers={group.size}
              status={group.status}
            />
          );
        })
      ) : (
        <p className={styles.noResult}>{searchMessage || "No groups found."}</p>
      )}

      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={() => setOffset((prev) => prev + 1)}
        >
          Load more...
        </button>
      )}
    </div>
  );
}
