export default async function loadJSON(file) {
    return await fetch(file, {method: 'GET'})
            .then((response) => { return response.json(); })
}