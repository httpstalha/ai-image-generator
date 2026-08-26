.PHONY: all dev build start lint clean

# Default target runs when typing just 'make'
all: dev

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

clean:
	rm -rf .next
