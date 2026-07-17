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

## Arquitectura y decisiones técnicas

El proyecto es un **monorepo** con dos apps independientes (`apps/api` y `apps/client`) que se comunican por HTTP.

Express 5 + TypeORM + PostgreSQL, con una organización por capas pensada para que agregar features sea mecánico y predecible, sin tanta abstracción (capa de delivery, persistencia, negocio) por practicidad y la dimension del proyecto

las rutas están envueltas en un sistema de clases (`Router` y `Endpoint`) obteniendo con esto

1. **Normalización de la respuesta de las rutas**: Cada throw dentro de un proceso (endpoint) se traduce a una respuesta http normalizada
2. **Predictibilidad en la creación de features**: Cada endpoint usa el mismo molde, haciendo así predecible la forma de crear código en el proyecto haciendolo más facil de trabajar

### Modelo de datos

`User → Posts (1:N)`, `Post ↔ Categories (N:M)`, `Post → Comments (1:N)`. Dos decisiones deliberadas:

- El `status` del blog se guarda como `varchar` y no como enum de Postgres, para que agregar un nuevo estado **no requiera una migración**.
- El `slug` se genera del título y se desambigua por sufijo (`titulo`, `titulo-2`, …), con índice único en BD.
