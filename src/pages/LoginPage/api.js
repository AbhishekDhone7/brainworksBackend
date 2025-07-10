// src/components/LoginPage/LoginPage.jsx
import axios from "../../api/axios";

const handleLogin = async () => {
  const res = await axios.post("/users/login", {
    email,
    password,
  });
  console.log(res.data);
};
