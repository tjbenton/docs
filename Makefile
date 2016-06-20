MAKEFLAGS = -j1
PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash
args = $(filter-out $@, $(MAKECMDGOALS))

export NODE_ENV = test

.PHONY: clean build bootstrap

clean:
	rm -rf -- packages/*/*dist/

deep-clean:
	make clean
	rm -rf node_modules/ packages/*/node_modules

rebuild:
	make deep-clean
	make bootstrap
	make build

build:
	fly

watch:
	fly watch

bootstrap:
	npm i
	lerna bootstrap

test:
	cd packages/docs-parser; npm test
