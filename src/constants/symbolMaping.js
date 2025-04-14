import TTM from "../assets/ttm.png";
import CDSL from "../assets/cdsl.png";
import IRFC from "../assets/irfc.png";
import BSE from "../assets/bse.png";
import RELIANCE from "../assets/reliance.png";
import INFY from "../assets/infy.jpg";
import HDFCBANK from "../assets/hdfc.png";
import ICICIBANK from "../assets/icici.png";
import TCS from "../assets/tcs.jpg";
// import KOTAKBANK from "../assets/kotak.png";
import HINDUNILVR from "../assets/hul.png";
import ITC from "../assets/itc.png";
import LT from "../assets/lt.jpg";
import SBIN from "../assets/sbi.png";
import ASIANPAINT from "../assets/ap.png";
import BAJFINANCE from "../assets/bajfinance.png";
import AXISBANK from "../assets/axis.png";
import MANDM from "../assets/mandm.png";
import MARUTI from "../assets/maruti.png";
import HINDALCO from "../assets/hindalco.png";
import JSWSTEEL from "../assets/jswsteel.png";
import SBILIFE from "../assets/sbilife.png";
import DIVISLAB from "../assets/divislab.png";
import POWERGRID from "../assets/powergrid.png";
import TECHM from "../assets/techm.png";
import NTPC from "../assets/ntpc.png";
import TITAN from "../assets/titan.png";


export const symbolMapping = {
  BTCUSDT: { symbol: "RELIANCE", title: "Reliance Industries", logo: RELIANCE },
  RELIANCE: { symbol: "RELIANCE", title: "Reliance Industries", logo: RELIANCE },

  ETHUSDT: { symbol: "INFY", title: "Infosys Limited", logo: INFY },
  INFY: { symbol: "INFY", title: "Infosys Limited", logo: INFY },

  BNBUSDT: { symbol: "HDFCBANK", title: "HDFC Bank Limited", logo: HDFCBANK },
  HDFCBANK: { symbol: "HDFCBANK", title: "HDFC Bank Limited", logo: HDFCBANK },

  BNBBTC: { symbol: "ICICIBANK", title: "ICICI Bank Limited", logo: ICICIBANK },
  ICICIBANK: { symbol: "ICICIBANK", title: "ICICI Bank Limited", logo: ICICIBANK },

  XRPUSDT: { symbol: "TCS", title: "Tata Consultancy Services", logo: TCS },
  TCS: { symbol: "TCS", title: "Tata Consultancy Services", logo: TCS },

  // SOLUSDT: { symbol: "KOTAKBANK", title: "Kotak Mahindra Bank", logo: KOTAKBANK },
  // KOTAKBANK: { symbol: "KOTAKBANK", title: "Kotak Mahindra Bank", logo: KOTAKBANK },

  ADAUSDT: { symbol: "HINDUNILVR", title: "Hindustan Unilever", logo: HINDUNILVR },
  HINDUNILVR: { symbol: "HINDUNILVR", title: "Hindustan Unilever", logo: HINDUNILVR },

  DOGEUSDT: { symbol: "ITC", title: "ITC Limited", logo: ITC },
  ITC: { symbol: "ITC", title: "ITC Limited", logo: ITC },

  MATICUSDT: { symbol: "LT", title: "Larsen & Toubro", logo: LT },
  LT: { symbol: "LT", title: "Larsen & Toubro", logo: LT },

  DOTUSDT: { symbol: "SBIN", title: "State Bank of India", logo: SBIN },
  SBIN: { symbol: "SBIN", title: "State Bank of India", logo: SBIN },

  LTCUSDT: { symbol: "ASIANPAINT", title: "Asian Paints Limited", logo: ASIANPAINT },
  ASIANPAINT: { symbol: "ASIANPAINT", title: "Asian Paints Limited", logo: ASIANPAINT },

  TRXUSDT: { symbol: "BAJFINANCE", title: "Bajaj Finance Limited", logo: BAJFINANCE },
  BAJFINANCE: { symbol: "BAJFINANCE", title: "Bajaj Finance Limited", logo: BAJFINANCE },

  AVAXUSDT: { symbol: "AXISBANK", title: "Axis Bank Limited", logo: AXISBANK },
  AXISBANK: { symbol: "AXISBANK", title: "Axis Bank Limited", logo: AXISBANK },

  SHIBUSDT: { symbol: "MANDM", title: "Mahindra & Mahindra", logo: MANDM },
  MANDM: { symbol: "MANDM", title: "Mahindra & Mahindra", logo: MANDM },

  LINKUSDT: { symbol: "CDSL", title: "Central Depository Services(India) Limited", logo: CDSL },
  CDSL: { symbol: "CDSL", title: "Central Depository Services(India) Limited", logo: CDSL },

  ATOMUSDT: { symbol: "TITAN", title: "Titan Company Limited", logo: TITAN },
  TITAN: { symbol: "TITAN", title: "Titan Company Limited", logo: TITAN },

  NEARUSDT: { symbol: "MARUTI", title: "Maruti Suzuki India Limited", logo: MARUTI },
  MARUTI: { symbol: "MARUTI", title: "Maruti Suzuki India Limited", logo: MARUTI },

  BCHUSDT: { symbol: "BSE", title: "Bombay Stock Exchange", logo: BSE },
  BSE: { symbol: "BSE", title: "Bombay Stock Exchange", logo: BSE },

  XLMUSDT: { symbol: "IRFC", title: "Indian Rail Finance Corporation", logo: IRFC },
  IRFC: { symbol: "IRFC", title: "Indian Rail Finance Corporation", logo: IRFC },

  APTUSDT: { symbol: "TTM", title: "Tata Motors", logo: TTM  },
  TTM : { symbol: "TTM", title: "Tata Motors", logo: TTM  },

  FILUSDT: { symbol: "POWERGRID", title: "Power Grid Corporation of India", logo: POWERGRID },
  POWERGRID: { symbol: "POWERGRID", title: "Power Grid Corporation of India", logo: POWERGRID },

  SANDUSDT: { symbol: "TECHM", title: "Tech Mahindra Limited", logo: TECHM },
  TECHM: { symbol: "TECHM", title: "Tech Mahindra Limited", logo: TECHM },

  ICPUSDT: { symbol: "NTPC", title: "NTPC Limited", logo: NTPC },
  NTPC: { symbol: "NTPC", title: "NTPC Limited", logo: NTPC },

  ETCUSDT: { symbol: "HINDALCO", title: "Hindalco Industries Limited", logo: HINDALCO },
  HINDALCO: { symbol: "HINDALCO", title: "Hindalco Industries Limited", logo: HINDALCO },

  GALAUSDT: { symbol: "JSWSTEEL", title: "JSW Steel Limited", logo: JSWSTEEL },
  JSWSTEEL: { symbol: "JSWSTEEL", title: "JSW Steel Limited", logo: JSWSTEEL },

  EOSUSDT: { symbol: "SBILIFE", title: "SBI Life Insurance Company", logo: SBILIFE },
  SBILIFE: { symbol: "SBILIFE", title: "SBI Life Insurance Company", logo: SBILIFE },

  FTMUSDT: { symbol: "DIVISLAB", title: "Divi’s Laboratories Limited", logo: DIVISLAB },
  DIVISLAB: { symbol: "DIVISLAB", title: "Divi’s Laboratories Limited", logo: DIVISLAB },
};

export const symbolMapping2 = {
  RELIANCE: { symbol: "BTCUSDT", title: "Reliance Industries", logo: RELIANCE },
  INFY: { symbol: "ETHUSDT", title: "Infosys Limited", logo: INFY },
  HDFCBANK: { symbol: "BNBUSDT", title: "HDFC Bank Limited", logo: HDFCBANK },
  ICICIBANK: { symbol: "BNBBTC", title: "ICICI Bank Limited", logo: ICICIBANK },
  TCS: { symbol: "XRPUSDT", title: "Tata Consultancy Services", logo: TCS },
  // KOTAKBANK: { symbol: "SOLUSDT", title: "Kotak Mahindra Bank", logo: KOTAKBANK },
  HINDUNILVR: { symbol: "ADAUSDT", title: "Hindustan Unilever", logo: HINDUNILVR },
  ITC: { symbol: "DOGEUSDT", title: "ITC Limited", logo: ITC },
  LT: { symbol: "MATICUSDT", title: "Larsen & Toubro", logo: LT },
  SBIN: { symbol: "DOTUSDT", title: "State Bank of India", logo: SBIN },
  ASIANPAINT: { symbol: "LTCUSDT", title: "Asian Paints", logo: ASIANPAINT },
  BAJFINANCE: { symbol: "TRXUSDT", title: "Bajaj Finance", logo: BAJFINANCE },
  AXISBANK: { symbol: "AVAXUSDT", title: "Axis Bank", logo: AXISBANK },
  M_AND_M: { symbol: "SHIBUSDT", title: "Mahindra & Mahindra", logo: MANDM },
  CDSL: { symbol: "LINKUSDT", title: "Central Depository Services(India) Limited", logo: CDSL },
  TITAN: { symbol: "ATOMUSDT", title: "Titan Company Limited", logo: TITAN },
  MARUTI: { symbol: "NEARUSDT", title: "Maruti Suzuki India Limited", logo: MARUTI },
  BSE: { symbol: "BCHUSDT", title: "Bombay Stock Exchange", logo: BSE },
  NESTLEIND: { symbol: "IRFC", title: "Indian Rail Finance Corporation", logo: IRFC },
  TTM : { symbol: "APTUSDT", title: "Tata Motors", logo: TTM  },
  POWERGRID: { symbol: "FILUSDT", title: "Power Grid Corporation", logo: POWERGRID },
  TECHM: { symbol: "SANDUSDT", title: "Tech Mahindra", logo: TECHM },
  NTPC: { symbol: "ICPUSDT", title: "NTPC Limited", logo: NTPC },
  HINDALCO: { symbol: "ETCUSDT", title: "Hindalco Industries", logo: HINDALCO },
  JSWSTEEL: { symbol: "GALAUSDT", title: "JSW Steel", logo: JSWSTEEL },
  SBILIFE: { symbol: "EOSUSDT", title: "SBI Life Insurance", logo: SBILIFE },
  DIVISLAB: { symbol: "FTMUSDT", title: "Divi's Laboratories", logo: DIVISLAB },
};
