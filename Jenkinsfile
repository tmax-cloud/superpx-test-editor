yarn install
yarn webpack
docker build -t REGISTRY_PATH/IMAGE_NAME:TAG -f ./docker/Dockerfile .
docker login REGISTRY -u USER -p PASS
docker push REGISTRY_PATH/IMAGE_NAME:TAG
