import api from "./apiService";

const login = async (data) => {
  const response = await api.post("/auth/login", data);

  if (
    !response.data.status ||
    !response.data.accessToken ||
    !response.data.data
  ) {
    throw new Error(response.data.message || "Invalid login credentials");
  }

  return response.data;
};

const register = async (data) => {
  const response = await api.post("/auth/register", data);
  if (
    !response.data.status ||
    !response.data.accessToken ||
    !response.data.data
  ) {
    throw new Error(response.data.message || "Invalid login credentials");
  }
  return response.data;
};

const logout = async () => {
  try {
    const response = await api.post("/auth/logout");

    if (!response.data.status) {
      throw new Error(response.data.message || "Logout failed");
    }
    localStorage.removeItem("isAuthentication");
    localStorage.removeItem("access_token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

const me = async () => {
  try
  {
    const response = await api.post("/auth/me");
    if (!response.data.status || !response.data.data)
    {
      throw new Error(response.data.message || "Failed to fetch user data");
    }     

    return response.data.data;
  }
  catch (error)
  {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export { login, register,logout,me};
