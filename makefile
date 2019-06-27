all: run

build:
	@echo "Cleaning transpiled files..."
	@rm -rf commands listeners typings sylvester.js sylvester.js.map

	@echo "Transpiling files..."
	@yarn transpile

deps:
	@echo "Installing dependencies..."
	@rm -rf yarn.lock package-json.lock node_modules
	@yarn install

init:
	@echo "Initializing Sylvester..."
	@cp ./settings/configurations.example.yaml ./settings/configurations.yaml
	@cp ./settings/credentials.example.yaml ./settings/credentials.yaml
	@mkdir data

	deps

run:
	@yarn start
