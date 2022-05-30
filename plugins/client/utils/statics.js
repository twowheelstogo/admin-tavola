import LanguageOptions from "@reactioncommerce/api-utils/LanguageOptions.js";
import CountryDefinitions from "@reactioncommerce/api-utils/CountryDefinitions.js";
import CurrencyDefinitions from "@reactioncommerce/api-utils/CurrencyDefinitions.js";
import lodash from "lodash";

export default class Statics {
  _statics = {
    paths: {
      countriesIn: "state.locations.countries.in",
      countriesNin: "state.locations.countries.nin",
      regionsIn: "state.locations.regions.in",
      regionsNin: "state.locations.regions.nin",
      citiesIn: "state.locations.cities.in",
      citiesNin: "state.locations.cities.nin",
      postalsIn: "state.locations.postals.in",
      postalsNin: "state.locations.postals.nin",
      districtsIn: "state.locations.districts.in",
      districtsNin: "state.locations.districts.nin",
      steetsIn: "state.locations.steets.in",
      steetsNin: "state.locations.steets.nin",
    },
    langs: LanguageOptions.map((v) => ({ _id: v.value, code: v.value, ...v })),
    currencies: Object.entries(CurrencyDefinitions).map(([k, v]) => ({ _id: k, code: k, label: k, value: k, ...v })),
    countries: Object.entries(CountryDefinitions).map(([k, v]) => ({ _id: k, code: k, label: k, value: k, ...v })),
    regions: { news: [], countries: {} },
    cities: { news: [], countries: {} },
    postals: { news: [], countries: {}, regions: {}, cities: {} },
    districts: { news: [], countries: {}, regions: {}, cities: {} },
    steets: { news: [], countries: {}, regions: {}, cities: {}, districts: {} },
  };
  constructor(opts = {}) {
    try {
      opts.statics = lodash.merge(this._statics, opts.statics);
    } catch (error) {}
    this._statics = { ...this._statics, ...opts.statics };
  }
  list(req, opts = {}) {
    // if (["langs", "currencies", "countries"].includes(req)) return this._statics[req];
    // const res = [];
    // const keys = Object.keys(this._statics[req]).filter((o) => o !== "news");
    // opts.reqs = (opts.reqs || keys).filter((o) => o !== "news");
    // let ids = [];
    // for (const r of opts.reqs) {
    //   const values = this._statics[req][r] || [];
    //   if (values.length) {
    //     values.forEach((v) => {
    //       if (!ids.includes(v._id)) {
    //         res.push(v);
    //         ids.push(v._id);
    //       }
    //     });
    //   }
    // }
    // return res.concat(this._statics[req].news || []);
    return [];
  }
  setStatic(req, opts = {}) {
    const option = { _id: opts.value, code: opts.value, label: opts.value, ...opts };
    if (["langs", "currencies", "countries"].includes(req)) {
      this._statics[req].push(option);
    } else {
      if (!this._statics[req].news) this._statics[req].news = [];
      this._statics[req].news.push(option);
    }
  }
}
