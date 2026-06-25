# Pokémon Market - Full-Stack Application

A comprehensive full-stack e-commerce and trading card platform for Pokémon cards, built using **Angular 18** and **Laravel 10** with a local **SQLite** database.

The application has been fully translated, audited, and optimized. The database seeder supports downloading and populating over **18,000 Pokémon cards** and **170+ card sets** from the official Pokémon TCG API.

---

## 📂 Project Structure

This repository is organized as a monorepo:
*   **`frontend/`**: The Angular 18 client application styled with Tailwind CSS.
*   **`backend/`**: The Laravel 10 REST API backend.

---

## 🔌 Backend Setup (Laravel API)

The backend is built with Laravel and is pre-configured to use a local **SQLite** database. You do not need to install or configure any database servers (like MySQL or PostgreSQL).

### Prerequisites
*   **PHP** (version 8.1, 8.2, or 8.3)
    *   *Note for Windows users:* Ensure the following extensions are enabled in your `php.ini`: `openssl`, `zip`, `pdo_sqlite`, `sqlite3`, `mbstring`, `fileinfo`, `curl`.
*   **Composer** (PHP package manager)

### Setup Steps
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    # Or 'php composer.phar install' if Composer is not installed globally
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
    *   Copy the template environment file:
        ```bash
        cp .env.example .env
        ```
    *   Open the newly created `.env` file and set the **`DB_DATABASE`** variable to the **absolute path** of your `database.sqlite` file. For example:
        ```env
        DB_DATABASE=C:\path\to\your\project\Amazon-t\backend\database\database.sqlite
        ```
        *(On Windows, make sure to include the drive letter and use backslashes or forward slashes consistently.)*

5.  **Generate the application key:**
    ```bash
    php artisan key:generate
    ```

6.  **Run database migrations and seed the database:**
    This will create all database tables and automatically download and populate the database with users, sets (categories), cards (over 18,000 cards), products, and transactions.
    ```bash
    php artisan migrate:fresh --seed
    ```
    > [!NOTE]  
    > The card seeder is memory-optimized to handle the large dataset (18,000+ cards) by utilizing manual garbage collection and chunked database upserts to prevent PHP memory exhaustion. It also automatically bypasses SSL certificate issues using secure stream options.

7.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
    The API backend will run at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## 💻 Frontend Setup (Angular)

The frontend is built using Angular 18 and Tailwind CSS, featuring an intuitive dashboard, shopping cart, card browser, and admin management console.

### Prerequisites
*   **Node.js** (LTS version, v18 or v20 recommended)
*   **npm** (Node package manager)

### Setup Steps
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install npm dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The frontend client will run at [http://localhost:4200](http://localhost:4200).

---

## 🚀 Running the Application

Once both servers are running:
1.  Open your browser and navigate to [http://localhost:4200](http://localhost:4200).
2.  The Angular frontend will automatically connect to the Laravel API at `http://localhost:8000/api`.
3.  You can register a new account or log in as an administrator to manage card products, view sales statistics, handle support tickets, and process orders.

### Features Included
*   **Card Browser & Filter:** Real-time search and filter across all 18,000+ seeded Pokémon cards.
*   **Product Listings:** Turn cards into listed products for sale.
*   **Shopping Cart & Payments:** Fully functional shopping cart with checkout and payment logging.
*   **Admin Console:** Dashboard featuring sales statistics, user management, and product listings control.
*   **Support Ticket System:** Integrated customer support ticketing system for user inquiries.
*   **Fully Unified Language:** The entire application (UI, code comments, logs, and API JSON responses) is standardized in English.
