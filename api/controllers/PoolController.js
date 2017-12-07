/**
 * Pool Controller
 */
const request = require('request');

module.exports = {

  index: async (req, res) => {
    let {id} = req.allParams;
    let url = 'https://pool.viabtc.com/user/api/517c6cb8680ebcc4b880544295cf786d/';
    if(id){
      url = `https://pool.viabtc.com/user/api/${id}/`
    }
    request.get({url},(error,response,body) => {
      let result = JSON.parse(body);
      // res.json(data.btc)
      let data = result.btc;
      res.view('pool/index',{data})
    })
  }
};
