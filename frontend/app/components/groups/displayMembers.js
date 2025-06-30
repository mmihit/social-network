// import style from "@/app/styles/components/displayMembers.module.css";
"use client";

import { useEffect, useState } from "react";
import style from "@/app/styles/components/displayMembers.module.css";
import Link from "next/link";
import { useAuth } from "../global/authProvider";

export function DisplayMembers({ id }) {
  const [members, setMembers] = useState([]);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    async function getMembers() {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/groups/${id}/getMembers`,
        "GET"
      );
      if (!response?.error_message) setMembers(response.members);
    }
    getMembers();
  }, []);

  if (members.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={style.container}>
      {members.map((member, key) => (
        <div key={key} className={style.memberCard}>
          <Link href={`/user/${member.id}`}>
            <h2>{member.nickname}</h2>
          </Link>
          <h2>{member.status}</h2>
        </div>
      ))}
    </div>
  );
}
