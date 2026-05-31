import { API_URL } from "../config";

export const useUser = () => {

  const updateUser = async (userId, username, password) => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.trim(),
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Error ❌");
    }

    return data;
  };

  return {
    updateUser
  };
};