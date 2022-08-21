const API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYXZpYW5sdWtAZ21haWwuY29tIiwiaWQiOjE0MDcsIm5hbWUiOm51bGwsInN1cm5hbWUiOm51bGwsImlhdCI6MTY2MDg5NDEzMywiZXhwIjoxMTY2MDg5NDEzMywiaXNzIjoiZ29sZW1pbyIsImp0aSI6IjkzMTJkNDcxLTlmZDEtNDczNC04YmY5LWZkNmNjYTQ2ODQ5YiJ9.AWzqDvnGWCn3Y-yhY1bfkYl6mo35Ij6k18KMvj44UZk"
const baseAPIpath = "https://api.golemio.cz/v2"
const customAPIpath = "https://taborapi.fireup.studio"
let stopsByZone = [];
let timer;
function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.setRequestHeader("X-Access-Token",API_key);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getStopsInZone(ev) {
    document.querySelector("select#stops-select").replaceChildren()
    let stopsInZone = [...new Set(stopsByZone[ev.target.value].map(x => x['properties']['stop_name']))]
    console.log(stopsInZone)
    for (let stop of stopsInZone.sort()) {
        let opt = document.createElement('option');
        opt.innerHTML = stop;
        opt.value = stop;
        document.querySelector("select#stops-select").appendChild(opt)
    }
}

function getDepartures(ev) {
    clearInterval(timer)
    document.getElementById('odjezdy').replaceChildren()
    console.log(ev.target.value)
    updateDepartures(ev.target.value)
    timer = setInterval(updateDepartures.bind(null, ev.target.value),20*1000)
}

function updateDepartures(stop) {
    let departures = JSON.parse(httpGet(baseAPIpath+"/pid/departureboards?names[]="+stop))
    console.log(departures)
    document.getElementById('odjezdy').replaceChildren()
    for (let departure of departures['departures']) {
        let odjezd = document.createElement('tr')
        let linka = document.createElement('th')
        linka.innerHTML = departure['route']['short_name']
        let smer = document.createElement('td')
        smer.innerHTML = departure['trip']['headsign']
        let stanoviste = document.createElement('td')
        stanoviste.innerHTML = departure['route']['type'] == 1 ? "Kolej " + departure['stop']['platform_code'] : departure['stop']['platform_code']
        let do_odjezdu = document.createElement('td')
        do_odjezdu.innerHTML = departure['departure_timestamp']['minutes']
        let cas_odjezdu = document.createElement('td')
        cas_odjezdu.innerHTML = new Date(Date.parse(departure['departure_timestamp']['predicted'])).toLocaleTimeString()
        odjezd.appendChild(linka)
        odjezd.appendChild(smer)
        odjezd.appendChild(stanoviste)
        odjezd.appendChild(do_odjezdu)
        odjezd.appendChild(cas_odjezdu)
        document.getElementById('odjezdy').appendChild(odjezd)
    }
}

window.onload = function (ev) {
    stopsByZone = JSON.parse(httpGet(customAPIpath + "/getStopsByZones"))
    console.log(stopsByZone)
    console.log(Object.keys(stopsByZone))
    for (let zone in stopsByZone) {
        let opt = document.createElement('option');
        opt.innerHTML = opt.value = zone;
        document.querySelector("select#zone-select").appendChild(opt)
    }
    document.querySelector("select#zone-select").addEventListener("change",getStopsInZone)
    document.querySelector("select#stops-select").addEventListener("change",getDepartures)
}

