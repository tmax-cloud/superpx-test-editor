export WS_URL=ws://172.22.11.2:38080
export SUPER_PX_VERSION=super-px-0.1.8.1
yarn install
yarn webpack-dev-server --hot --open --env WS_URL=$WS_URL --env SUPER_PX_VERSION=$SUPER_PX_VERSION