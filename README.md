# Amazon-t Full-Stack Application

This repository is a monorepo containing both the frontend and backend of the Amazon-t application.

## Project Structure

*   **`frontend/`**: The Angular 18 client application.
*   **`backend/`**: The Laravel 10 API backend.

---

## 🔌 Backend (Laravel API)

The backend is an API built with the Laravel framework. It is configured to use a local **SQLite** database out of the box, meaning you do not need to install or configure any database server (like MySQL).

### Prerequisites
*   **PHP** (version 8.1 or 8.2 or 8.3)
    *   *Note for Windows users:* Ensure the following extensions are enabled in your `php.ini`: `openssl`, `zip`, `pdo_sqlite`, `sqlite3`, `mbstring`, `fileinfo`, `curl`.
*   **Composer** (PHP package manager)

### Setup & Running
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install PHP dependencies:**
    ```bash
    php composer.phar install
    # Or simply 'composer install' if Composer is installed globally
    ```

3.  **Create the local SQLite database file:**
    *   **Windows (PowerShell):**
        ```powershell
        New-Item -ItemType File -Path database\database.sqlite -Force
        ```
    *   **macOS / Linux:**
        ```bash
        touch database/database.sqlite
        ```

4.  **Configure the Environment (`.env`):**
    Create a file named `.env` in the `backend/` root directory and paste the following configuration:
    ```env
    APP_NAME=Laravel
    APP_ENV=local
    APP_KEY=base64:q2rN3hcF1pL8uG8cK8vS7y7T5T5T5T5T5T5T5T5T5T4=
    APP_DEBUG=true
    APP_URL=http://localhost:8000

    LOG_CHANNEL=stack
    LOG_LEVEL=debug

    DB_CONNECTION=sqlite
    DB_DATABASE=absolute_path_to_your_project/backend/database/database.sqlite

    BROADCAST_DRIVER=log
    CACHE_DRIVER=file
    FILESYSTEM_DISK=local
    QUEUE_CONNECTION=sync
    SESSION_DRIVER=file
    SESSION_LIFETIME=120
    ```
    *Important:* Replace `absolute_path_to_your_project` in `DB_DATABASE` with the actual absolute path of the project folder on your computer.

5.  **Generate the application key:**
    ```bash
    php artisan key:generate
    ```

6.  **Run database migrations and seeders:**
    This will create all the database tables and automatically download and populate the database with users, categories, cards, and products:
    ```bash
    php artisan migrate:fresh --seed
    ```

7.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
    The API will run at [http://localhost:8000/api](http://localhost:8000/api).

---

## 💻 Frontend (Angular)

The frontend is built using Angular 18 and Tailwind CSS.

### Prerequisites
*   **Node.js** (LTS version)
*   **npm**

### Setup & Running
1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The frontend will be available at [http://localhost:4200/](http://localhost:4200/).

---

## 🚀 Running Both Simultaneously
Once both servers are running:
*   The Angular client (running at `localhost:4200`) will automatically connect to the Laravel API (running at `localhost:8000`).
*   All features (user registration/login, card browsing, shopping cart, and payment processing) will be fully functional.
