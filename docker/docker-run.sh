export WS_URL=ws://172.22.11.2:38080
export SUPER_PX_VERSION=super-px-0.1.8.1

docker run -e WS_URL=$WS_URL -e SUPER_PX_VERSION=$SUPER_PX_VERSION -p 80:80 $IMAGE_NAME
