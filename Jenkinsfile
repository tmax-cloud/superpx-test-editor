echo BUILD_MODE
echo REGISTRY
echo REGISTRY_PATH
echo IMAGE_NAME
echo TAG
echo USER
echo PASS

yarn install
yarn webpack
docker build -t IMAGE_FULL_NAME -f ./docker/Dockerfile .
docker login REGISTRY -u USER -p PASS
docker push IMAGE_FULL_NAME
