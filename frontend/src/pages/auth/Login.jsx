import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/Logo_dark.png";

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + (data.message || "Credenciales incorrectas"));
      } else {
        setUser({
          name: data.name, // 👈 este es el nombre real (nombre_usu)
          role: data.role,
        });

        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "normal") {
          navigate("/");
        } else {
          alert("⚠️ Rol no reconocido: " + data.role);
        }
      }
    } catch (err) {
      alert("❌ Error de conexión: " + err.message);
    } finally {
      setLoading(false);
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
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full bg-white placeholder:text-black mb-4 p-2 border rounded-full outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
