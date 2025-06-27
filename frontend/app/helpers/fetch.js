export const fetchData = async (url) => {
  const response = await fetch(
    url,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    alert(data.message);
  }
//   console.log(data)
  return data;
};
