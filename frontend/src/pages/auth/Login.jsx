import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../assets/Logo_dark.png";

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      setUser({ username, role: "admin" });
      navigate("/admin");
    } else if (username === "user" && password === "user123") {
      setUser({ username, role: "normal" });
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-login">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-2xl z-10 p-6 rounded shadow-md w-80"
      >
        <div className="w-[120px] m-auto my-4">
          <img src={Logo} alt="JevicTecnology" className="w-full" />
        </div>
        <input
          type="text"
          placeholder="Usuario"
          className="w-full bg-white placeholder:text-black mb-2 p-2 border rounded-full outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full bg-white placeholder:text-black mb-4 p-2 border rounded-full outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-full"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
