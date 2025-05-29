## Backend - Django REST API

### Descrição

O backend deste projeto foi desenvolvido em **Django** e **Django REST Framework**, fornecendo uma API para autenticação de usuários, gerenciamento de tarefas (ToDoList) e integração com o frontend.

---

### Principais responsabilidades do backend

- Autenticação e autorização de usuários (JWT)
- CRUD de usuários (cadastro, login, atualização, deleção)
- CRUD de tarefas (criação, listagem, atualização, deleção)
- Associação de tarefas ao usuário autenticado
- Validação de permissões (usuário comum só pode acessar/deletar suas próprias tarefas)
- Integração com banco de dados PostgreSQL
- Documentação dos endpoints via README e/ou Swagger/OpenAPI

---

### Como rodar o backend

#### Pré-requisitos

- Docker e Docker Compose instalados
- (Opcional) Python 3.10+ e pip para rodar localmente sem Docker

#### Configuração do ambiente

- Ajuste as variáveis conforme necessário. O arquivo `.env.example` contem configurações para `.env`, mas optamos por substituir o valor das variáveis diretamente.

#### Subindo o backend com Docker


```sh
docker-compose up --build
```


### Acessando a API

- A API estará disponível em: http://localhost:8000/api/

#### Endpoints de autenticação:

- POST /api/token/ (obter token JWT)
- POST /api/token/refresh/ (refresh do token)

#### Estrutura dos principais endpoints
- /api/users/ - CRUD de usuários
- /api/task/ - CRUD de tarefas
- /api/task/user/ - Listagem de tarefas do usuário autenticado

---
### O que é o XSStrike?

XSStrike é uma suíte avançada de detecção de XSS. Ele não apenas verifica parâmetros refletidos, mas também analisa o contexto da injeção, realiza fuzzing com múltiplos payloads, tenta identificar e contornar Web Application Firewalls (WAFs) e filtros de sanitização.

---

## Pré-requisitos

1.  **Python 3.x** instalado na sua máquina.
2.  **Git** instalado para clonar o repositório do XSStrike.

---

## Instalação do XSStrike

1.  **Clone o Repositório:**
    Abra seu terminal e execute:
    ```bash
    git clone [https://github.com/s0md3v/XSStrike.git](https://github.com/s0md3v/XSStrike.git)
    ```

2.  **Navegue até o Diretório:**
    ```bash
    cd XSStrike
    ```

3.  **Instale as Dependências:**
    ```bash
    pip install -r requirements.txt
    ```
---

## Como Usar o XSStrike na ToDo List

### 1. Identificar Pontos de Entrada (Vetores de Ataque)

Os principais locais onde dados inseridos pelo usuário são processados e poderiam levar a XSS (se não tratados corretamente) são os campos nos seus serializadores da API Django:

* **Cadastro de Usuário (`POST /api/users/`):**
    * `username`, `email`, `first_name`, `last_name`
* **Login (`POST /api/token/`):**
    * `username` (menos provável de ser um vetor XSS direto aqui, mas testar entradas é sempre uma boa prática).
* **Criação de Tarefa (`POST /api/task/`):**
    * `title`, `description`
* **Atualização de Tarefa (`PUT /api/task/<id>/`):**
    * `title`, `description`

### 2. Obter o Token de Acesso JWT (do `localStorage`)

A aplicação armazena esse token no `localStorage` após o login.

* **Passo 1:** Faça login na sua aplicação (`http://localhost:3000`) com um usuário de teste.
* **Passo 2:** Abra as "Ferramentas do Desenvolvedor" do seu navegador (geralmente F12).
* **Passo 3:** Vá para a aba "Application".
* **Passo 4:** No menu à esquerda, expanda "Local Storage" e clique na URL da sua aplicação (ex: `http://localhost:3000`).
* **Passo 5:** Encontre a chave `accessToken` e copie o valor associado a ela. Este é o seu token JWT.


### 3. Executando o XSStrike

Navegue até a pasta `XSStrike` no seu terminal para executar os comandos.

* **Comando Base:**
    ```bash
    python xsstrike.py -u "URL" [OPÇÕES]
    ```

* **Opções Importantes:**
    * `-u <URL>`: Especifica a URL do endpoint da API a ser testado.
    * `--data <DADOS>`: Fornece os dados para requisições `POST` ou `PUT`. Para APIs JSON, você passará uma string JSON.
    * `--headers "<NOME_CABECALHO>: <VALOR_CABECALHO>"`: Permite adicionar múltiplos cabeçalhos. Crucial para:
        * `Authorization: Bearer SEU_TOKEN_JWT_AQUI`
        * `Content-Type: application/json` (para a maioria das suas APIs DRF).
    * `--json`: Use esta flag se você estiver enviando dados JSON com a opção `--data`. O XSStrike tentará injetar payloads nos valores dos campos JSON.
    * `--fuzzer`: Ativa o fuzzer do XSStrike, que testa uma gama mais ampla de payloads e técnicas. É **altamente recomendado** para testes mais completos.
    * `--crawl`: Tenta descobrir outros links e formulários a partir da URL base (menos eficaz para SPAs que dependem de roteamento JavaScript).


* **Exemplo: Testando o campo `title` na criação de tarefa (com Fuzzer):**
    Substitua `SEU_TOKEN_JWT_AQUI` pelo token que você copiou do `localStorage`.
    ```bash
    python xsstrike.py -u "http://localhost:3000/tarefas/?name=teste" --headers "Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDUxODkwLCJpYXQiOjE3NDg0NTk4OTAsImp0aSI6IjgwZTZlOTJlMmQwODQ5Y2RiNjcxNDdlY2NhY2M1OTI3IiwidXNlcl9pZCI6Mn0.9Trs6cs5FL0hx8tu3HUSHCjcix5371VIkWd2j9grlEY" --fuzzer
    ```
    O XSStrike tentará substituir `"--fuzzer"` (ou outros valores no JSON) por vários payloads XSS e analisará a resposta da API.

### 4. Interpretando as Saídas do XSStrike

O XSStrike fornecerá feedback sobre os payloads que ele tenta. Você mencionou duas saídas comuns:

* **`[passed]`**:
    * Isso significa que o payload enviado pelo XSStrike **passou por quaisquer filtros ou WAFs detectados (ou se não houver nenhum) e foi enviado à aplicação para processamento.**
    * **Importante:** `[passed]` **NÃO** significa que uma vulnerabilidade XSS foi explorada com sucesso. Apenas indica que o payload não foi bloqueado prematuramente. Você ainda precisa verificar se o payload, uma vez processado pela aplicação e potencialmente refletido/armazenado, de fato executa no contexto do navegador.

* **`[filtered]`**:
    * Isso sugere que o XSStrike detectou que seu payload foi **bloqueado ou modificado por um filtro de segurança ou WAF** antes que pudesse atingir o ponto de vulnerabilidade esperado ou ser refletido de forma útil.
    * Pode indicar que alguma proteção está em vigor, mas não garante que a proteção seja infalível contra todos os vetores.

---
