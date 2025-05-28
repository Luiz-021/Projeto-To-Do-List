import React, { useState } from "react";
import "./SignupView.css";
import { useNavigate } from "react-router-dom";

export default function SignupView() {
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:8000/api/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess("Conta criada com sucesso! Você será redirecionado para o login.");
                setTimeout(() => {
                    navigate("/"); 
                }, 2000);
            } else {
                const errorData = await response.json();
                let errorMessage = "Erro ao criar conta.";
                if (errorData) {
                    const messages = [];
                    for (const key in errorData) {
                        messages.push(`${key}: ${errorData[key].join ? errorData[key].join(", ") : errorData[key]}`);
                    }
                    errorMessage = messages.join(" ");
                }
                setError(errorMessage);
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            console.error("Erro de cadastro:", err);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">To-Do List 📝</h2>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label>
                        <strong>e-mail:</strong>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>nome:</strong>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>sobrenome:</strong>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>username:</strong>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>senha:</strong>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </label>
                    <button type="submit" className="signup-button">
                        Criar conta
                    </button>
                </form>
                <p className="signup-login-link">
                    <a href="/">já tem uma conta?</a>
                </p>
            </div>
        </div>
    );
}