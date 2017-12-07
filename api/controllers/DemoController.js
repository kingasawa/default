/**
 * DemoController
 *
 * @description :: Server-side logic for managing demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let request = require('request');
let cheerio = require('cheerio');

module.exports = {
	index: async (req,res) => {

	  for(let x=0; x<1000; x++){
      let url = `http://www.mainguyen.vn/orders/tracking_order?mn=MN${x}`;

      request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
          let $ = cheerio.load(body);
          let productArray = [];

          for (let i=2 ; i <= $('.trline').length+1; i++){
            productArray.push({
              id: $(`.order-table .table-responsive table tr:nth-child(${i}) td:nth-child(1)`).text(),
              product: $(`.order-table .table-responsive table tr:nth-child(${i}) td:nth-child(2)`).text(),
              quantity: $(`.order-table .table-responsive table tr:nth-child(${i}) td:nth-child(4)`).text(),
              amount: $(`.order-table .table-responsive table tr:nth-child(${i}) td:nth-child(5)`).text()
            })
          }
          let postData = {
            code: $('table.tbl-order-no tr:nth-child(1) td:nth-child(1) strong').text(),
            date: $('table.tbl-order-no tr:nth-child(1) td:nth-child(2) strong').text(),
            name: $('.customer-right tr:nth-child(2) td:nth-child(2)').text(),
            address: $('.customer-right tr:nth-child(3) td:nth-child(2)').text(),
            phone: $('.customer-right tr:nth-child(4) td:nth-child(2)').text(),
            product: productArray,
            total: $('tr.all-total td:nth-child(2)').text(),
          }
          // res.json(product);
          Mainguyen.create(postData).exec((err,result)=>{
            if(err) {
              console.log('error',x);
            } else {
              console.log('done', x);
            }
            
          })
        }
      })
    }
	},
};

