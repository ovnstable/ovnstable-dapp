#!/bin/bash


token=$1
url=$2
stand=$3
dockerComposePath="/home/ubuntu/docker-compose.yaml"
zoneId=$4
apiKey=$5

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
else
  exit
fi

echo "$nameDapp"

rm -rf dist/
npm run $build

docker build . -t cr.yandex/crp6lhbprjft0c8fhg61/overnight/dapp:$tag --platform linux/amd64

docker login \
         --username oauth \
         --password $token \
        cr.yandex

docker push  cr.yandex/crp6lhbprjft0c8fhg61/overnight/dapp:$tag


ssh $url docker login \
         --username oauth \
         --password $token \
        cr.yandex

ssh $url docker pull cr.yandex/crp6lhbprjft0c8fhg61/overnight/dapp:$tag
ssh $url docker-compose -f $dockerComposePath up -d --no-deps $nameDapp

# Reset cache on Cloudflare
# Affects all domains

curl --request POST \
  --url https://api.cloudflare.com/client/v4/zones/$zoneId/purge_cache \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $apiKey" \
  --data '{
  "purge_everything": true
}'
