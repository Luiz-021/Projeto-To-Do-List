# Guia de Integração da API de Usuários

Este guia explica como utilizar os endpoints relacionados à entidade **User** desta API Django REST, incluindo autenticação JWT. Use este documento para integrar seu front-end (Next.js, React, ou qualquer aplicação JS moderna).

---

## Endpoints Disponíveis

### 1. Cadastro de Usuário

- **Endpoint:** `POST /api/users/`
- **Descrição:** Cria um novo usuário.
- **Body (JSON):**
    ```json
    {
      "username": "novo_usuario",
      "password": "senha_segura",
      "email": "email@exemplo.com",
      "first_name": "Nome",
      "last_name": "Sobrenome"
    }
    ```
- **Autenticação:** Não precisa de token.

---

### 2. Login (Obter Token JWT)

- **Endpoint:** `POST /api/token/`
- **Descrição:** Retorna tokens JWT (`access` e `refresh`) para autenticação.
- **Body (JSON):**
    ```json
    {
      "username": "usuario",
      "password": "senha"
    }
    ```
- **Autenticação:** Não precisa de token.

---

### 3. Listar Usuários

- **Endpoint:** `GET /api/users/`
- **Descrição:**  
  - Superusuário: retorna todos os usuários.
  - Usuário comum: retorna apenas o próprio usuário.
- **Autenticação:**  
  - Necessário enviar o token JWT no header:
    ```
    Authorization: Bearer <access_token>
    ```

---

### 4. Detalhar Usuário

- **Endpoint:** `GET /api/users/<id>/`
- **Descrição:** Retorna os dados do usuário com o id informado (se permitido).
- **Autenticação:**  
  - Necessário enviar o token JWT no header.

---

### 5. Atualizar Usuário

- **Endpoint:** `PUT /api/users/<id>/`
- **Descrição:** Atualiza os dados do usuário.
- **Body (JSON):** (campos iguais ao cadastro)
- **Autenticação:**  
  - Necessário enviar o token JWT no header.

---

### 6. Deletar Usuário

- **Endpoint:** `DELETE /api/users/<id>/`
- **Descrição:** Remove o usuário com o id informado.
- **Autenticação:**  
  - Necessário enviar o token JWT no header.
- **Regras de permissão:**
  - **Usuário comum:** pode deletar apenas a si mesmo (se tentar deletar outro usuário, recebe erro 404 ou 403).
  - **Superusuário:** pode deletar qualquer usuário, inclusive a si mesmo.

---

### 7. Renovar Token

- **Endpoint:** `POST /api/token/refresh/`
- **Descrição:** Retorna um novo token de acesso usando o token de refresh.
- **Body (JSON):**
    ```json
    {
      "refresh": "<refresh_token>"
    }
    ```
- **Autenticação:** Não precisa de token de acesso, apenas do refresh.

---

## Exemplos de Uso no Front-end (JS/Next.js)

### Login e salvar token

```js
const res = await fetch('/api/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await res.json();
localStorage.setItem('access', data.access);
localStorage.setItem('refresh', data.refresh);
```

### Requisição autenticada

```js
const access = localStorage.getItem('access');
const res = await fetch('/api/users/', {
  headers: { 'Authorization': `Bearer ${access}` }
});
const users = await res.json();
```

### Deletar usuário autenticado

```js
const access = localStorage.getItem('access');
const userId = 2; // id do usuário a ser deletado
await fetch(`/api/users/${userId}/`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${access}` }
});
```

### Renovar token

```js
const refresh = localStorage.getItem('refresh');
const res = await fetch('/api/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh })
});
const data = await res.json();
localStorage.setItem('access', data.access);
```

---

## Resumo dos Endpoints

| Método | Endpoint                | Descrição                  | Autenticação             |
|--------|------------------------ |---------------------------|--------------------------|
| POST   | /api/users/             | Cria usuário               | Não                      |
| POST   | /api/token/             | Login (JWT)                | Não                      |
| GET    | /api/users/             | Lista usuários             | Sim (Bearer Token)       |
| GET    | /api/users/<id>/        | Detalha usuário            | Sim (Bearer Token)       |
| PUT    | /api/users/<id>/        | Atualiza usuário           | Sim (Bearer Token)       |
| DELETE | /api/users/<id>/        | Deleta usuário             | Sim (Bearer Token)       |
| POST   | /api/token/refresh/     | Renova token JWT           | Não (usa refresh token)  |

---

**Dica:** Sempre envie o token de acesso no header `Authorization` para rotas protegidas.

---

## Observação sobre deleção

- Usuários comuns podem deletar apenas a si mesmos.
- Superusuários podem deletar qualquer usuário, inclusive a si mesmos.
- Isso está de acordo com a lógica do seu `UserViewSet` e as permissões implementadas.