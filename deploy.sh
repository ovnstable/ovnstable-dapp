#!/bin/bash


token=$1
url=$2
stand=$3
dockerComposePath="/root/common/docker-compose.yaml"


if [ "$stand" = "prod" ]
then
  nameDapp="dapp"
  build="build-production"
  tag="1"
elif [ "$stand" = "dev" ]
then
  nameDapp="dapp-dev"
  build="build-dev"
  tag="dev"
elif [ "$stand" = "avax-prod" ]
then
  nameDapp="dapp-avax"
  build="build-avax-prod"
  tag="avax"
elif [ "$stand" = "bsc-prod" ]
then
  nameDapp="dapp-bsc"
  build="build-bsc-prod"
  tag="bsc"
else
  exit
fi

echo "$nameDapp"

rm -rf dist/
npm run $build

docker build . -t cr.yandex/crpg11k469bhc8lch9gm/overnight/dapp:$tag

docker login \
         --username oauth \
         --password $token \
        cr.yandex

docker push  cr.yandex/crpg11k469bhc8lch9gm/overnight/dapp:$tag


ssh $url docker login \
         --username oauth \
         --password $token \
        cr.yandex

ssh $url docker pull cr.yandex/crpg11k469bhc8lch9gm/overnight/dapp:$tag
ssh $url docker-compose -f $dockerComposePath up -d --no-deps $nameDapp




