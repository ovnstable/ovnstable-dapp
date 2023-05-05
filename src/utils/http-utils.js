export default async function loadJSON(url) {
    return await fetch(url, {method: 'GET'})
            .then((response) => { return response.json(); })
}
