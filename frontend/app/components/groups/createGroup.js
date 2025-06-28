"use client";

import { fetchData } from "@/app/helpers/fetch";
import styles from "@/app/styles/components/createGroup.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateGroup({ onClose }) {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const router = useRouter();

  async function submitHandle(e) {
    e.preventDefault();
    const response = await fetchData(
      `http://localhost:8080/api/createGroup`,
      "POST",
      JSON.stringify({
        title: titleInput,
        description: descriptionInput,
      })
    );

    console.log("response", response);
    if (!response.error_message) {
      console.log("test this is nice");
      console.log("link", `/groups/${response.id}`);
      alert("ahda");
      router.push(`/groups/${response.id}`);
    } else {
      console.log("not nice");
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
