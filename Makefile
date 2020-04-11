all: build push

build:
	ng build
	docker build --tag yfsoftcom/try-influx .

push:
	docker push yfsoftcom/try-influx

dev:
	ng serve --open

run:
	docker run -p "8080:80" -d yfsoftcom/try-influx
