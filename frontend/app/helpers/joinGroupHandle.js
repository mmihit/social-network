import { fetchData } from "./fetch";

export async function joinGroupHandle(id) {
  const data = await fetchData(
    `http://localhost:8080/api/groups/${id}/joinInvitation`,
    "PUT",
    null
  );
}
