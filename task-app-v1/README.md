# Devtiro Task App Build (V1 - 2024)

Reference source code. This repo contains the project as-built in the Devtiro Task App build video.

The Task App is a todo list application built with Spring Boot and PostgreSQL, with a React frontend.

## The Build Guide

The full step-by-step write-up of the build lives in [docs/task-app-combined.md](docs/task-app-combined.md).
It covers the project brief, the domain and API design, and then builds the backend up endpoint by
endpoint.

## What's In This Repo

| Directory          | Contents                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `docs/`            | The build guide and its images                                            |
| `backend-new/`     | The skeleton Spring Boot project, as generated — start here to follow along |
| `backend/`         | The backend as built in the video                                         |
| `frontend/`        | The React frontend, provided for you to interact with the backend        |

## Running It

You'll need JDK 21, Node 20 or later, and Docker.

```bash
# Start PostgreSQL and run the backend
cd backend
docker compose up -d
./mvnw spring-boot:run

# Run the frontend, in a second terminal
cd frontend
npm install
npm run dev
```

If you're following the guide from `backend-new`, you'll create the `docker-compose.yml` for
PostgreSQL yourself as part of the build — see the "Run PostgreSQL" section.

The frontend is then available at http://localhost:5173/ and proxies API calls to the backend on port
8080.

> [!WARNING]
> This project is pinned to **Java 21** and **Spring Boot 3.3.5**. It was built and tested against
> those versions only. Newer versions of Spring Boot and Java may require changes to the code and
> configuration in this repo, and the guide's instructions may no longer match what you see.

> [!IMPORTANT]
> This is a teaching project. It's written to demonstrate how a Spring Boot application is designed
> and built, following the same practices I'd use on real work — a layered architecture, DTOs and
> mappers at the API boundary, constructor injection, and centralised error handling.
>
> That said, it was built live, and its scope is deliberately limited to what the build covers. It
> may contain bugs, and some things a production system would need — authentication, comprehensive
> input validation, a full test suite — are out of scope by design rather than by oversight.

## Licence

This repo is licensed in two parts.

**The code** — `backend-new/`, `backend/` and `frontend/` — is [MIT licensed](LICENSE).
Use it, change it, build on it, no strings attached.

**The build guide** — everything in [`docs/`](docs/LICENSE) — is licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You're welcome to share it,
translate it, and build on it, but please credit Devtiro, don't sell it or put it behind a paywall,
and keep any adaptations under the same licence.

Copyright © 2024 Devtiro Ltd.
