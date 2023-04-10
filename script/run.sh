export WS_URL=ws://172.22.11.2:38080
yarn install
yarn webpack-dev-server --hot --open --env WS_URL=$WS_URL