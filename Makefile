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
	npm install
	make build

build:
	fly

watch:
	fly watch

bootstrap:
	lerna bootstrap

test:
	ava args

lint:
	eslint '**/*.js'

ci-test:
	make lint
	make build
	ava
