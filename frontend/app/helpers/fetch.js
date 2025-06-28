export const fetchData = async (url, method, body) => {
  const response = await fetch(url, {
    method: method,
    credentials: "include",
    body: body,
  });
  const data = await response.json();
  if (!response.ok && data.error_message) {
    alert(`Error: ${data.error_message}`);
  }
  return data;
};
