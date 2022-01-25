#!/bin/bash


token=$1
url=$2
stand=$3
tag=1



if [ "$stand" = "prod" ]
then
  nameDapp="dapp"
  deployments="polygon"
  build="build-production"
  dockerComposePath="/root/ovn/docker-compose.yaml"
elif [ "$stand" = "dev" ]
then
  nameDapp="dapp-dev"
  deployments="polygon_dev"
  build="build-dev"
  dockerComposePath="/root/ovn-dev/docker-compose.yaml"
else
  exit
fi

echo "$nameDapp"
echo "$deployments"


npm run $build

docker build . -t cr.yandex/crpg11k469bhc8lch9gm/overnight/$nameDapp:$tag

docker login \
         --username oauth \
         --password $token \
        cr.yandex

docker push  cr.yandex/crpg11k469bhc8lch9gm/overnight/$nameDapp:$tag


ssh $url docker login \
         --username oauth \
         --password $token \
        cr.yandex

ssh $url docker pull cr.yandex/crpg11k469bhc8lch9gm/overnight/$nameDapp:$tag
ssh $url docker-compose -f $dockerComposePath up -d --no-deps $nameDapp


ssh $url docker logs ovn-$nameDapp -f


