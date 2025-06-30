"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import style from "@/app/styles/components/groupDetails.module.css";
import { DisplayMembers } from "./displayMembers";
import { useAuth } from "../global/authProvider";
import { UserList } from "../global/userList";

export function GroupDetails({ id }) {
  const [group, setGroup] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [displayMembers, setDisplayMembers] = useState(false);
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [joinSent, setJoinSent] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    async function joinHandle() {
      const data = await fetchWithAuth(
        `http://localhost:8080/api/groups/${id}/sentJoinRequest`,
        "POST",
        JSON.stringify({
          creatorId: group.creator.id,
          groupId: parseInt(id),
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

  useEffect(() => {
    async function getGroupHandle() {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/groups/${id}/getGroup`,
        "GET"
      );

      if (response?.error_message) {
        if (response.error_message === "this group not exists") {
          setNotFound(true);
        }
      } else {
        setGroup(response);
      }
    }
    getGroupHandle();
  }, []);

  async function handleAddMember(userId) {
    const response = await fetchWithAuth(
      `http://localhost:8080/api/groups/${id}/addMember`,
      "POST",
      JSON.stringify({ id: userId })
    );

    if (!response?.error_message) {
      setInvitedMembers((prev) => [...prev, userId]);
      alert(response.message);
    }
  }

  if (notFound) return <h1>Group not found</h1>;
  if (!group) return <p>Loading...</p>;

  return (
    <div className={style.container}>
      <div className={style.groupHeader}>
        <h1>{group.title}</h1>
        <p>
          created by:{" "}
          <Link href={`/user/${group.creator.id}`}>
            <span>{group.creator.nickname}</span>
          </Link>
        </p>
      </div>

      <div className={style.descriptionSection}>
        <p>{group.description}</p>
      </div>

      <div className={style.footer}>
        <div>
          <p>size: {group.size}</p>
        </div>
        {group.status ? (
          group.status === "request" ? (
            <p>waiting...</p>
          ) : (
            <div className={style.invite}>
              <a onClick={() => setDisplayMembers(true)}>Members</a>
              <button onClick={() => setDisplayFollowers(true)}>
                Invite members
              </button>
            </div>
          )
        ) : !joinSent ? (
          <button onClick={() => setClicked(true)}>Join</button>
        ) : (
          <p className="info">Invitation sent</p>
        )}
      </div>

      {displayMembers && (
        <div className={style.membersSection}>
          <button
            className={style.close}
            onClick={() => setDisplayMembers(false)}
          >
            X
          </button>
          <DisplayMembers id={id} />
        </div>
      )}

      {displayFollowers && (
        <UserList
          url={`http://localhost:8080/api/groups/${id}/getFollowersToInvite`}
          onClose={() => setDisplayFollowers(false)}
        >
          {(user) =>
            invitedMembers.includes(user.id) ? (
              <p>Invited</p>
            ) : (
              <button onClick={() => handleAddMember(user.id)}>
                Add member
              </button>
            )
          }
        </UserList>
      )}
    </div>
  );
}
