const http = require('http');
const fs = require('fs');
const host  = 'localhost';
const port = 8000;
var requests = require('requests');
const homeFile = fs.readFileSync('home.html',"utf-8");
//data ko ek bar m hi replace ke liye jisse abr abr file loafd na ho isliye func ko server se phle define
const replaceVal = (tempVal,orgVal)=>{
   temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
   temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
   temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
   temperature = temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperature;
};
const requestListener = function(req,res){
// routing ke jesa method npm se use -- requests
//now routing
if(req.url == "/"){
   // var request = require('request');//y code line upr
   requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=645662f15726e6e523524ee96e9c063b")
.on('data',  (chunk)=> {
    //y data event h jisse hum data read  krte h
    //jo data mila h json m use obj m convert
    const objdata = JSON.parse(chunk);
  //console.log(chunk)
  //ab objdata (json)ko array m convert
  const arrData = [objdata];
  //console.log(arrData);
  //ab hume obj se only temp chaiye
  //console.log(arrData[0].main.temp);
  //map method  array ke data ke liye
  const realTimeData = arrData.map((val) =>replaceVal(homeFile,val)).join(" ");
    // ek func to replace value of location temp etc.
    //map ke through console krege
    //console.log(val.main);
    
  
  //data ko app p show through write method
  res.write(realTimeData);
  //console.log(realTimeData);
})
.on('end',  (err) =>{
  if (err) return console.log('connection closed due to errors', err);
 res.end();
  console.log('end');
});
}
//server ko listen krege

};
const server = http.createServer(requestListener);
server.listen(port,host,()=>{
    console.log(`server is running on ${host}:${port}`);
});

