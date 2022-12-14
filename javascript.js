const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const datumOutput = document.querySelector('.date');
const casOutput = document.querySelector('.time');
const podminkaOutput = document.querySelector('.condition');
const jmenoOutput = document.querySelector('.name');
const ikona = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const tlacitko = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const favourite = document.querySelector('.favourite');
let favourite_list = [];

favourite.addEventListener('click', event => {
    if(event.target.classList.contains('favourite')){
    const jmeno = document.querySelector('.name').innerHTML;
    const favourite_item = jmeno;

    napisOblibene(favourite_item);
    }
});

function napisOblibene(vstup){
    const hodnota = vstup;
    favourite_list.push(hodnota);
    oblibene(hodnota);
};

function oblibene(hodnota) {
    localStorage.setItem('favourite-list',JSON.stringify(favourite_list));
    const list = document.querySelector('.cities');
    const node = document.createElement("li");
    node.setAttribute('class','city');
    node.setAttribute('id',`${hodnota}`)
    node.innerHTML = `
    <span class="click">${hodnota}</span>
    `;

    if(document.getElementById(hodnota)){
        alert("Město je již v listu oblíbených");
    } else {
        list.append(node);
    }
    
};

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('favourite-list');
    if (ref) {
        favourite_list = JSON.parse(ref);
        favourite_list.forEach(i => {
        oblibene(i);
      });
    }
});

//defaultní město při načtení
let cityInput = "Zlín";

/** změna města při kliknutí na panel */
const list = document.querySelector('.cities');
list.addEventListener('click',event => {
    if(event.target.classList.contains('click')){
        cityInput = event.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    }
});

// submit event
form.addEventListener('submit', (e) => {
    //alert pokud je search prázdný
    if(search.value.length == 0) {
        alert('Prosím vložte název města');
    } else {
        //změna z defaultu na hledané
        cityInput = search.value;
        // funkce pro počasí
        fetchWeatherData();
        // pročištění inputu
        search.value = "";
        app.style.opacity = "0";
    }

    //zákaz reloadu
    e.preventDefault();
});

function denVTydnu(day, month, year) {
    const den = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    return den[new Date(`${day}/${month}/${year}`).getDay()];
};

//funkce na počasí
function fetchWeatherData() {
    fetch('https://api.weatherapi.com/v1/current.json?key=4269f5a4cbe64f0783b102737221012&q='+cityInput+'&aqi=no')
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        temp.innerHTML = data.current.temp_c + "&#176;";
        podminkaOutput.innerHTML = data.current.condition.text;

        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        //přeformátování data
        datumOutput.innerHTML = `${denVTydnu(m, d, y)} ${d}, ${m} ${y}`;
        casOutput.innerHTML = time;
        //jméno města
        jmenoOutput.innerHTML = data.location.name;
        //ikona odpovídající počasí
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        //ikona z lokální složky
        ikona.src = "./icons/" + iconId;
        
        //detaily o počasí
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //defaultní čas
        let timeOfDay = "day";
        //unikátní id pro každé počasí
        const code = data.current.condition.code;
        //změna na noc
        if(!data.current.is_day) {
            timeOfDay = "night";
        }

        if(code == 1000) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg`;
            //změna barvy talčítka
            tlacitko.style.background = "#e5ba92";
            if(timeOfDay == "night") {
                tlacitko.style.background = "#181e27";
            }
        }

        else if(code == 1003 || code == 1006 || code == 1009 || code == 1030 || code == 1069 || code == 1087 || code == 1135 || code == 1273 || code == 1276 || code == 1279 || code == 1282) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg`;
            tlacitko.style.background = "#fa6d1b";
            if(timeOfDay == "night") {
                tlacitko.style.background = "#181e27";
            }
        } else if(code == 1063 || code == 1069 || code == 1072 || code == 1150 || code == 1153 || code == 1180 || code == 1183 || code == 1186 || code == 1189 || code == 1192 || code == 1195 || code == 1204 || code == 1207 || code == 1240 || code == 1243 || code == 1246 || code == 1249 || code == 1252) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg`;
            tlacitko.style.background = "#647d75";
            if(timeOfDay == "night") {
                tlacitko.style.background = "#325c80";
            }
        } else {
            app.style.backgroundImage = `url(./images/${timeOfDay}/snow.jpg`;
            tlacitko.style.background = "#4d72aa";
            if(timeOfDay == "night") {
                tlacitko.style.background = "#1b1b1b";
            }
        }
        app.style.opacity = "1";
    })
    //alert u neexistujícího města
    .catch(() => {
        app.style.opacity = "1";
    });
}

//zavolání funkce při načtení stránky
fetchWeatherData();
app.style.opacity = "1";