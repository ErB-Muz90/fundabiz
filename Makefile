.PHONY: dev up down migrate seed health test lint build clean

# ─── Development ─────────────────────────────────────
dev:
	docker-compose up --build -d
	@echo "Waiting for services to be healthy..."
	@sleep 10
	@make health

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# ─── Database ────────────────────────────────────────
migrate:
	@cd backend && go run ./cmd/migrate/main.go

seed:
	@cd backend && go run ./cmd/seed/main.go

migrate-down:
	@cd backend && go run ./cmd/migrate/main.go --down

reset:
	@cd backend && go run ./cmd/migrate/main.go --reset && make seed

# ─── Backend ─────────────────────────────────────────
health:
	@echo "Checking all services..."
	@for port in 4000 4001 4002 4003 4004 4005 4006 4007 4008 4009 4010 4011; do \
		status=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$$port/health 2>/dev/null || echo "000"); \
		if [ "$$status" = "200" ]; then \
			echo "  ✅ :$$port — healthy"; \
		else \
			echo "  ❌ :$$port — $$status"; \
		fi; \
	done

test:
	@cd backend && go test ./... -v -count=1

lint:
	@cd backend && golangci-lint run ./...

# ─── Build ───────────────────────────────────────────
build-backend:
	@for svc in gateway auth loan escrow wallet mpesa kyc fraud notification repayment tracking ussd; do \
		echo "Building $$svc..."; \
		cd backend && GOOS=linux go build -o bin/$$svc ./cmd/$$svc/; \
	done

build-web:
	@cd apps/web && npm run build

build-mobile:
	@cd apps/mobile-agent && npx expo export --platform android

# ─── Docker ──────────────────────────────────────────
docker-build:
	@for svc in gateway auth loan escrow wallet mpesa kyc fraud notification repayment tracking ussd web; do \
		echo "Building docker: $$svc"; \
		docker-compose build $$svc; \
	done

docker-push:
	@echo "Tag and push images to your registry..."

# ─── Production ──────────────────────────────────────
prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# ─── Cleanup ─────────────────────────────────────────
clean:
	docker-compose down -v
	rm -rf backend/bin/
	@echo "Cleaned all volumes and binaries"
