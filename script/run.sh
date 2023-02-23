export WS_URL=ws://172.22.11.2:38080
export SERVICE_PREFIX=super-px-0.1.4/com.tmax.scm.service

yarn webpack-dev-server --hot --open --env WS_URL=$WS_URL --env SERVICE_PREFIX=$SERVICE_PREFIX