# QuizHub

Full-stack aplikacija za kvizove napravljena sa **React + Vite** (frontend) i **ASP.NET Core** (backend) koristeci **SQL Server** sa EF Core migracijama.

---

## Brzi start

### 1. Backend

1. Udji u backend folder:
   ```bash
   cd quizhub-backend

2. Podesi appsettings.json sa connection string-om za SQL Server.

3. Napravi i primeni EF Core migracije lokalno:
    ```bash
    dotnet ef migrations add InitialCreate
    dotnet ef database update

4. Pokreni backend:
    ```bash
    dotnet run

### 2. Frontend

1. Udji u frontend folder:
    ```bash
    cd quizhub-frontend

2. Instaliraj zavisnosti:
    ```bash
    npm install

3. Kreiraj .env fajl i podesite URL backend API-ja.

4. Pokreni frontend:
    ```bash
    npm run dev