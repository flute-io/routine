.PHONY: test

clean:
	git clean -fxd -e .idea -e .env

install:
	npm install

build:
	npm run build

dev:
	npm run dev

lint:
	npm run lint

lint-w:
	npm run lint:w

test:
	npm test

test-w:
	npm run test:w
