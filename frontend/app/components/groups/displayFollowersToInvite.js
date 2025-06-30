import { useState } from "react";

export function DisplayMembersToInvite({ id }) {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchInput(e.target.value)}
      ></input>
      <div>{users.length == 0 ? (<h2>no users to display...</h2>)
       :(users.map((user,idx)=>{
        
       }))}</div>
    </div>
  );
}
