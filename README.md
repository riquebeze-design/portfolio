# Portfolio Application

This is a full-stack portfolio application with a public frontend and a protected admin panel.

## Project Structure

- `/frontend`: React (Vite, TypeScript) application with Tailwind CSS and React Router.
- `/backend`: Node.js (Express, TypeScript) API with Prisma ORM and SQLite (easily migratable to PostgreSQL).
- `/backend/uploads`: Directory for local image storage.

## Tech Stack

**Frontend:**
- React 19 (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Shadcn/ui components

**Backend:**
- Node.js (Express)
- TypeScript
- Prisma ORM (SQLite for development, PostgreSQL ready)
- JWT for authentication
- Multer for local image uploads
- Zod for input validation
- Express Rate Limit for API protection

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Copy the contents of `.env.example` to a new file named `.env` in the `backend` directory and fill in the values.

    ```
    DATABASE_URL="file:./dev.sqlite"
    JWT_SECRET="your_strong_jwt_secret_key_here" # IMPORTANT: Change this to a strong, random string
    ADMIN_EMAIL="admin@example.com" # Initial admin user email
    ADMIN_PASSWORD="adminpassword" # Initial admin user password (change this!)
    FRONTEND_URL="http://localhost:8080" # Or your frontend domain in production
    ```

4.  **Generate Prisma client and run migrations:**
    This will create the `dev.sqlite` database file and seed an initial admin user (if not already present) and two example works.
    ```bash
    npx prisma migrate dev --name initial_setup
    npm run prisma:seed
    ```
    *Note: If you change `ADMIN_EMAIL` or `ADMIN_PASSWORD` in `.env` after the first seed, you'll need to manually update the user in the database or delete `dev.sqlite` and re-run `prisma migrate dev` and `npm run prisma:seed`.*

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The backend API will be running on `http://localhost:3000` (or your specified `PORT`).

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Copy the contents of `.env.example` to a new file named `.env` in the `frontend` directory and fill in the values.

    ```
    VITE_API_URL="http://localhost:3000/api" # Or your backend API URL in production
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be running on `http://localhost:8080` (or your specified `PORT`).

## Admin Panel Access

-   **Login URL:** `http://localhost:8080/admin/login` (after frontend is running)
-   **Credentials:** Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the `backend/.env` file.

## API Endpoints

### Public Endpoints

-   `GET /api/works?status=published&search=&category=&type=&page=&limit=`
-   `GET /api/works/:slug`
-   `POST /api/leads`

### Admin Endpoints (JWT Required)

-   `POST /api/auth/login`
-   `GET /api/admin/stats`
-   `GET /api/admin/works`
-   `GET /api/admin/works/:id`
-   `POST /api/admin/works`
-   `PUT /api/admin/works/:id`
-   `DELETE /api/admin/works/:id`
-   `POST /api/admin/uploads` (for single/multi image upload)
-   `GET /api/admin/leads?startDate=&endDate=&page=&limit=`
-   `DELETE /api/admin/leads/:id`

## Deployment

The project is structured for easy deployment. You can build and deploy the `frontend` and `backend` separately.

-   **Backend Build:** `cd backend && npm run build`
-   **Frontend Build:** `cd frontend && npm run build`

## Customization

-   **Database:** To switch from SQLite to PostgreSQL, update the `DATABASE_URL` in `backend/.env` to your PostgreSQL connection string and re-run `npx prisma migrate dev`.
-   **Image Storage:** The current setup uses local storage (`backend/uploads`). To integrate with S3/Cloudinary, you would modify `backend/src/routes/admin/upload.routes.ts` and potentially `backend/src/controllers/admin/work.admin.controller.ts` to handle external storage URLs.