import Bittrex from './libs/bittrex';

export default class BittrexApp {
  constructor(config) {
    this.bittrex = new Bittrex(config.get('bittrex'));
    this.config = config.get('app');

    this.enabled = true;
    this.markets = {};
    this.sortedMarkets = [];
  }

  async run() {
    if (!this.enabled) {
      return;
    }

    const markets = await this.bittrex.getMarketSummaries();

    this.parseMarkets(markets);
    this.sortMarkets();

    console.log(this.sortedMarkets.slice(0, 5).map(market => ({
      name: market.name,
      deltaPerc: market.deltaPerc,
    })));

    setTimeout(() => this.run(), this.config.pollingInterval);
  }

  parseMarkets(markets) {
    markets
      .filter(market => market.MarketName.substr(0, 3) === 'BTC')
      .forEach((market) => {
        const name = market.MarketName;
        const last = market.Last;

        if (!this.markets[name]) {
          this.markets[name] = {
            name,
            delta: 0,
            deltaPerc: 0,
          };
        }

        const marketObj = this.markets[name];

        if (marketObj.last) {
          marketObj.delta = last - marketObj.last;
          marketObj.deltaPerc = Math.round(((last / marketObj.last) - 1) * 10000) / 100;
        }

        marketObj.last = last;
      });
  }

  sortMarkets() {
    this.sortedMarkets = Object.values(this.markets);
    this.sortedMarkets.sort((a, b) => {
      if (a.deltaPerc === b.deltaPerc) {
        return 0;
      }

      return a.deltaPerc < b.deltaPerc ? 1 : -1;
    });
  }
}
