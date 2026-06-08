.PHONY: build test lint migrate seed clean

BIN_DIR := bin
SERVICES := gateway auth loan escrow wallet mpesa kyc fraud notification repayment tracking ussd

build:
	@mkdir -p $(BIN_DIR)
	@for svc in $(SERVICES); do \
		echo "Building $$svc..."; \
		go build -o $(BIN_DIR)/$$svc ./cmd/$$svc/; \
	done

test:
	go test ./... -v -count=1 -race

lint:
	golangci-lint run ./...

migrate:
	go run ./cmd/migrate/main.go

seed:
	go run ./cmd/seed/main.go

migrate-down:
	go run ./cmd/migrate/main.go --down

reset: migrate-down migrate seed

clean:
	rm -rf $(BIN_DIR)

deps:
	go mod tidy
	go mod vendor

.PHONY: $(SERVICES)
$(SERVICES):
	go build -o $(BIN_DIR)/$@ ./cmd/$@/
