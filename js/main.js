// import { fromCalvinToCelcius } from '@.'
const cityInput = document.querySelector('#cityInput');
const temph2 = document.querySelector('.temp');
const cityNameH1 = document.querySelector('.city')
const body = document.querySelector('body');
const feelsLikeSpan = document.querySelector('.feelsLikeSpan');
const humiditySpan = document.querySelector('.humiditySpan');
const pressureSpan = document.querySelector('.pressureSpan');
const windSpan = document.querySelector('.windSpan');
const searchBtn = document.querySelector('.searchBtn');

const cloudsAndRain = {
    'few clouds':'fewClouds.jpg', 'scattered clouds':'scatteredClouds.jpg', 'clear sky':'clearSky.jpeg', 'overcast clouds':'darkClouds.jpeg',
    'light rain':'droprain.png', 'moderate rain':'droprain.png','shower rain':'rains.png','light intensity drizzle rain':'rains.png',
    'broken clouds':'brokenClouds.jpeg', 'light intensity shower rain':'rains.png', 'night':'nightSky.jpeg', 'thunderstorm':'storm.jpg'
    
}
const style = document.head.appendChild(document.createElement("style"));

// const style = document.head.appendChild(document.createElement("style"));
// style.innerHTML = "body::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat, background-size: cover; z-index: -1; opacity: .6;}";

const calculate = (city)=>{
    // const cityInputValue = cityInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
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

        dzienCzyNoc(sumTimeToRiseAndSet, differenceBetweenSetAndRise,typeOfCloudsAndRain);

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
        
    })
}

const dzienCzyNoc = (sumTimeToRiseAndSet, differenceBetweenSetAndRise, typeOfCloudsAndRain)=>{
  
    if(sumTimeToRiseAndSet > differenceBetweenSetAndRise){
        style.innerHTML = `body::after {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['night']}) center no-repeat; background-size: cover; z-index: -1; opacity: .6;} body::before {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: -1; opacity: .4}`;
        body.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
        body.style.backgroundSize = "cover";
    }else{
        body.style.background = `url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat`;
        body.style.backgroundSize = "cover";
        style.innerHTML = "";

        if(typeOfCloudsAndRain === 'light rain' || typeOfCloudsAndRain === 'moderate rain' || typeOfCloudsAndRain === 'shower rain' || typeOfCloudsAndRain === 'light intensity drizzle rain'|| typeOfCloudsAndRain === 'light intensity shower rain'){
            rain(typeOfCloudsAndRain);
        }else if(typeOfCloudsAndRain === 'thunderstorm'){
            style.innerHTML = `body::before {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
        }
    }
}

const rain =(typeOfRain)=>{
    style.innerHTML = `body::before {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfRain]}) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
    body.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
    body.style.backgroundSize = "cover";
}
const enterCheck = ()=>{
    if(event.keyCode === 13){
        const cityInputValue = cityInput.value;

        calculate(cityInputValue);
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
    calculate(cityInputValue);
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

    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${szerokośćGeo}&longitude=${dlugoscGeo}&localityLanguage=pl`)
    .then(res => res.json())
    .then(data =>{
        const location = data.locality;
        calculate (location);
    })

  });
}

calculate('Warszawa');

  
}
cityInput.addEventListener('keyup', enterCheck)
searchBtn.addEventListener('click',getInputValue)
getLocalization();
// calculate('Warszawa');

