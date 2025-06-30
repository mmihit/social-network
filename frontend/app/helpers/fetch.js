

export const fetchData = async (url, method, body) => {
  const response = await fetch(url, {
    method: method,
    credentials: "include",
    body: body,
  });
  if (!response) {
    throw new Error(response);
  }
  const data = await response.json();
  if (!response.ok && data.error_message) {
    if (data.error_code==401) {
      //i think i need to go to /login
    }
  }

  return data;
};
