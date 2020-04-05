all: build

build:
	ng build
	docker build --tag yfsoftcom/try-influx .

dev:
	ng serve --open

run:
	docker run -p "8080:80" -d yfsoftcom/try-influx
