"use client";

import styles from "@/app/styles/components/createGroup.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../global/authProvider";

export function CreateGroup({ onClose }) {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  async function submitHandle(e) {
    e.preventDefault();
    const response = await fetchWithAuth(
      `http://localhost:8080/api/createGroup`,
      "POST",
      JSON.stringify({
        title: titleInput,
        description: descriptionInput,
      })
    );

    console.log("response", response);
    if (!response?.error_message) {
      console.log("link", `/groups/${response.id}`);
      router.push(`/groups/${response.id}`);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.close}>
          X
        </button>
        <h2>Create New Group</h2>

        <form>
          <input
            type="text"
            placeholder="Group Title"
            onChange={(e) => setTitleInput(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Group Description"
            onChange={(e) => setDescriptionInput(e.target.value)}
            required
          ></input>
          <button onClick={submitHandle} type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
