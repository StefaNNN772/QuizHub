# QuizHub

Full-stack aplikacija za kvizove napravljena sa **React + Vite** (frontend) i **ASP.NET Core** (backend) koristeći **SQL Server** sa EF Core migracijama.

---

## Brzi start

### 1. Backend

1. Uđi u backend folder:
   ```bash
   cd quizhub-backend

2. Podesi appsettings.json sa connection string-om za SQL Server.

3. Napravi i primeni EF Core migracije lokalno:
    dotnet ef migrations add InitialCreate
    dotnet ef database update

4. Pokreni backend:
    dotnet run

### 2. Frontend

1. Udji u frontend folder:
    cd quizhub-frontend

2. Instaliraj zavisnosti:
    npm install

3. Kreiraj .env fajl i podesite URL backend API-ja.

4. Pokreni frontend:
    npm run dev