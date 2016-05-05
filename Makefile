# MAKEFLAGS = -j1
bin = $(PWD)/node_modules/.bin
export NODE_ENV = test

.PHONY: clean build bootstrap

bootstrap:
	npm i
	$(bin)/lerna bootstrap
