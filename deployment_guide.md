# Deployment Guide: Mana Desi-Licious

This guide explains how to deploy your full-stack application to professional hosting platforms so it can be accessed by customers worldwide.

## Recommended Platform: Render.com
Render is excellent for small-to-medium full-stack apps because it handles both Java and static sites reliably for free/low-cost.

### 1. Prepare for Backend (Java)
1. **GitHub**: Push your `backend` folder to a GitHub repository.
2. **Render**:
   - Create a new **Web Service**.
   - Connect your Repo.
   - **Language**: Docker (using the `Dockerfile` I created).
   - **Build Command**: `mvn clean package -DskipTests` (if prompted, otherwise Docker handles it).
   - **Environment Variables**:
     - `ADMIN_USERNAME`: your-admin-user
     - `ADMIN_PASSWORD`: your-secure-password
3. **Outcome**: You will get a URL like `https://mana-backend.onrender.com`.

### 2. Prepare for Frontend (React)
1. **GitHub**: Push your `frontend` folder.
2. **Render**:
   - Create a new **Static Site**.
   - Connect your Repo.
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Use your Backend URL from Step 1 (e.g., `https://mana-backend.onrender.com`).
3. **Outcome**: You will get your public website URL like `https://mana-foods.onrender.com`.

## Alternative: All-in-One Docker
If you have a VPS (Virtual Private Server), you can use the `docker-compose.yml` file I updated:

```bash
# Simply run this on your server
docker-compose up -d --build
```

## Production Checklist 🔍
- [ ] **Images**: Your images are currently stored in a local `uploads/` folder. For large-scale production, we should migrate this to AWS S3 or Cloudinary.
- [ ] **Database**: We are currently using **H2** (In-memory). For production, you should add a Postgres database (Render provides these for free). I have prepared the `docker-compose` to support this transition.
- [ ] **CORS**: I have already enabled Global CORS on the backend to allow your frontend to talk to it regardless of the domain name.
