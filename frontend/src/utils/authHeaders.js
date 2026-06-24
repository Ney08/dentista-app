export const getToken = () => {

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );

};


export const authHeaders = () => {

  const token =
    getToken();

  return {
    "Content-Type": "application/json",
    Authorization:
      token
        ? `Bearer ${token}`
        : ""
  };

};