import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateTodoView from "./pages/CreateTodoView/CreateTodoView.jsx";
import EditTodoView from "./pages/EditTodoView/EditTodoView.jsx";
import LoginView from "./pages/LoginView/LoginView.jsx";
import SignupView from "./pages/SignupView/SignupView.jsx";
import TodoDetailView from "./pages/TodoDetailView/TodoDetailView.jsx";
import TodoListView from "./pages/TodoListView/TodoListView.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route path="/signup" element={<SignupView />} />
                <Route path="/tarefas" element={<TodoListView />} />
                <Route path="/tarefas/nova" element={<CreateTodoView />} />
                <Route path="/tarefas/:id" element={<TodoDetailView />} />
                <Route path="/tarefas/:id/editar" element={<EditTodoView />} />
            </Routes>
        </Router>
    );
}

export default App;