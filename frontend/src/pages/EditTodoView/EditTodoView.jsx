import React, { useState, useEffect } from "react";
import "./EditTodoView.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTodoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date_limited: "",
        completed: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/");
            return;
        }

        const fetchTarefa = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/task/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        date_limited: data.date_limited || "",
                        completed: data.completed || false,
                    });
                } else if (response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    navigate("/");
                } else if (response.status === 404) {
                    setError("Tarefa não encontrada ou você não tem permissão para editá-la.");
                }
                else {
                    const errorData = await response.json();
                    setError(errorData.detail || "Erro ao buscar dados da tarefa para edição.");
                }
            } catch (err) {
                setError("Erro de conexão ao buscar dados da tarefa.");
                console.error("Erro ao buscar tarefa para edição:", err);
            }
            setLoading(false);
        };

        if (id) {
            fetchTarefa();
        }
    }, [id, navigate]);

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
            const response = await fetch(`http://localhost:8000/api/task/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                navigate(`/tarefas/${id}`); 
            } else if (response.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                navigate("/");
            }
            else {
                const errorData = await response.json();
                 let errorMessage = "Erro ao salvar edição.";
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
            setError("Erro de conexão ao salvar edição.");
            console.error("Erro ao salvar edição:", err);
        }
    };

    if (loading) {
        return (
            <div className="edit-container">
                 <header className="edit-header"><h1>To-Do List 📝</h1></header>
                <div className="edit-box"><p>Carregando dados da tarefa...</p></div>
            </div>
        );
    }
    
    if (error && !formData.title) { 
         return (
            <div className="edit-container">
                 <header className="edit-header"><h1>To-Do List 📝</h1></header>
                <div className="edit-box">
                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                    <a href="/tarefas" className="back-link">Voltar para a lista</a>
                </div>
            </div>
        );
    }


    return (
        <div className="edit-container">
            <header className="edit-header">
                <h1>To-Do List 📝</h1>
            </header>
            <div className="edit-box">
                <h2 className="edit-title">Editar tarefa 🗒️</h2>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form className="edit-form" onSubmit={handleSubmit}>
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
                    <button type="submit" className="save-button">
                        Salvar edição
                    </button>
                </form>
                <p className="back-link">
                    <a href="/tarefas">Voltar para a lista</a>
                </p>
            </div>
        </div>
    );
}