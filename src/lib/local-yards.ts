export const YARD_CHECKED = "October 21, 2026";

export type LocalYard = {
  name: string;
  address: string;
  miles: string;
  phone?: string;
  site?: string;
  hours: string;
  inventory: string;
  charges: string;
};

export const LOCAL_YARDS: LocalYard[] = [
  {
    name: "Scrap It",
    address: "100–103 Fremont St, Worcester, MA 01603",
    miles: "about 2 mi from 01605",
    phone: "617-389-7213",
    site: "https://scrapitus.com/locations/worcester-ma",
    hours: "Their site says Mon–Fri 7:00AM–4:00PM, Sat 7:00AM–12:00PM, Sunday closed. No appointment. Open to the public.",
    inventory: "This is a scrap-metal yard, not a used-parts counter. Their Worcester page does not list cars or parts. They take metal in: roll-off, live load, and weigh-and-pay. They say they are a Massachusetts approved tank-disposal yard.",
    charges: "They pay by weight at the scale. No price sheet was on the Worcester page. Call 617-389-7213 before you haul a load. Some directories also list 888-727-2798.",
  },
  {
    name: "Linder's, Inc.",
    address: "211 Granite St, Worcester, MA 01607",
    miles: "about 3 mi from 01605",
    phone: "508-756-5125",
    site: "https://lindersparts.com/",
    hours: "Their site says Mon\u2013Fri 8AM\u20135PM and Sat 8AM\u20131PM.",
    inventory: "Public parts search and a recent-arrivals list. The rows below are a snapshot of that list, not their whole computer.",
    charges: "Each part has a price on their site. On the parts we opened, a 6-month parts-only warranty was $0. A 1-year parts-and-labor add-on was 25% of the part price, and 2 years was 35%.",
  },
  {
    name: "Sam's Pull-A-Part",
    address: "210 Granite St, Worcester, MA 01607",
    miles: "about 3 mi from 01605",
    phone: "800-521-8000",
    site: "https://lindersparts.com/sams-pull-a-part/",
    hours: "Their page lists the address and phone, not hours. Other public listings say Mon\u2013Fri 8AM\u20135PM, Sat 8AM\u20133PM, Sun closed. Call before you go.",
    inventory: "Self-service yard next to Linder's. The page we opened has no vehicle or part list. You find the car and pull the part.",
    charges: "No price sheet on their own page. A public yard listing describes a $2 per person gate fee and card-only payment, no cash. Confirm at the gate.",
  },
  {
    name: "Standard Used Auto Parts",
    address: "257 Granite St, Worcester, MA 01607",
    miles: "about 3 mi from 01605",
    phone: "508-755-8631",
    site: "https://standardusedautoparts.com/",
    hours: "Public listings say Mon\u2013Fri 8AM\u20135PM, Sat 8AM\u20132PM, Sun closed. Their website did not answer when we checked.",
    inventory: "Self-service yard, open since 1939, described as about 40 acres. No online catalog was available. Directories say stock is cars from the 1980s through newer models, and it changes.",
    charges: "No published part prices or junk-car payout on the pages we could open.",
  },
  {
    name: "M.L. Norwood Auto Recycling",
    address: "123 Adams Rd, North Grafton, MA 01536",
    miles: "about 8 mi from 01605",
    phone: "508-839-5934",
    site: "http://www.mlnorwood.com/",
    hours: "Weekdays only. One listing says 9AM\u20134:30PM, another says 8AM\u20134PM. Weekends closed. Call.",
    inventory: "Their website did not answer. No public part list. Directories say they sell used parts and take scrap vehicles.",
    charges: "No published part prices. Reviews say they pay cash for a junk car when the original catalytic converter is still on it, and less if it is aftermarket. No dollar amount was published.",
  },
  {
    name: "Universal Auto Salvage",
    address: "Uxbridge, MA",
    miles: "about 18 mi from 01605",
    phone: "508-278-5600",
    site: "https://universalautosalvage.com/",
    hours: "Their site says Mon\u2013Fri 8:00AM\u20134:30PM.",
    inventory: "They say a computerized inventory is on the site and a parts desk at 800-441-6000. A bot wall blocked the catalog, so no stock was copied.",
    charges: "They advertise a 90-day warranty. No prices were on the page we could read.",
  },
];

export type YardArrival = {
  purchased: string;
  stock: string;
  year: string;
  makeModel: string;
  miles: string;
  partsUrl: string;
};

export type YardPart = {
  stock: string;
  year: string;
  makeModel: string;
  part: string;
  price: string;
  grade: string;
  detail: string;
  url: string;
};

/** Public recent arrivals on lindersparts.com. Not the whole yard. */
export const LINDERS_ARRIVALS: YardArrival[] = [
  {
    "purchased": "2026-10-20",
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "miles": "93131",
    "partsUrl": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017"
  },
  {
    "purchased": "2026-10-20",
    "stock": "T32517",
    "year": "2015",
    "makeModel": "MAZDA 3",
    "miles": "122807",
    "partsUrl": "https://lindersparts.com/parts/MAZDA/MAZDA_3/T32517/2015"
  },
  {
    "purchased": "2026-10-20",
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "miles": "89929",
    "partsUrl": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018"
  },
  {
    "purchased": "2026-10-19",
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "miles": "227879",
    "partsUrl": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014"
  },
  {
    "purchased": "2026-10-19",
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "miles": "120401",
    "partsUrl": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014"
  },
  {
    "purchased": "2026-10-19",
    "stock": "T32516",
    "year": "2013",
    "makeModel": "SUBARU IMPREZA",
    "miles": "66484",
    "partsUrl": "https://lindersparts.com/parts/SUBARU/IMPREZA/T32516/2013"
  },
  {
    "purchased": "2026-10-19",
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "miles": "79128",
    "partsUrl": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015"
  },
  {
    "purchased": "2026-10-17",
    "stock": "T32515",
    "year": "2018",
    "makeModel": "LAND ROVER VELAR",
    "miles": "0",
    "partsUrl": "https://lindersparts.com/parts/LAND_ROVER/VELAR/T32515/2018"
  },
  {
    "purchased": "2026-10-17",
    "stock": "T32514",
    "year": "2021",
    "makeModel": "MAZDA CX-9",
    "miles": "92738",
    "partsUrl": "https://lindersparts.com/parts/MAZDA/MAZDA_CX~9/T32514/2021"
  },
  {
    "purchased": "2026-10-17",
    "stock": "T32513",
    "year": "2016",
    "makeModel": "FORD EXPLORER",
    "miles": "151790",
    "partsUrl": "https://lindersparts.com/parts/FORD/EXPLORER/T32513/2016"
  },
  {
    "purchased": "2026-10-17",
    "stock": "T32510",
    "year": "2014",
    "makeModel": "FORD EXPLORER",
    "miles": "0",
    "partsUrl": "https://lindersparts.com/parts/FORD/EXPLORER/T32510/2014"
  },
  {
    "purchased": "2026-10-16",
    "stock": "T32511",
    "year": "2018",
    "makeModel": "MERCEDES-BENZ MERCEDES GLC-CLASS",
    "miles": "116177",
    "partsUrl": "https://lindersparts.com/parts/MERCEDES~BENZ/MERCEDES_GLC~CLASS/T32511/2018"
  },
  {
    "purchased": "2026-10-16",
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "miles": "75686",
    "partsUrl": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019"
  },
  {
    "purchased": "2026-10-16",
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "miles": "67272",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019"
  },
  {
    "purchased": "2026-10-16",
    "stock": "T32489",
    "year": "2024",
    "makeModel": "FORD F250SD PICKUP",
    "miles": "10166",
    "partsUrl": "https://lindersparts.com/parts/FORD/FORD_F250SD_PICKUP/T32489/2024"
  },
  {
    "purchased": "2026-10-16",
    "stock": "T32512",
    "year": "2014",
    "makeModel": "BMW 320I",
    "miles": "168705",
    "partsUrl": "https://lindersparts.com/parts/BMW/BMW_320I/T32512/2014"
  },
  {
    "purchased": "2026-10-15",
    "stock": "T32509",
    "year": "2016",
    "makeModel": "MAZDA 3",
    "miles": "139845",
    "partsUrl": "https://lindersparts.com/parts/MAZDA/MAZDA_3/T32509/2016"
  },
  {
    "purchased": "2026-10-15",
    "stock": "T32471",
    "year": "2018",
    "makeModel": "DODGE CHALLENGER",
    "miles": "108468",
    "partsUrl": "https://lindersparts.com/parts/DODGE/CHALLENGER/T32471/2018"
  },
  {
    "purchased": "2026-10-15",
    "stock": "T32492",
    "year": "2016",
    "makeModel": "FORD F150 PICKUP",
    "miles": "225519",
    "partsUrl": "https://lindersparts.com/parts/FORD/FORD_F150_PICKUP/T32492/2016"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32474",
    "year": "2015",
    "makeModel": "VOLKSWAGEN JETTA",
    "miles": "158221",
    "partsUrl": "https://lindersparts.com/parts/VOLKSWAGEN/JETTA/T32474/2015"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32503",
    "year": "2019",
    "makeModel": "HYUNDAI KONA",
    "miles": "166185",
    "partsUrl": "https://lindersparts.com/parts/HYUNDAI/KONA/T32503/2019"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32502",
    "year": "2022",
    "makeModel": "HONDA CIVIC",
    "miles": "0",
    "partsUrl": "https://lindersparts.com/parts/HONDA/CIVIC/T32502/2022"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32486",
    "year": "2019",
    "makeModel": "CHEVROLET EQUINOX",
    "miles": "116643",
    "partsUrl": "https://lindersparts.com/parts/CHEVROLET/EQUINOX/T32486/2019"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32508",
    "year": "2004",
    "makeModel": "FORD F250SD PICKUP",
    "miles": "69184",
    "partsUrl": "https://lindersparts.com/parts/FORD/FORD_F250SD_PICKUP/T32508/2004"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32491",
    "year": "2015",
    "makeModel": "HONDA CIVIC",
    "miles": "90338",
    "partsUrl": "https://lindersparts.com/parts/HONDA/CIVIC/T32491/2015"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32498",
    "year": "2026",
    "makeModel": "HONDA ACCORD",
    "miles": "0",
    "partsUrl": "https://lindersparts.com/parts/HONDA/ACCORD/T32498/2026"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32483",
    "year": "2023",
    "makeModel": "NISSAN/DATSUN ROGUE",
    "miles": "20976",
    "partsUrl": "https://lindersparts.com/parts/NISSAN.DATSUN/ROGUE/T32483/2023"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32499",
    "year": "2018",
    "makeModel": "VOLKSWAGEN ATLAS",
    "miles": "125267",
    "partsUrl": "https://lindersparts.com/parts/VOLKSWAGEN/ATLAS/T32499/2018"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32506",
    "year": "2015",
    "makeModel": "BMW X5",
    "miles": "135305",
    "partsUrl": "https://lindersparts.com/parts/BMW/BMW_X5/T32506/2015"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32487",
    "year": "2015",
    "makeModel": "HYUNDAI SONATA",
    "miles": "113319",
    "partsUrl": "https://lindersparts.com/parts/HYUNDAI/SONATA/T32487/2015"
  },
  {
    "purchased": "2026-10-14",
    "stock": "T32500",
    "year": "2014",
    "makeModel": "LAND ROVER EVOQUE",
    "miles": "113029",
    "partsUrl": "https://lindersparts.com/parts/LAND_ROVER/EVOQUE/T32500/2014"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32493",
    "year": "2014",
    "makeModel": "MAZDA CX-9",
    "miles": "102956",
    "partsUrl": "https://lindersparts.com/parts/MAZDA/MAZDA_CX~9/T32493/2014"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32494",
    "year": "2021",
    "makeModel": "ACURA RDX",
    "miles": "228562",
    "partsUrl": "https://lindersparts.com/parts/ACURA/RDX/T32494/2021"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32497",
    "year": "2016",
    "makeModel": "CHEVROLET MALIBU",
    "miles": "164923",
    "partsUrl": "https://lindersparts.com/parts/CHEVROLET/MALIBU/T32497/2016"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32193",
    "year": "2017",
    "makeModel": "HONDA ACCORD",
    "miles": "181263",
    "partsUrl": "https://lindersparts.com/parts/HONDA/ACCORD/T32193/2017"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32496",
    "year": "2016",
    "makeModel": "NISSAN/DATSUN ALTIMA",
    "miles": "145635",
    "partsUrl": "https://lindersparts.com/parts/NISSAN.DATSUN/ALTIMA/T32496/2016"
  },
  {
    "purchased": "2026-10-13",
    "stock": "T32490",
    "year": "2015",
    "makeModel": "JEEP GRAND CHEROKEE",
    "miles": "137888",
    "partsUrl": "https://lindersparts.com/parts/JEEP/GRAND_CHEROKEE/T32490/2015"
  },
  {
    "purchased": "2026-10-12",
    "stock": "T32475",
    "year": "2017",
    "makeModel": "BUICK ENCORE",
    "miles": "106407",
    "partsUrl": "https://lindersparts.com/parts/BUICK/ENCORE/T32475/2017"
  },
  {
    "purchased": "2026-10-12",
    "stock": "T32024",
    "year": "2026",
    "makeModel": "HYUNDAI KONA",
    "miles": "2971",
    "partsUrl": "https://lindersparts.com/parts/HYUNDAI/KONA/T32024/2026"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32473",
    "year": "2008",
    "makeModel": "TOYOTA HIGHLANDER",
    "miles": "168414",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32473/2008"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32485",
    "year": "2018",
    "makeModel": "VOLKSWAGEN GOLF",
    "miles": "97795",
    "partsUrl": "https://lindersparts.com/parts/VOLKSWAGEN/GOLF/T32485/2018"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32477",
    "year": "2020",
    "makeModel": "TOYOTA RAV4",
    "miles": "51237",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/RAV4/T32477/2020"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32472",
    "year": "2013",
    "makeModel": "TOYOTA HIGHLANDER",
    "miles": "265638",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32472/2013"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32482",
    "year": "2025",
    "makeModel": "MAZDA CX-50",
    "miles": "15439",
    "partsUrl": "https://lindersparts.com/parts/MAZDA/CX~50/T32482/2025"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32488",
    "year": "2017",
    "makeModel": "HONDA PILOT",
    "miles": "116589",
    "partsUrl": "https://lindersparts.com/parts/HONDA/PILOT/T32488/2017"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32484",
    "year": "2021",
    "makeModel": "AUDI SQ5",
    "miles": "44450",
    "partsUrl": "https://lindersparts.com/parts/AUDI/AUDI_SQ5/T32484/2021"
  },
  {
    "purchased": "2026-10-09",
    "stock": "T32412",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "miles": "154390",
    "partsUrl": "https://lindersparts.com/parts/HONDA/CR~V/T32412/2014"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32035",
    "year": "2014",
    "makeModel": "FORD EXPLORER",
    "miles": "149463",
    "partsUrl": "https://lindersparts.com/parts/FORD/EXPLORER/T32035/2014"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32318",
    "year": "2001",
    "makeModel": "JEEP WRANGLER",
    "miles": "195627",
    "partsUrl": "https://lindersparts.com/parts/JEEP/WRANGLER/T32318/2001"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32480",
    "year": "2022",
    "makeModel": "SUBARU IMPREZA",
    "miles": "68038",
    "partsUrl": "https://lindersparts.com/parts/SUBARU/IMPREZA/T32480/2022"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32481",
    "year": "2022",
    "makeModel": "JEEP WRANGLER",
    "miles": "54582",
    "partsUrl": "https://lindersparts.com/parts/JEEP/WRANGLER/T32481/2022"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32366",
    "year": "2008",
    "makeModel": "TOYOTA TUNDRA",
    "miles": "197907",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/TUNDRA/T32366/2008"
  },
  {
    "purchased": "2026-10-08",
    "stock": "T32478",
    "year": "2020",
    "makeModel": "LEXUS NX300",
    "miles": "40650",
    "partsUrl": "https://lindersparts.com/parts/LEXUS/NX300/T32478/2020"
  },
  {
    "purchased": "2026-10-07",
    "stock": "T32360",
    "year": "2013",
    "makeModel": "MITSUBISHI OUTLANDER",
    "miles": "114618",
    "partsUrl": "https://lindersparts.com/parts/MITSUBISHI/OUTLANDER/T32360/2013"
  },
  {
    "purchased": "2026-10-07",
    "stock": "T32371",
    "year": "2016",
    "makeModel": "TOYOTA SIENNA",
    "miles": "106000",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/SIENNA/T32371/2016"
  },
  {
    "purchased": "2026-10-07",
    "stock": "T32470",
    "year": "2016",
    "makeModel": "MERCEDES-BENZ MERCEDES S-CLASS",
    "miles": "132476",
    "partsUrl": "https://lindersparts.com/parts/MERCEDES~BENZ/MERCEDES_S~CLASS/T32470/2016"
  },
  {
    "purchased": "2026-10-07",
    "stock": "T32476",
    "year": "2021",
    "makeModel": "TOYOTA 4 RUNNER",
    "miles": "95918",
    "partsUrl": "https://lindersparts.com/parts/TOYOTA/4_RUNNER/T32476/2021"
  },
  {
    "purchased": "2026-10-07",
    "stock": "T32352",
    "year": "2015",
    "makeModel": "FORD F150 PICKUP",
    "miles": "150760",
    "partsUrl": "https://lindersparts.com/parts/FORD/FORD_F150_PICKUP/T32352/2015"
  },
  {
    "purchased": "2026-10-06",
    "stock": "T32469",
    "year": "2017",
    "makeModel": "SUBARU FORESTER",
    "miles": "0",
    "partsUrl": "https://lindersparts.com/parts/SUBARU/FORESTER/T32469/2017"
  },
  {
    "purchased": "2026-10-06",
    "stock": "T32427",
    "year": "2023",
    "makeModel": "HYUNDAI ELANTRA",
    "miles": "52058",
    "partsUrl": "https://lindersparts.com/parts/HYUNDAI/ELANTRA/T32427/2023"
  }
];

/** First page of parts for the newest named donors. Cars with 7 pages have more on their site. */
export const LINDERS_PARTS: YardPart[] = [
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AC COMPRESSOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AC_COMPRESSOR/2382565"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AC CONDENSER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AC_CONDENSER/2382578"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382619"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382616"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382617"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382618"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382614"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_BAG/2382615"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/AIR_CLEANER/2382556"
  },
  {
    "stock": "T32505",
    "year": "2017",
    "makeModel": "LINCOLN MKZ",
    "part": "ALTERNATOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LINCOLN/MKZ/T32505/2017/ALTERNATOR/2382564"
  },
  {
    "stock": "T32517",
    "year": "2015",
    "makeModel": "MAZDA 3",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/MAZDA/MAZDA_3/T32517/2015/PARTS_CARS_TRUCKS/2382886"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AC COMPRESSOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AC_COMPRESSOR/2382655"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AC CONDENSER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AC_CONDENSER/2382663"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AIR_BAG/2382682"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AIR_CLEANER/2382646"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AIR FLOW METER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AIR_FLOW_METER/2382647"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "ALTERNATOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/ALTERNATOR/2382654"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "ANTI-LOCK BRAKE PARTS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/ANTI~LOCK_BRAKE_PTS/2382651"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AXLE ASSEMBLY RR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AXLE_ASSEMBLY_RR/2382698"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "AXLE SHAFT",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/AXLE_SHAFT/2382700"
  },
  {
    "stock": "T32507",
    "year": "2018",
    "makeModel": "CHEVROLET SILVERADO 1500 PICKUP",
    "part": "BLOWER MOTOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/CHEVROLET/SILVERADO_1500_PICKUP/T32507/2018/BLOWER_MOTOR/2382656"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AC COMPRESSOR",
    "price": "$76.00",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AC_COMPRESSOR/2382151"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AC CONDENSER",
    "price": "$72.00",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AC_CONDENSER/2382166"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AIR_BAG/2382194"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AIR_BAG/2382196"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AIR_BAG/2382195"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AIR_CLEANER/2382142"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AIR FLOW METER",
    "price": "Call for Price",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AIR_FLOW_METER/2382143"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "ANTI-LOCK BRAKE PARTS",
    "price": "$726.00",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/ANTI~LOCK_BRAKE_PTS/2382147"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AXLE SHAFT",
    "price": "$75.00",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AXLE_SHAFT/2382207"
  },
  {
    "stock": "T32501",
    "year": "2014",
    "makeModel": "HONDA ACCORD",
    "part": "AXLE SHAFT",
    "price": "$77.00",
    "grade": "C",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/ACCORD/T32501/2014/AXLE_SHAFT/2382208"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AC COMPRESSOR",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AC_COMPRESSOR/2381967"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AC CONDENSER",
    "price": "$67.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AC_CONDENSER/2381982"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AIR_BAG/2382019"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AIR_BAG/2382017"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AIR_BAG/2382018"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AIR_CLEANER/2381957"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AIR FLOW METER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AIR_FLOW_METER/2381958"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "ALTERNATOR",
    "price": "$66.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/ALTERNATOR/2381966"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "ANTI-LOCK BRAKE PARTS",
    "price": "$74.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/ANTI~LOCK_BRAKE_PTS/2381963"
  },
  {
    "stock": "T32479",
    "year": "2014",
    "makeModel": "HONDA CR-V",
    "part": "AXLE SHAFT",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/HONDA/CR~V/T32479/2014/AXLE_SHAFT/2382036"
  },
  {
    "stock": "T32516",
    "year": "2013",
    "makeModel": "SUBARU IMPREZA",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/SUBARU/IMPREZA/T32516/2013/PARTS_CARS_TRUCKS/2382307"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AC COMPRESSOR",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AC_COMPRESSOR/2382426"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AC CONDENSER",
    "price": "$71.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AC_CONDENSER/2382437"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382478"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382480"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382475"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382477"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382479"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_BAG/2382476"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/AIR_CLEANER/2382417"
  },
  {
    "stock": "T32504",
    "year": "2015",
    "makeModel": "JEEP CHEROKEE",
    "part": "ALTERNATOR",
    "price": "$56.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/CHEROKEE/T32504/2015/ALTERNATOR/2382425"
  },
  {
    "stock": "T32515",
    "year": "2018",
    "makeModel": "LAND ROVER VELAR",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/LAND_ROVER/VELAR/T32515/2018/PARTS_CARS_TRUCKS/2381924"
  },
  {
    "stock": "T32514",
    "year": "2021",
    "makeModel": "MAZDA CX-9",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/MAZDA/MAZDA_CX~9/T32514/2021/PARTS_CARS_TRUCKS/2381916"
  },
  {
    "stock": "T32513",
    "year": "2016",
    "makeModel": "FORD EXPLORER",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/FORD/EXPLORER/T32513/2016/PARTS_CARS_TRUCKS/2381891"
  },
  {
    "stock": "T32510",
    "year": "2014",
    "makeModel": "FORD EXPLORER",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/FORD/EXPLORER/T32510/2014/PARTS_CARS_TRUCKS/2381917"
  },
  {
    "stock": "T32511",
    "year": "2018",
    "makeModel": "MERCEDES-BENZ MERCEDES GLC-CLASS",
    "part": "PARTS CARS TRUCKS",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/MERCEDES/MERCEDES_GLE~CLASS/T32511/2018/PARTS_CARS_TRUCKS/2381888"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AC COMPRESSOR",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AC_COMPRESSOR/2381815"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AC CONDENSER",
    "price": "$76.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AC_CONDENSER/2381825"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AIR BAG",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AIR_BAG/2381859"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AIR CLEANER",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AIR_CLEANER/2381807"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "ALTERNATOR",
    "price": "$55.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/ALTERNATOR/2381814"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "ANTI-LOCK BRAKE PARTS",
    "price": "$73.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/ANTI~LOCK_BRAKE_PTS/2381812"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AXLE SHAFT",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AXLE_SHAFT/2381874"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AXLE SHAFT",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AXLE_SHAFT/2381875"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "AXLE SHAFT",
    "price": "$75.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/AXLE_SHAFT/2381876"
  },
  {
    "stock": "T32458",
    "year": "2019",
    "makeModel": "JEEP COMPASS",
    "part": "BLOWER MOTOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/JEEP/COMPASS/T32458/2019/BLOWER_MOTOR/2381817"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "AC COMPRESSOR",
    "price": "$90.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/AC_COMPRESSOR/2381742"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "ALTERNATOR",
    "price": "$79.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/ALTERNATOR/2381741"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "AXLE SHAFT",
    "price": "$82.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/AXLE_SHAFT/2381797"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "AXLE SHAFT",
    "price": "$81.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/AXLE_SHAFT/2381795"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "AXLE SHAFT",
    "price": "$80.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/AXLE_SHAFT/2381796"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "BLOWER MOTOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/BLOWER_MOTOR/2381745"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "BLOWER MOTOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/BLOWER_MOTOR/2381744"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "BRAKE MASTER CYLINDER",
    "price": "$60.00",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/BRAKE_MASTER_CYL/2381740"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "BUMPER ASSEMBLY REAR",
    "price": "Call for Price",
    "grade": "B",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/BUMPER_ASSY_REAR/2381760"
  },
  {
    "stock": "T32495",
    "year": "2019",
    "makeModel": "TOYOTA HIGHLANDER",
    "part": "CAMERA/PROJECTOR",
    "price": "Call for Price",
    "grade": "A",
    "detail": "",
    "url": "https://lindersparts.com/parts/TOYOTA/HIGHLANDER/T32495/2019/CAMERA.PROJECTOR/2381750"
  }
];
