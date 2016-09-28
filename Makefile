MAKEFLAGS = -j1
PATH := $(npm bin):$(PATH)
SHELL := /bin/bash
args = $(filter-out $@, $(MAKECMDGOALS))

export NODE_ENV = test

.PHONY: clean build bootstrap

bootstrap:
	lerna bootstrap

build:
	fly

ci-test:
	make lint
	make build
	ava

clean:
	rm -rf -- packages/*/*dist/

deep-clean:
	make clean
	rm -rf packages/*/node_modules
	rm -rf *.log packages/*/*.log
	rm -rf .DS_Store packages/*/.DS_Store

install:
	npm install
	make boostrap

lint:
	eslint 'flyfile.js' 'scripts/**/*' 'packages/*/+(app|public|src|tools)/**/*.js'

publish:
	make clean
	make build
	make test
	lerna publish --npm-tag=latest --force-publish=*

prerelease:
	make clean
	make build
	make test
	lerna publish --npm-tag=prerelease --force-publish=*

rebuild reinstall:
	rm -rf node_modules
	make deep-clean
	npm install
	make build

test:
	ava $(args)

watch:
	fly watch
