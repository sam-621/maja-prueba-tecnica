# majablog

Monorepo full-stack:

- **`apps/api`** — Express 5 + TypeORM + PostgreSQL (puerto `4000`)
- **`apps/client`** — React 19 + Vite (puerto `5173`)

## Levantar todo con Docker

Todos los servicios (base de datos + API + cliente) se levantan con **un solo comando**:

```bash
docker compose up --build
```

Luego abre **http://localhost:5173**.

| Servicio   | URL                   | Detalle                                               |
| ---------- | --------------------- | ----------------------------------------------------- |
| `client`   | http://localhost:5173 | SPA (build de Vite servido con nginx)                 |
| `api`      | http://localhost:4000 | Express + TypeORM                                     |
| `postgres` | `localhost:5432`      | base `maja`, datos persistidos en el volumen `pgdata` |

> **Nota:** si tienes servicios de desarrollo corriendo en los puertos `4000`,
> `5432` o `5173`, deténlos antes para evitar conflictos de puerto.

## Desarrollo (sin Docker)

```bash
# API
cd apps/api && yarn install && yarn dev

# Client
cd apps/client && yarn install && yarn dev
```

La API lee su configuración de `apps/api/.env.local` y el cliente de
`apps/client/.env.local` (`VITE_API_URL`).
