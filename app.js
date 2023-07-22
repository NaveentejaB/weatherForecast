
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config()

const app = express();
let cityDetails=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("mainPage");
});

app.get("/getWeather",function(req,res){
    console.log(9);
    res.render("body", {weatherDetails : cityDetails});
});

app.post("/",function(req,res){
    console.log(6);
    let val = req.body.cityNames;
    let cities = val.split(",");
    let apiKey = process.env.API_KEY ;
    let unit ="metric";
    for(let i=0;i< cities.length ;i++){
        let url = "https://api.openweathermap.org/data/2.5/weather?q="+cities[i]+"&appid="+ apiKey+"&units="+unit;
        let request = https.get(url,(response) =>{
            response.on("data",function(data){
                let weatherData = JSON.parse(data);
                let country = weatherData.sys.country;
                let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
                let imgcode = weatherData.weather[0].icon;
                let temp = weatherData.main.temp;
                let humid = weatherData.main.humidity;
                let feelLikeTemp = weatherData.main.feels_like;  
                let weatherDescrip = weatherData.weather[0].description;
                let imgUrl  = " https://openweathermap.org/img/wn/"+imgcode+"@2x.png";   
                let countryName = regionNames.of(country); 
                
                cityDetails.push(
                    {
                        temp : temp, humid : humid , feelLikeTemp : feelLikeTemp,
                        weatherDescrip: weatherDescrip , countryName : countryName, imgUrl : imgUrl ,city : cities[i]
                    }
                );

            });
        });
    }
    res.redirect("/getWeather");
});

app.post("/getWeather",function(req,res){
    cityDetails = [];
    res.redirect("/");
});

const port = process.env.PORT || 3000 ;
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});

//  res.render("body",{
//     temp : temp, humid : humid , feelLikeTemp : feelLikeTemp,
//     weatherDescrip: weatherDescrip , countryName : countryName, imgUrl : imgUrl,
//     cityName : citys[i]
// }); 

// let value = req.body.cityNames;
// let cities = ["tirupati"]; 
// console.log(cities);
// let apiKey ="5234ad2828ff2fca2124da1a7ded2888";
// let unit = "metric";
// for(let i=0;i< cities.length ;i++){
//     console.log(1);
//     let url = "https://api.openweathermap.org/data/2.5/weather?q="+cities[i]+"&appid="+ apiKey+"&units="+unit;
//     let request = https.get(url,(response) => {
//         // console.log(response.statusCode);
        
//         if ( response.statusCode === 200){
//             response.on("data",function(data){
//                 let weatherData = JSON.parse(data);
//                 let country = weatherData.sys.country;
//                 let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
//                 let imgcode = weatherData.weather[0].icon;
//                 let temp = weatherData.main.temp;
//                 let humid = weatherData.main.humidity;
//                 let feelLikeTemp = weatherData.main.feels_like;  
//                 let weatherDescrip = weatherData.weather[0].description;
//                 let imgUrl  = " https://openweathermap.org/img/wn/"+imgcode+"@2x.png";   
//                 let countryName = regionNames.of(country); 
                
//                 cityDetails.push(
//                     {
//                         temp : temp, humid : humid , feelLikeTemp : feelLikeTemp,
//                         weatherDescrip: weatherDescrip , countryName : countryName, imgUrl : imgUrl,
//                         cityName : cities[i]
//                     }
//                 );
                
//             });
//         }else{
//             console.log(cities[i]+" this country doesn't exist , please check the spelling");
//         }   
//     });
// }