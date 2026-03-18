# Docker Setup (Backend + Frontend + MongoDB + Redis)

This setup runs your full project together using Docker Compose.

## 1) Prerequisites

- Docker Desktop installed and running
- You are in project root: `practice/`

## 2) Create Docker env

```bash
cp .env.docker.example .env
```

Edit `.env` and set at least:

- `JWT_SECRET` (strong value)

For local Mac, keep:

- `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
- `FRONTEND_URL=http://localhost:3005`
- `FRONTEND_HOST_PORT=3005`

## 3) Build and run all services

```bash
docker compose up --build -d
```

Services started:

- Frontend: http://localhost:3005
- Backend API: http://localhost:5001
- MongoDB: localhost:27017
- Redis: localhost:6379

Health check:

```bash
curl http://localhost:5001/api/health
```

## 4) View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
docker compose logs -f redis
```

## 5) Stop everything

```bash
docker compose down
```

To also remove volumes/data:

```bash
docker compose down -v
```

## 6) EC2-like usage notes

On EC2, update `.env` before build:

- `NEXT_PUBLIC_API_URL=http://<EC2_PUBLIC_IP>:5001/api`
- `FRONTEND_URL=http://<EC2_PUBLIC_IP>:3005`
- `FRONTEND_HOST_PORT=3005`

Then rebuild frontend (important because `NEXT_PUBLIC_API_URL` is baked at build time):

```bash
docker compose up --build -d
```

## 7) Optional production hardening (next step)

- Add Nginx reverse proxy and serve only port 80/443
- Put backend behind private network (do not expose 5001 publicly)
- Use managed MongoDB/Redis or persistent backups
- Use HTTPS with TLS certificate
