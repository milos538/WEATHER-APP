// get divs from HTML
const key = "n14SBo9Ge6R6sWcPdvJ0vpf3b7cSiWDx";     // AccuWeather api key
const grad = document.querySelector("#grad");
const color = document.querySelector("#opis");
const temperatura = document.querySelector(".box1");
const opisDana = document.querySelector("#tekst");
const slika = document.querySelector("#slika");
const maksimum = document.querySelectorAll(".maks");
const minimum = document.querySelectorAll(".min");
const slicice = document.querySelectorAll("#slicica");
const okvir = document.querySelector("#okvir");
const body = document.querySelector("body");
const gradForma = document.querySelector('#formaZaSlanje');

// get name of the day
function dayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    
    return weekdays[dayIndex];
}

// get dates of next 5 days
function getDates(startDate, daysToAdd) {
    var aryDates = [];

    for(var i = 0; i <= daysToAdd; i++) {
        var currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        aryDates.push(dayAsString(currentDate.getDay()));
    }
    
    return aryDates;
}

// Immediately-invoked Function to set dates of next 5 days inside HTML
(function(){
var startDate = new Date();
var aryDates = getDates(startDate, 4);
for(var i = 0; i <= 4;i++){
    var div = document.getElementById("imedana" + i);
    div.innerHTML = aryDates[i];}
})();



// fetch city code using FETCH API from Javascript
const dohvatiKod = async (grad) => {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${grad}`);
    const data = await response.json();
    return data[0];
};

// fetch detailed city weather using FETCH API from Javascript
const dohvatiVremenskeUsloveDan = async (kod) =>{ 
    const vreme = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${kod}?apikey=${key}`);
    const podaci = await vreme.json();
    return podaci;
};

// fetch city weather for a week using FETCH API from Javascript
const dohvatiVremenskeUsloveNedelja = async (kod) =>{ 
    const vreme = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${kod}?apikey=${key}&metric=true`);
    const podaci = await vreme.json();
    return podaci;
};

// fetch all data for city from AccuWeather api
const updateCity = async (city)=>{
    const kodGrada = await dohvatiKod(city);
    const vremeGradaDnevno = await dohvatiVremenskeUsloveDan(kodGrada.Key); 
    const vremeGradaNedeljno = await dohvatiVremenskeUsloveNedelja(kodGrada.Key);
    return {kodGrada,vremeGradaDnevno,vremeGradaNedeljno};
}

// function to display data 
const displayUI = (data) => {
    const imeGrada = data.kodGrada;
    const dnevno = data.vremeGradaDnevno[0];
    const nedeljno = data.vremeGradaNedeljno;
    grad.innerHTML = imeGrada.AdministrativeArea.EnglishName+", "+ imeGrada.Country.EnglishName;
    temperatura.innerHTML = dnevno.Temperature.Metric.Value;
    opisDana.innerHTML = dnevno.WeatherText;
    var opis = `<img src="img/weatherIcons/${dnevno.WeatherIcon}.png">`;
    slika.innerHTML = opis;
    nedeljno.DailyForecasts.forEach((value,i)=>{
        maksimum[i].innerHTML = value.Temperature.Maximum.Value;
        minimum[i].innerHTML = value.Temperature.Minimum.Value;
        opis = `<img src="img/weatherIcons/${value.Day.Icon}.png">`;
        slicice[i].innerHTML = opis;
    });
    if(dnevno.IsDayTime){
        body.style.backgroundImage = 'url("img/dan.jpg")';
        color.style.color = "black";
    }
    else{
        body.style.backgroundImage = 'url("img/noc.jpg")';
        color.style.color = "white";
    }
};

// event listener to start fetching data when user clicks enter
gradForma.addEventListener('submit', (event)=>{
    event.preventDefault();
    var grad = gradForma.gradINPUT.value.trim();
    gradForma.reset();
    updateCity(grad).then(data => displayUI(data)).catch(err => console.log(err));
    okvir.style.visibility = 'visible';
});