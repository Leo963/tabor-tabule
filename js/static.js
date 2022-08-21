const API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYXZpYW5sdWtAZ21haWwuY29tIiwiaWQiOjE0MDcsIm5hbWUiOm51bGwsInN1cm5hbWUiOm51bGwsImlhdCI6MTY2MDg5NDEzMywiZXhwIjoxMTY2MDg5NDEzMywiaXNzIjoiZ29sZW1pbyIsImp0aSI6IjkzMTJkNDcxLTlmZDEtNDczNC04YmY5LWZkNmNjYTQ2ODQ5YiJ9.AWzqDvnGWCn3Y-yhY1bfkYl6mo35Ij6k18KMvj44UZk"
const baseAPIpath = "https://api.golemio.cz/v2"
let timer;

function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.setRequestHeader("X-Access-Token",API_key);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getDepartures(stop) {
    clearInterval(timer)
    document.getElementById('odjezdy').replaceChildren()
    updateDepartures(stop)
    timer = setInterval(updateDepartures.bind(null, stop),20*1000)
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
        stanoviste.className = 'platform'
        stanoviste.innerHTML = departure['route']['type'] === 1 ? "Kolej " + departure['stop']['platform_code'] : departure['stop']['platform_code']
        let do_odjezdu = document.createElement('td')
        do_odjezdu.innerHTML = departure['departure_timestamp']['minutes'] + " minut"
        let cas_odjezdu = document.createElement('td')
        cas_odjezdu.innerHTML = new Date(Date.parse(departure['departure_timestamp']['predicted'])).toLocaleTimeString()
        odjezd.appendChild(linka)
        odjezd.appendChild(smer)
        odjezd.appendChild(stanoviste)
        odjezd.appendChild(do_odjezdu)
        odjezd.appendChild(cas_odjezdu)
        if (departure['departure_timestamp']['minutes'] === "<1") {odjezd.id = "now"}
        document.getElementById('odjezdy').appendChild(odjezd)
    }
}

window.onload = function (ev) {
    const urlParams = new URLSearchParams(window.location.search)
    const stop = urlParams.get('stop')
    getDepartures(stop)
    document.querySelector('h2#name').innerHTML = stop;
    document.title = stop + ' - Odjezdová tabule'
    showClock()
    setInterval(showClock,1000)
}

function showClock() {
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59

    document.querySelector('h2#time').innerHTML = String(h).padStart(2,'0') + ":" + String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0')
}
