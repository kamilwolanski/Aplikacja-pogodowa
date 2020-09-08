// import { fromCalvinToCelcius } from '@.'
const cityInput = document.querySelector('#cityInput');
const temph2 = document.querySelector('.temp');
const cityNameH1 = document.querySelector('.city')
const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const header = document.querySelector('header');
const feelsLikeSpan = document.querySelector('.feelsLikeSpan');
const humiditySpan = document.querySelector('.humiditySpan');
const pressureSpan = document.querySelector('.pressureSpan');
const windSpan = document.querySelector('.windSpan');
const searchBtn = document.querySelector('.searchBtn');

const daysName = document.querySelectorAll('.dayName');
const tempMain = document.querySelectorAll('.tempMain');
const clouds = document.querySelectorAll('.cloud');

const cloudsAndRain = {
    'few clouds':'fewClouds.jpg', 'scattered clouds':'scatteredClouds.jpg', 'clear sky':'clearSky.jpeg', 'overcast clouds':'darkClouds.jpeg',
    'light rain':'droprain.png', 'moderate rain':'droprain.png','shower rain':'rains.png','light intensity drizzle rain':'rains.png',
    'broken clouds':'brokenClouds.jpeg', 'light intensity shower rain':'rains.png', 'night':'nightSky.jpeg', 'thunderstorm':'storm.jpg'
    
}

const daysOfTheWeek = {
    '0':'Niedziela', '1':'Poniedziałek', '2':'Wtorek', '3':'Środa', '4':'Czwartek', '5':'Piątek', '6':'Sobota', '7':'Niedziela'
}

const cloudsInMain = {
    'clear sky':'fa-sun', 'light rain':'fa-cloud-rain', 'few clouds':'fa-cloud-sun', 'moderate rain':'fa-cloud-showers-heavy', 'broken clouds':'fa-cloud', 'scattered clouds':'fa-cloud-sun'
}
const style = document.head.appendChild(document.createElement("style"));

// const style = document.head.appendChild(document.createElement("style"));
// style.innerHTML = "body::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat, background-size: cover; z-index: -1; opacity: .6;}";

const calculateByName = (city)=>{
    // const cityInputValue = cityInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        calculate(data, city);
    })
}

const calculateBylatlon = (szerokosc, dlugosc)=>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${szerokosc}&lon=${dlugosc}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        const city = data.name;
        calculate(data, city);
    })
}

const calculate = (data, city)=>{
   
    console.log(data);
    const sunRise = data.sys.sunrise;
    const sunRiseInMili = sunRise * 1000;

    const sunSet = data.sys.sunset;
    const sunSetInMili = sunSet * 1000;

    const sunSetDate = new Date (sunSetInMili); // data zachodu słońca
    const sunRiseDate = new Date(sunRiseInMili); // data wschodu słońca

    const differenceBetweenSetAndRise = sunSetDate - sunRiseDate; // Różnica pomiędzy zachodem, a wschodem słońca

    const nowTime = new Date(); // Obecna data i godzina
  
    const toRise = nowTime - sunRiseInMili;
    const toSet = nowTime - sunSetInMili;

    const sumTimeToRiseAndSet = Math.abs(toRise + toSet); // Suma czasu obecnego do wschodu i do zachodu słońca - wartość bezwzględna

    const typeOfCloudsAndRain = data.weather[0].description; // Rodzaj chmury i rodzaj deszczu

    assignPropertyTimeOfDayAndWeather(sumTimeToRiseAndSet, differenceBetweenSetAndRise,typeOfCloudsAndRain);

    const tempInCalvin = parseInt(data.main.temp);
    const tempInCelsius = fromCalvinToCelcius(tempInCalvin);

    assignToHtml(cityNameH1, city);
    assignToHtml(temph2, tempInCelsius);

    let tempFeelsLike = parseInt(data.main.feels_like);
    tempFeelsLike = fromCalvinToCelcius(tempFeelsLike);
    assignToHtml(feelsLikeSpan, tempFeelsLike);

    const humidity = parseInt(data.main.humidity);
    assignToHtml(humiditySpan, humidity);

    const pressure = parseInt(data.main.pressure)
    assignToHtml(pressureSpan, pressure);

    const windSpeed = data.wind.speed;
    assignToHtml(windSpan, windSpeed);

// Druga część strony (MAIN)

    calculateWeatherInMain(data,nowTime)
}

const calculateWeatherInMain = (data,nowTime)=>{
    for(const cloud of clouds){       
        cloud.className = "cloud fas";
    }
    let dayOfTheWeek = nowTime.getDay()+1;

    for(const dayName of daysName){ //Przypisanie nazwy dni tygodnia
        dayName.textContent = daysOfTheWeek[dayOfTheWeek];
        dayOfTheWeek++;
    }

    const latitude = data.coord.lat; //szerokość geograficzna
    const longitude = data.coord.lon;//długość geograficzna
    console.log(latitude, longitude);

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
    exclude={part}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        for(let i=0; i<3; i++){
            const dailyTemp = parseInt(fromCalvinToCelcius(data.daily[i].temp.day)); // Przypisanie odpowiedniej temperatury i pogody na kolejne 3 dni
            tempMain[i].textContent = dailyTemp;

            const dailyCloud = data.daily[i].weather[0].description;
            clouds[i].classList.add(`${cloudsInMain[dailyCloud]}`);
        }
    })
}

const assignPropertyTimeOfDayAndWeather = (sumTimeToRiseAndSet, differenceBetweenSetAndRise, typeOfCloudsAndRain)=>{
  
    if(sumTimeToRiseAndSet > differenceBetweenSetAndRise){
        style.innerHTML = `header::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['night']}) center no-repeat; background-size: cover; opacity: .6;} header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: 0; opacity: .4}`;
        header.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
        header.style.backgroundSize = "cover";
        if(typeOfCloudsAndRain === 'light rain' || typeOfCloudsAndRain === 'moderate rain' || typeOfCloudsAndRain === 'shower rain' || typeOfCloudsAndRain === 'light intensity drizzle rain'|| typeOfCloudsAndRain === 'light intensity shower rain'){
            rain(typeOfCloudsAndRain);
        }
    }else{
        header.style.background = `url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat`;
        header.style.backgroundSize = "cover";
        style.innerHTML = "";

        if(typeOfCloudsAndRain === 'light rain' || typeOfCloudsAndRain === 'moderate rain' || typeOfCloudsAndRain === 'shower rain' || typeOfCloudsAndRain === 'light intensity drizzle rain'|| typeOfCloudsAndRain === 'light intensity shower rain'){
            rain(typeOfCloudsAndRain);
        }else if(typeOfCloudsAndRain === 'thunderstorm'){
            style.innerHTML = `header::before {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
        }
    }
}

const rain =(typeOfRain)=>{
    style.innerHTML = `header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfRain]}) center no-repeat; background-size: cover;}`;
    header.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
    header.style.backgroundSize = "cover";
}
const enterCheck = ()=>{
    if(event.keyCode === 13){
        const cityInputValue = cityInput.value;

        calculateByName(cityInputValue);
    }
}

const fromCalvinToCelcius = (calvin)=>{
    return calvin - 273;

}

const assignToHtml = (place, value)=>{
    place.textContent = value;
    cityInput.value = "";
}

const getInputValue = ()=>{
    const cityInputValue = cityInput.value;
    calculateByName(cityInputValue);
}

const getLocalization = ()=>{
    var geo = navigator.geolocation;
    console.log(geo);

if(geo) {
  geo.getCurrentPosition(function(location) {
    console.log('Szerokość ' + location.coords.latitude);
    console.log('Długość ' + location.coords.longitude);
    const szerokośćGeo = location.coords.latitude;
    const dlugoscGeo = location.coords.longitude;

    calculateBylatlon(szerokośćGeo, dlugoscGeo);

  });
}

calculateByName('Warszawa');

  
}
cityInput.addEventListener('keyup', enterCheck)
searchBtn.addEventListener('click',getInputValue)
getLocalization();
// calculate('Warszawa');

