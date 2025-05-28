import React, { useState } from "react";
import "./CreateTodoView.css";
import { useNavigate } from "react-router-dom";

export default function CreateTodoView() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date_limited: "",
        completed: false, 
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            navigate("/");
            return;
        }

        let dataToSend = { ...formData };
        if (dataToSend.date_limited === "") {
            dataToSend.date_limited = null; 
        }


        try {
            const response = await fetch("http://localhost:8000/api/task/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                navigate("/tarefas"); 
            } else if (response.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                navigate("/");
            }
            else {
                const errorData = await response.json();
                let errorMessage = "Erro ao criar tarefa.";
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
            setError("Erro de conexão ao criar tarefa.");
            console.error("Erro ao criar tarefa:", err);
        }
    };


    return (
        <div className="create-container">
            <header className="create-header">
                <h1>To-Do List 📝</h1>
            </header>
            <div className="create-box">
                <h2 className="create-title">Criar nova tarefa ✍️</h2>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form className="create-form" onSubmit={handleSubmit}>
                    <label>
                        <strong>nome da tarefa:</strong>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>descrição:</strong>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
                    </label>
                    <label>
                        <strong>data de entrega:</strong>
                        <input type="date" name="date_limited" value={formData.date_limited} onChange={handleChange} />
                    </label>
                    <label style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <strong>concluída:</strong>
                        <input type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} />
                    </label>
                    <button type="submit" className="create-button">
                        Criar tarefa
                    </button>
                </form>
                <p className="back-link">
                    <a href="/tarefas">Voltar para a lista</a>
                </p>
            </div>
        </div>
    );
}