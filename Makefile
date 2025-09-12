export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

.PHONY: build up down logs test clean dev dev-down

# App services
build:
	docker compose -f docker-compose.yaml build

up:
	docker compose --env-file .env.dev -f docker-compose.yaml up -d

down:
	docker compose --env-file .env.dev -f docker-compose.yaml down

logs:
	docker compose --env-file .env.dev -f docker-compose.yaml logs -f

test:
	NODE_ENV=test npm run test

cucumber:
	NODE_ENV=test npm run cucumber

clean:
	docker compose -f docker-compose.yaml down --rmi all --volumes --remove-orphans

# Entorno dev
dev:
	docker compose -f docker-compose.dev.yaml up -d
	docker exec -it dev_env bash

dev-down:
	docker compose -f docker-compose.dev.yaml down
