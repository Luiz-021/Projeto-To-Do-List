import React, { useState, useEffect } from "react";
import "./TodoListView.css";
import { useNavigate } from "react-router-dom";

export default function TodoListView() {
    const [search, setSearch] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchTarefas = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/task/user/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTarefas(data);
            } else if (response.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Erro ao buscar tarefas.");
            }
        } catch (err) {
            setError("Erro de conexão ao buscar tarefas.");
            console.error("Erro ao buscar tarefas:", err);
        }
    };

    useEffect(() => {
        fetchTarefas();
    }, []); 

    const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
};

    const handleExcluir = async (tarefaId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/");
            return;
        }

        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                const response = await fetch(`http://localhost:8000/api/task/${tarefaId}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    setTarefas(tarefas.filter(t => t.id !== tarefaId));
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


    const filtrarTarefas = tarefas.filter((tarefa) =>
        tarefa.title && tarefa.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="list-container">
            <div className="list-header">
                <h2 className="list-title">Suas tarefas ⭐</h2>
                <input
                    type="text"
                    placeholder="Pesquisar tarefa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                />

                <button
                    tittle="Sair"
                    onClick={handleLogout}
                    style={{
                background: "none",
                border: "none",
                fontSize: "1.4rem",
                cursor: "pointer",
                color: "#555"
               }}
            >⎋</button>


            </div>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <div className="task-list">
                {filtrarTarefas.length > 0 ? (
                    filtrarTarefas.map((item, index) => (
                        <div className="task-item" key={item.id}>
                            <div className="task-info">
                                <p>
                                    <strong>{index + 1}. {item.title}</strong>
                                    {item.date_limited && <> - Até: <strong>{new Date(item.date_limited + "T00:00:00").toLocaleDateString()}</strong></>}
                                    <br />
                                    <span><strong>Status:</strong> {item.completed ? "Concluída" : "Em andamento"}</span>
                                </p>
                            </div>
                            <div className="task-buttons">
                                <button className="button view" onClick={() => navigate(`/tarefas/${item.id}`)}>Ver</button>
                                <button className="button edit" onClick={() => navigate(`/tarefas/${item.id}/editar`)}>Editar</button>
                                <button className="button delete" onClick={() => handleExcluir(item.id)}>Excluir</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma tarefa encontrada.</p>
                )}
            </div>

            <div className="new-task-container">
                <button className="button new" onClick={() => navigate(`/tarefas/nova`)}>Nova tarefa</button>
            </div>
        </div>
    );
}