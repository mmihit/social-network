"use-client";

export function GroupCard({
  title,
  description,
  created_at,
  creatorNickname,
  countMembers,
  status,
}) {
  return (
    <div>
      <h1>{title}</h1>
      <div>
        <p>{description}</p>
        <p>Created at:{created_at}</p>
      </div>
      <div>
        <p>Created by:{creatorNickname}</p>
        <p>Size:{countMembers}</p>
      </div>
      {status ? <button>Open</button> : <button>Join</button>}
    </div>
  );
}
