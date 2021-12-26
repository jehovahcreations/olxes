const puppeteer = require('puppeteer')
const mongoose = require('mongoose');
const Olx = require('./model');
const City = require('./city');
const Localality = require('./locality');

mongoose.connect("mongodb://pura:123456@15.207.216.233:27017/pura?authSource=pura", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   // useFindAndModify: false
  //  useCreateIndex: true
})
.then(() => {
    console.log('Database connection is ready..');
})
.catch((err) => {
    console.log(err);
})



async function scrape() {
    const browser = await puppeteer.launch({ headless: false,args: [
        "--disable-notifications",
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ]});
    const page = await browser.newPage();
  
    await page.goto('https://www.olx.in/', {waitUntil: 'load'});
    await page.waitForTimeout(10000 );
    await page.setJavaScriptEnabled(false)
  
    console.log('nav')
      await page.waitForTimeout(1000 );
      page.setJavaScriptEnabled(true)
   
   await page.setGeolocation({
     latitude: 19.103957,
     longitude: 19.834938
    });
      await Promise.all([
        await page.click('#container > header > div > div > div._14lZ9._110yh > a > svg > g > path._2bClX._12yOz')
      ]);
      await page.waitForTimeout(5000 );
       const [button] = await page.$x("//span[contains(., 'Login with Email')]");
    if (button) {
         await button.click();
      }
      await page.waitForTimeout(1000 );
      await page.type('input[name=email]', 'benettoo4@gmail.com', {delay: 180})
      await page.waitForTimeout(5000 );
      const [button1] = await page.$x("//span[contains(., 'Next')]");
      if (button1) {
           await button1.click();
        }
      await page.waitForTimeout(10000 );
      await page.type('input[name=password]', 'India!23', {delay: 180})
      await page.waitForTimeout(5000 );
      await Promise.all([
        await page.click('body > div:nth-child(24) > div > div > form > div > button')
      ]);
      await page.waitForNavigation();
      await page.waitForTimeout(10000 );
      await Promise.all([
        await page.click('#container > main > div > div > div > div > div > div > ul > li:nth-child(12)')
      ]);
      //#container > main > div > div > div > div > div > div > ul._2qVdv.rui-eJl9O.rui-3c9lW.rui-1CDsP.rui-2MigZ.rui-33FUR._29S32 > li:nth-child(5)
      await page.waitForTimeout(4000 );
      await Promise.all([
        await page.click('#container > main > div > div > div > div > div > div > ul._2qVdv.rui-eJl9O.rui-3c9lW.rui-1CDsP.rui-2MigZ.rui-33FUR._29S32 > li:nth-child(5)')
      ]);
      //var city = 'A Vellalapatti'
      City.findOne({"noss":"1"},async (err,obxx)=>{
        await page.waitForTimeout(5000 );
        const selectElem = await page.$('#State');
        await selectElem.type(obxx.state, {delay: 180});
        await page.waitForTimeout(5000);
        const selectElem1 = await page.$('#City');
        await selectElem1.type(obxx.citys, {delay: 180});
        await page.waitForTimeout(5000);
        const selectElem2 = await page.$('#Locality');
        if(selectElem2){
          for(i = 1; i ; i++){
              var element = await page.waitForSelector("#Locality > option:nth-child("+i+")")
              var text = await page.evaluate(element => element.textContent, element)
              Olx.insertMany({"state":obxx.state,"city":obxx.citys,"noss":"1","locality":text},async (err,olxx)=>{
                console.log(JSON.stringify({"state":obxx.state,"citys":obxx.citys,"noss":"1","Locality":text})+",");
                City.updateOne({"_id":obxx._id},{ $set: { "noss": "0" }},async (err,upda)=>{
                  console.log(upda);
                  await page.waitForTimeout(10000);
                  await browser.close() 
                })
                
              })
              
             }
             
  
        }else{
          Localality.insertMany({"state":obxx.state,"citys":obxx.citys,"noss":"1","locality":text},async (err,olxx)=>{
            console.log(JSON.stringify({"state":obxx.state,"citys":obxx.citys,"noss":"1"})+",");
            City.updateOne({"_id":obxx._id},{ $set: { "noss": "0" }},async (err,upda)=>{
              console.log(upda);
              await page.waitForTimeout(10000);
              await browser.close() 
            })
          })
          //console.log('no data')
          //await page.waitForTimeout(10000);
          //await browser.close() 
          
        }
        
      })
      
       
    
 }
 setInterval(function(){ 
  scrape();
}, 40000);
