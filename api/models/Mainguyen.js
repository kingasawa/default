/**
 * Mainguyen.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    address: {
      type: 'longtext'
    },
    phone: {
      type: 'string'
    },
    product: {
      type: 'json'
    },
    total: {
      type: 'float'
    }
  }
};

