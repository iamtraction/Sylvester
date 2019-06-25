all: deps build

build:
	@echo "Cleaning transpiled files..."
	@rm -rf commands listeners typings sylvester.js sylvester.js.map

	@echo "Transpiling files..."
	@yarn transpile

deps:
	@echo "Reinstalling dependencies..."
	@rm -rf yarn.lock package-json.lock node_modules
	@yarn install

run:
	@yarn start
