# FundaBiz

**Buy Now, Pay Later for Kenyan SMEs** — A multi-tenant financial platform connecting SMEs, suppliers, field agents, and administrators across all 47 Kenya counties.

## Architecture

```
Frontend (Next.js 14)  ───→  API Gateway (Go)  ───→  Microservices (Go)
                                    │
Mobile (Expo/React Native) ────────┤
                                    │
USSD (*384#) ──────────────────────┤
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Zustand |
| Mobile | Expo (React Native), Zustand |
| Backend | Go (Fiber/Chi), pgx, RabbitMQ |
| Database | PostgreSQL 16, Redis 7 |
| Infra | Docker Compose, Nginx, PgBouncer |

## Services

| Port | Service | Description |
|------|---------|-------------|
| 4000 | Gateway | API Gateway / BFF |
| 4001 | Auth | JWT + RBAC + MFA |
| 4002 | Loan | Loan origination + tranches |
| 4003 | Escrow | Escrow hold/release/dispute |
| 4004 | Wallet | Wallet management + restrictions |
| 4005 | M-Pesa | Daraja API integration |
| 4006 | KYC | Document upload + review pipeline |
| 4007 | Fraud | 5-rule fraud detection engine |
| 4008 | Notification | SMS/Email/Push |
| 4009 | Repayment | 8% auto-deduction worker |
| 4010 | Tracking | Order tracking events |
| 4011 | USSD | Africa's Talking *384# |

## Quick Start

```bash
# Start infrastructure
docker-compose up -d postgres redis rabbitmq pgbouncer

# Run migrations
make migrate

# Seed data
make seed

# Start all services
docker-compose up --build -d

# Verify health
make health
```

## Project Structure

```
fundabiz/
├── apps/
│   ├── web/              # Next.js web app (all portals)
│   └── mobile-agent/     # Expo React Native (field agents)
├── backend/              # Go microservices
│   ├── cmd/              # Service entry points
│   ├── internal/         # Shared packages
│   ├── migrations/       # SQL migrations
│   └── seeds/            # Seed data
└── infra/                # Docker, Nginx, K8s
```

## Development

- `make dev` — Start full stack locally
- `make migrate` — Run database migrations
- `make test` — Run all Go tests
- `make seed` — Seed development data
- `make health` — Check all service health endpoints
