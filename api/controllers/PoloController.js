/**
 * DemoController
 *
 * @description :: Server-side logic for managing demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const request = require('request');
const moment = require('moment');
import sumby from 'lodash.sumby';
// Import the discord.js module
const Discord = require('discord.js');
// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzgxMDkzNTc2NzMxNTI1MTQ0.DPP3_A.OTN_vB6vf6o6QGchph7m41UkirQ';

const Poloniex = require('poloniex.js');
let poloniexApiKey = 'QXP81QDV-8KAS7XFX-28CK9F64-VACTOXU5';
let poloniexSecret = 'a3148a85e59f290def2de4f0c68272ac851c906a95190b543ff3a0f5144c4388f1951f90b02139a82cff42a4872af96ca69642ecc04f935fba9351dc07bbe6fa'
let poloniex = new Poloniex(poloniexApiKey,poloniexSecret);

const bittrex = require('node-bittrex-api');
let apiBittrex = {
  'apikey' : '861555a66d3a4e0ca590ea0fee0068be',
  'apisecret' : 'c56f8d3318c1420992dc6f7e4c2fe0e9'
}

let alive = 1;
let alert = 0;

//381422579023478785 #poloniex
//383068533795323904 #bittrex
//375001196810862594 #goc giai tri

module.exports = {
  index: async(req,res) => {

// Create an instance of a Discord client
    const client = new Discord.Client();

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
    client.on('ready', () => {
      console.log('I am ready!');
    });

// Create an event listener for messages
    client.on('message', async(message) => {
      let resultData = `${message.author} Your result data:`

      if (message.content === '!channel' && message.author.id === '378742016265289729'){
        console.log('message',message);
        message.channel.send(`${message.channel.id}`)
      }

      // If the message is "ping"
      if (message.content === '/sleep' && message.author.id === '378742016265289729'){
        alive = 0;
        message.channel.send(`Chào anh chị, e đi ngủ đây, a chị ngủ sớm giữ gìn sức khoẻ`)
      }
      if (message.content === '/wakeup' && message.author.id === '378742016265289729'){
        alive = 1;
        message.channel.send(`Chào anh chị, e đã thức dậy và đã sẵn sàng đợi lệnh :D`)
      }

      if(alive == 1){
        //admin test response
        if (message.content === '/ping' && message.author.id === '378742016265289729') {
          message.channel.send('```fix\npong```');

          // client.reply(message, "pong")
        }

        if (message.content.startsWith('/bye bot') || message.content.startsWith('/goodbye bot')) {
          message.channel.send(`${message.author} goodbye :D`);
          console.log('message.author', message.author);
          // client.reply(message, "pong")
        }

        // GET PRICE
        if (message.content.startsWith('/p ')){
          let getData = message.content.split('/p ')[1];
          getData = getData.toUpperCase();
          if(message.channel.id === '381422579023478785') {
            poloniex.returnTicker().then((ticker) => {
              if(!ticker[`USDT_${getData}`] && !ticker[`BTC_${getData}`]){
                message.channel.send('No data')
              } else {
                if(getData == 'BTC'){
                  message.channel.send('```css\nPoloniex - '+getData+'\nLast : $'+ticker["USDT_BTC"].last+'\nLow24: $'+ticker["USDT_BTC"].low24hr+'\nHigh24: $'+ticker["USDT_BTC"].high24hr+'```');
                } else {
                  let usdtCurrencyPair = `USDT_${getData}`;
                  let btcCurrencyPair = `BTC_${getData}`;
                  message.channel.send('```css\nPoloniex - '+getData+'\nLast : '+_.get(ticker[btcCurrencyPair],"last","")+' BTC  |  $'+_.get(ticker[usdtCurrencyPair],"last","")+'\nLow24: '+_.get(ticker[btcCurrencyPair],"low24hr","")+' BTC  |  $'+_.get(ticker[usdtCurrencyPair],"low24hr","")+'\nHigh24: '+_.get(ticker[btcCurrencyPair],"high24hr","")+' BTC  |  $'+_.get(ticker[usdtCurrencyPair],"high24hr","")+'```');

                }
              }
            }).catch((err) => {
              console.log('err.message', err.message);
            });
          } else if(message.channel.id === '383068533795323904') {
            if(getData == 'BTC'){
              bittrex.getmarketsummary( { market : `USDT-${getData}`},(usdtData,err) => {
                console.log('usdtData', usdtData);
                if(!err){
                  message.channel.send('```css\nBittrex - '+getData+'\nLast : $'+usdtData.result[0].Last+'\nLow24: $'+usdtData.result[0].Low+'\nHigh24: $'+usdtData.result[0].High+'```');
                }
              });
            } else {
              bittrex.getmarketsummary( { market : `BTC-${getData}`},(btcData,err) => {
                if(!err){
                  bittrex.getmarketsummary( { market : `USDT-${getData}`},(usdtData,err) => {
                    if(!err){
                      message.channel.send('```css\nBittrex - '+getData+'\nLast : '+btcData.result[0].Last+' BTC  |  $'+usdtData.result[0].Last+'\nLow24: '+btcData.result[0].Low+' BTC  |  $'+usdtData.result[0].Low+'\nHigh24: '+btcData.result[0].High+' BTC  |  $'+usdtData.result[0].High+'```');
                    }
                  });
                }

              });
            }
          }

        };


        // GET VOL
        if(message.content.startsWith('/vol ')){
          let coin1 = message.content.split(' ')[1];
          coin1 = coin1.toUpperCase();
          let coin2 = message.content.split(' ')[2];
          coin2 = coin2.toUpperCase();

          if(message.channel.id === '381422579023478785'){
            let hour = 4;

            let getData = `${message.content.split(' ')[1]}_${message.content.split(' ')[2]}`;
            getData = getData.toUpperCase();
            if(message.content.split(' ').length > 3){
              hour = parseInt(message.content.split(' ')[3]);
            }

            console.log('hour', hour);
            let now = new Date();
            let to = moment(now).subtract(hour, 'hour');
            let start = moment(to).unix();
            let end = moment(now).unix();
            getData = getData.toUpperCase();

            poloniex.returnTradeHistory(getData, start, end).then(async(data)=>{
              let getBuy = [];
              let getSell = [];
              await Promise.all(
                data.map((item)=>{
                  if(item.type === 'buy'){
                    getBuy.push(item)
                  } else if (item.type === 'sell') {
                    getSell.push(item)
                  }
                })
              )

              let sumBuyQuantity = sumby(getBuy, (b) => { return parseFloat(b.amount); });
              let sumSellQuantity = sumby(getSell, (s) => { return parseFloat(s.amount); });
              let sumBuyTotal = sumby(getBuy, (b) => { return parseFloat(b.total); });
              let sumSellTotal = sumby(getSell, (s) => { return parseFloat(s.total); });

              message.channel.send('```css\nPoloniex - '+getData+' - ['+hour+' hour] \n[BUY] - Amount: '+parseFloat(sumBuyQuantity).toFixed(2)+' '+coin2+' - Total: '+parseFloat(sumBuyTotal).toFixed(2)+' '+coin1+' \n[SELL] - Amount: '+parseFloat(sumSellQuantity).toFixed(2)+' '+coin2+' - Total: '+parseFloat(sumSellTotal).toFixed(2)+' '+coin1+'```');

            }).catch((err) => {
              console.log('err.message', err.message);
            });
          } else if(message.channel.id === '383068533795323904') {
            let getData = `${message.content.split(' ')[1]}-${message.content.split(' ')[2]}`;
            getData = getData.toUpperCase();
            bittrex.getmarkethistory({ market : getData }, async( data, err )=> {
              console.log( data );
              let getBuy = [];
              let getSell = [];
              await Promise.all(
                data.result.map((item)=>{
                  if(item.OrderType === 'BUY'){
                    getBuy.push(item)
                  } else if (item.OrderType === 'SELL') {
                    getSell.push(item)
                  }
                })
              )
              let sumBuyQuantity = sumby(getBuy, (b) => { return b.Quantity; });
              let sumSellQuantity = sumby(getSell, (s) => { return s.Quantity; });
              let sumBuyTotal = sumby(getBuy, (b) => { return b.Total; });
              let sumSellTotal = sumby(getSell, (s) => { return s.Total; });
              message.channel.send('```css\nBittrex - '+getData+' - [last 200 transactions] \n[BUY] - Amount: '+parseFloat(sumBuyTotal).toFixed(2)+' '+coin1+' - Total: '+parseFloat(sumBuyQuantity).toFixed(2)+' '+coin2+' \n[SELL] - Amount:'+parseFloat(sumSellTotal).toFixed(2)+' '+coin1+' - Total: '+parseFloat(sumSellQuantity).toFixed(2)+' '+coin2+'```');
            });
          }


        }

        // if(message.content.startsWith('!wall-')){
        //   let wallvalue = 800;
        //   let getData = message.content.split('!wall-')[1];
        //   getData = getData.toUpperCase();
        //   if(getData == 'USDT-ETH' || getData == 'USDT-DASH' || getData == 'USDT-ZEC' || getData == 'USDT-XMR'){
        //     wallvalue = 300;
        //   } else if(getData == 'USDT-BCC'){
        //     wallvalue = 200;
        //   } else if(getData == 'USDT-BTC' || getData == 'BTC-BCC'){
        //     wallvalue = 100;
        //   }
        //   bittrex.getorderbook({ market : getData, depth : 10, type : 'both' }, async( data, err )=> {
        //     // res.json(data);
        //     let wallBuy = [];
        //     let wallSell = [];
        //     console.log('data.result', data.result);
        //     await Promise.all(
        //       data.result.buy.map((itembuy)=>{
        //         if(itembuy.Quantity>wallvalue){
        //           wallBuy.push(itembuy);
        //         }
        //       })
        //     );
        //     await Promise.all(
        //       data.result.sell.map((itemsell)=>{
        //         if(itemsell.Quantity>wallvalue){
        //           wallSell.push(itemsell);
        //         }
        //       })
        //     );
        //
        //     message.channel.send(`[${getData}] - Buy Wall: ${wallBuy[0].Quantity}, Rate: ${wallBuy[0].Rate} \n[${getData}] - Sell Wall: ${wallSell[0].Quantity}, Rate: ${wallSell[0].Rate}`);
        //
        //   });
        // }
      }

    });

    //get ticker

    client.on('disconnect', () =>{
      console.log('bot is disconnected');
    })

// Log our bot in
    client.login(token);
    return res.send(200);
  }
};

