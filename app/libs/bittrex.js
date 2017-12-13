import request from 'request-promise-native';

export default class Bittrex {
  constructor(config) {
    this.apikey = config.apikey;
  }

  async request(method, queryData = {}) {
    const qs = {
      ...queryData,
      apikey: this.apikey,
    };

    const response = await request({
      uri: `https://bittrex.com/api/v1.1/${method}`,
      qs,
    });

    const responseObj = typeof response === 'string' ? JSON.parse(response) : response;

    return responseObj.result;
  }

  async getMarkets() {
    return this.request('public/getmarkets');
  }

  async getMarketSummaries() {
    return this.request('public/getmarketsummaries');
  }

  async getCurrencies() {
    return this.request('public/getcurrencies');
  }

  async getTicker(market) {
    return this.request('public/getticker', { market });
  }

  async getMarketSummary(market) {
    return this.request('public/getmarketsummary', { market });
  }
}
