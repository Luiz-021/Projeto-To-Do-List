import React, { useState, useEffect } from "react";
import "./TodoDetailView.css";
import { useNavigate, useParams } from "react-router-dom";

export default function TodoDetailView() {
    const [tarefa, setTarefa] = useState(null);
    const [error, setError] = useState("");
    const { id } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/");
            return;
        }

        const fetchTarefa = async () => {
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
                    setTarefa(data);
                } else if (response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    navigate("/");
                } else if (response.status === 404) {
                    setError("Tarefa não encontrada ou você não tem permissão para vê-la.");
                }
                else {
                    const errorData = await response.json();
                    setError(errorData.detail || "Erro ao buscar detalhes da tarefa.");
                }
            } catch (err) {
                setError("Erro de conexão ao buscar detalhes da tarefa.");
                console.error("Erro ao buscar tarefa:", err);
            }
        };

        if (id) {
            fetchTarefa();
        }
    }, [id, navigate]);

    const handleExcluir = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/");
            return;
        }

        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                const response = await fetch(`http://localhost:8000/api/task/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    navigate("/tarefas");
                } else if (response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    navigate("/");
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || "Erro ao excluir tarefa.");
                }
            } catch (err) {
                setError("Erro de conexão ao excluir tarefa.");
                console.error("Erro ao excluir tarefa:", err);
            }
        }
    };

    if (error) {
        return (
            <div className="task-container">
                <div className="task-box">
                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                    <button className="button back" onClick={() => navigate(`/tarefas`)}>Voltar para a lista</button>
                </div>
            </div>
        );
    }

    if (!tarefa) {
        return (
            <div className="task-container">
                <div className="task-box">
                    <p>Carregando detalhes da tarefa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="task-container">
            <div className="task-box">
                <h2 className="task-title">{tarefa.title} 📎</h2>
                <div className="task-content">
                    <p>
                        📄 <strong>Descrição:</strong><br />
                        {tarefa.description}
                    </p>
                    <p>
                        📆 <strong>Criada em:</strong> {new Date(tarefa.create).toLocaleDateString()}
                    </p>
                    <p>
                        🗓️ <strong>Entregar até:</strong> {tarefa.date_limited ? new Date(tarefa.date_limited + "T00:00:00").toLocaleDateString() : "Não definida"}
                    </p>
                    <p>
                        ✅ <strong>Status:</strong> {tarefa.completed ? "Concluída" : "Em andamento"}
                    </p>
                </div>
                <div className="task-buttons">
                    <button className="button edit" onClick={() => navigate(`/tarefas/${id}/editar`)}>Editar</button>
                    <button className="button delete" onClick={handleExcluir}>Excluir</button>
                    <button className="button back" onClick={() => navigate(`/tarefas`)}>Voltar para a lista</button>
                </div>
            </div>
        </div>
    );
}