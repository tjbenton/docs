MAKEFLAGS = -j1
PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash
args = $(filter-out $@, $(MAKECMDGOALS))

export NODE_ENV = test

.PHONY: clean build bootstrap

clean:
	rm -rf -- packages/*/dest packages/*/node_modules

build:
	gulp build

watch:
	gulp watch

bootstrap:
	npm i
	lerna bootstrap
