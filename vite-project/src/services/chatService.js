import api from "./apiService";

const FetchUsersList = async () => {
  const response = await api.post("/chat/get-all-users");

  if (response.data.status)
  {
    throw new Error(response.data.message || "Invalid login credentials");
  }

  return response.data;
};

export { FetchUsersList }