.PHONY: build up down logs test clean

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

test:
	npm test

clean:
	docker compose down --rmi all --volumes --remove-orphans
