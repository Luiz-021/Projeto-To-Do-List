import React, { useState } from "react";
import "./LoginView.css";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); 

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("accessToken", data.access);
                localStorage.setItem("refreshToken", data.refresh);
                navigate("/tarefas");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Falha no login. Verifique suas credenciais.");
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            console.error("Erro de login:", err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">To-Do List 📝</h2>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        <strong>username:</strong>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <strong>senha:</strong>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>
                <p className="signup-link">
                    <a href="/signup">ainda não tem uma conta?</a>
                </p>
            </div>
        </div>
    );
}