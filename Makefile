all: build

build:
  ng build

docker:
  docker build --tag yfsoftcom/try-influx .

run:
  docker run -p 8080:80 -d yfsoftcom/try-influx
