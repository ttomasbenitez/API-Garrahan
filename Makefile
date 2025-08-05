.PHONY: build up down logs test clean lint update-lock

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

test:
	npm test

clean:
	docker-compose down --rmi all --volumes --remove-orphans

lint:
	docker-compose run --rm app npm run lint

lint-fix:
	docker-compose run --rm app npx eslint . --fix

update-lock:
	docker-compose run --rm app npm install --package-lock-only
