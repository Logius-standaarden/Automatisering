URL_TO_CHECK="$1"

echo "Checking $URL_TO_CHECK"

muffet \
    --exclude 'gitdocumentatie\.logius\.nl\/publicatie\/\w+\/\w+\/\d+\.\d+\.\d+' \
    --exclude 'upwork.com' \
    --exclude 'sitearchief.nl' \
    --exclude 'opengis.net' \
    --exclude 'https://creativecommons.org/licenses/by/4.0/legalcode' \
    --exclude 'https://www.nen.nl/' \
    --exclude 'http://iso6523.info/' \
    --exclude 'github.com\/[^\/]+\/[^\/]+\/commits' \
    --header 'user-agent:Curl' \
    --ignore-fragments \
    --one-page-only \
    --format=json \
    --buffer-size 8192 \
    $URL_TO_CHECK
