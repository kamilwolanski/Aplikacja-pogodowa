// import { fromCalvinToCelcius } from '@.'
const cityInput = document.querySelector('#cityInput');
const temph2 = document.querySelector('.temp');
const cityName = document.querySelector('.city')
const body = document.querySelector('body');
const feelsLikeSpan = document.querySelector('.feelsLikeSpan');
const humiditySpan = document.querySelector('.humiditySpan');
const pressureSpan = document.querySelector('.pressureSpan');
const windSpan = document.querySelector('.windSpan');
const searchBtn = document.querySelector('.searchBtn');

const clouds = {
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
        // const sunRise = data.sys.sunrise;
        // const sunRiseInMili = sunRise * 1000;

        const sunSet = data.sys.sunset;
        const sunSetInMili = sunSet * 1000;
        const sunSetDate = new Date (sunSetInMili);
        // console.log(sunSetDate);
        // console.log(sunRiseInMili);
        // const dateObject = new Date(sunRiseInMili); // data wschodu słońca
        // console.log(dateObject);

        // const humanDateFormat = dateObject.toLocaleString();
        // console.log(humanDateFormat);


        const nowTime = new Date(); // Obecna data i godzina

        const typeOfClouds = data.weather[0].description;
        console.log(typeOfClouds)

        dzienCzyNoc(nowTime, sunSetDate, typeOfClouds);
        const tempInCalvin = parseInt(data.main.temp);
        const tempInCelsius = fromCalvinToCelcius(tempInCalvin);

        assignToHtml(cityName, city);
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

const dzienCzyNoc = (currentTime, sunSet, rodzajchmury)=>{
    if(sunSet < currentTime){
        style.innerHTML = `body::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${clouds['night']}) center no-repeat; background-size: cover; z-index: -1; opacity: .6;} body::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${clouds[rodzajchmury]}) center no-repeat; background-size: cover; z-index: -1; opacity: .4}`;
        body.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
        body.style.backgroundSize = "cover";
    }else{
        body.style.background = `url(imgs/${clouds[rodzajchmury]}) center no-repeat`;
        body.style.backgroundSize = "cover";
        style.innerHTML = "";

        if(rodzajchmury === 'light rain' || rodzajchmury === 'moderate rain' || rodzajchmury === 'shower rain' || rodzajchmury === 'light intensity drizzle rain'|| rodzajchmury === 'light intensity shower rain'){
            rain(rodzajchmury);
        }else if(rodzajchmury === 'thunderstorm'){
            style.innerHTML = `body::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
        }
    }
}

const rain =(typeOfrain)=>{
    style.innerHTML = `body::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${clouds[typeOfrain]}) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
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
cityInput.addEventListener('keyup', enterCheck)
searchBtn.addEventListener('click',getInputValue)
calculate('Warszawa');

