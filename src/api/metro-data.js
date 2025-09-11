/**
 * 香港地铁站点数据和查询工具
 * Hong Kong MTR Station Data and Query Utils
 */

// 地铁数据 - 请手动从data.json复制数据到这里
const METRO_DATA = {
  lines: {
    AEL: {
      line_code: "AEL",
      line_name: "Airport Express",
      line_name_zh: "机场快线",
      stations: {
        HOK: {
          station_code: "HOK",
          station_name: "Hong Kong",
          station_name_zh: "香港",
          poiid: "BV10313841",
        },
        KOW: {
          station_code: "KOW",
          station_name: "Kowloon",
          station_name_zh: "九龙",
          poiid: "BV10313840",
        },
        TSY: {
          station_code: "TSY",
          station_name: "Tsing Yi",
          station_name_zh: "青衣",
          poiid: "BV10313839",
        },
        AIR: {
          station_code: "AIR",
          station_name: "Airport",
          station_name_zh: "机场",
          poiid: "BV10313838",
        },
        AWE: {
          station_code: "AWE",
          station_name: "AsiaWorld Expo",
          station_name_zh: "博览馆",
          poiid: "BV10313837",
        },
      },
    },
    TCL: {
      line_code: "TCL",
      line_name: "Tung Chung Line",
      line_name_zh: "东涌线",
      stations: {
        HOK: {
          station_code: "HOK",
          station_name: "Hong Kong",
          station_name_zh: "香港",
          poiid: "BV10313841",
        },
        KOW: {
          station_code: "KOW",
          station_name: "Kowloon",
          station_name_zh: "九龙",
          poiid: "BV10313840",
        },
        OLY: {
          station_code: "OLY",
          station_name: "Olympic",
          station_name_zh: "奥运",
          poiid: "BV10321735",
        },
        NAC: {
          station_code: "NAC",
          station_name: "Nam Cheong",
          station_name_zh: "南昌",
          poiid: "BV10321734",
        },
        LAK: {
          station_code: "LAK",
          station_name: "Lai King",
          station_name_zh: "荔景",
          poiid: "BV10321733",
        },
        TSY: {
          station_code: "TSY",
          station_name: "Tsing Yi",
          station_name_zh: "青衣",
          poiid: "BV10313839",
        },
        SUN: {
          station_code: "SUN",
          station_name: "Sunny Bay",
          station_name_zh: "欣澳",
          poiid: "BV10321732",
        },
        TUC: {
          station_code: "TUC",
          station_name: "Tung Chung",
          station_name_zh: "东涌",
          poiid: "BV10321731",
        },
      },
    },
    TML: {
      line_code: "TML",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      stations: {
        WKS: {
          station_code: "WKS",
          station_name: "Wu Kai Sha",
          station_name_zh: "乌溪沙",
          poiid: "BV10321783",
        },
        MOS: {
          station_code: "MOS",
          station_name: "Ma On Shan",
          station_name_zh: "马鞍山",
          poiid: "BV10321784",
        },
        HEO: {
          station_code: "HEO",
          station_name: "Heng On",
          station_name_zh: "恒安",
          poiid: "BV10321785",
        },
        TSH: {
          station_code: "TSH",
          station_name: "Tai Shui Hang",
          station_name_zh: "大水坑",
          poiid: "BV10321786",
        },
        SHM: {
          station_code: "SHM",
          station_name: "Shek Mun",
          station_name_zh: "石门",
          poiid: "BV10321787",
        },
        CIO: {
          station_code: "CIO",
          station_name: "City One",
          station_name_zh: "第一城",
          poiid: "BV10321788",
        },
        STW: {
          station_code: "STW",
          station_name: "Sha Tin Wai",
          station_name_zh: "沙田围",
          poiid: "BV10321789",
        },
        CKT: {
          station_code: "CKT",
          station_name: "Che Kung Temple",
          station_name_zh: "车公庙",
          poiid: "BV10316079",
        },
        TAW: {
          station_code: "TAW",
          station_name: "Tai Wai",
          station_name_zh: "大围",
          poiid: "BV10321740",
        },
        HIK: {
          station_code: "HIK",
          station_name: "Hin Keng",
          station_name_zh: "显径",
          poiid: "BV11334700",
        },
        DIH: {
          station_code: "DIH",
          station_name: "Diamond Hill",
          station_name_zh: "钻石山",
          poiid: "BV10321770",
        },
        KAT: {
          station_code: "KAT",
          station_name: "Kai Tak",
          station_name_zh: "启德",
          poiid: "BV11334699",
        },
        SUW: {
          station_code: "SUW",
          station_name: "Sung Wong Toi",
          station_name_zh: "宋皇台",
          poiid: "BV11567298",
        },
        TKW: {
          station_code: "TKW",
          station_name: "To Kwa Wan",
          station_name_zh: "土瓜湾",
          poiid: "BV11567297",
        },
        HOM: {
          station_code: "HOM",
          station_name: "Ho Man Tin",
          station_name_zh: "何文田",
          poiid: "BV10789130",
        },
        HUH: {
          station_code: "HUH",
          station_name: "Hung Hom",
          station_name_zh: "红磡",
          poiid: "BV10321737",
        },
        ETS: {
          station_code: "ETS",
          station_name: "East Tsim Sha Tsui",
          station_name_zh: "尖东",
          poiid: "BV11567286",
        },
        AUS: {
          station_code: "AUS",
          station_name: "Austin",
          station_name_zh: "柯士甸",
          poiid: "BV11567287",
        },
        NAC: {
          station_code: "NAC",
          station_name: "Nam Cheong",
          station_name_zh: "南昌",
          poiid: "BV10321734",
        },
        MEF: {
          station_code: "MEF",
          station_name: "Mei Foo",
          station_name_zh: "美孚",
          poiid: "BV10314014",
        },
        TWW: {
          station_code: "TWW",
          station_name: "Tsuen Wan West",
          station_name_zh: "荃湾西",
          poiid: "BV11567296",
        },
        KSR: {
          station_code: "KSR",
          station_name: "Kam Sheung Road",
          station_name_zh: "锦上路",
          poiid: "BV11567291",
        },
        YUL: {
          station_code: "YUL",
          station_name: "Yuen Long",
          station_name_zh: "元朗",
          poiid: "BV11567295",
        },
        LOP: {
          station_code: "LOP",
          station_name: "Long Ping",
          station_name_zh: "朗屏",
          poiid: "BV11567290",
        },
        TIS: {
          station_code: "TIS",
          station_name: "Tin Shui Wai",
          station_name_zh: "天水围",
          poiid: "BV11567292",
        },
        SIH: {
          station_code: "SIH",
          station_name: "Siu Hong",
          station_name_zh: "兆康",
          poiid: "BV11567294",
        },
        TUM: {
          station_code: "TUM",
          station_name: "Tuen Mun",
          station_name_zh: "屯门",
          poiid: "BV11567288",
        },
      },
    },
    TKL: {
      line_code: "TKL",
      line_name: "Tseung Kwan O Line",
      line_name_zh: "将军澳线",
      stations: {
        NOP: {
          station_code: "NOP",
          station_name: "North Point",
          station_name_zh: "北角",
          poiid: "BV10313861",
        },
        QUB: {
          station_code: "QUB",
          station_name: "Quarry Bay",
          station_name_zh: "鰂鱼涌",
          poiid: "BV10314366",
        },
        YAT: {
          station_code: "YAT",
          station_name: "Yau Tong",
          station_name_zh: "油塘",
          poiid: "BV10315564",
        },
        TIK: {
          station_code: "TIK",
          station_name: "Tiu Keng Leng",
          station_name_zh: "调景岭",
          poiid: "BV10321774",
        },
        TKO: {
          station_code: "TKO",
          station_name: "Tseung Kwan O",
          station_name_zh: "将军澳",
          poiid: "BV10321728",
        },
        LHP: {
          station_code: "LHP",
          station_name: "LOHAS Park",
          station_name_zh: "康城",
          poiid: "BV10321729",
        },
        HAH: {
          station_code: "HAH",
          station_name: "Hang Hau",
          station_name_zh: "坑口",
          poiid: "BV10321791",
        },
        POA: {
          station_code: "POA",
          station_name: "Po Lam",
          station_name_zh: "宝琳",
          poiid: "BV10321790",
        },
      },
    },
    EAL: {
      line_code: "EAL",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      stations: {
        ADM: {
          station_code: "ADM",
          station_name: "Admiralty",
          station_name_zh: "金钟",
          poiid: "BV10321756",
        },
        EXC: {
          station_code: "EXC",
          station_name: "Exhibition Centre",
          station_name_zh: "会展",
          poiid: "BV11683275",
        },
        HUH: {
          station_code: "HUH",
          station_name: "Hung Hom",
          station_name_zh: "红磡",
          poiid: "BV10321737",
        },
        MKK: {
          station_code: "MKK",
          station_name: "Mong Kok East",
          station_name_zh: "旺角东",
          poiid: "BV10321738",
        },
        KOT: {
          station_code: "KOT",
          station_name: "Kowloon Tong",
          station_name_zh: "九龙塘",
          poiid: "BV10321739",
        },
        TAW: {
          station_code: "TAW",
          station_name: "Tai Wai",
          station_name_zh: "大围",
          poiid: "BV10321740",
        },
        SHT: {
          station_code: "SHT",
          station_name: "Sha Tin",
          station_name_zh: "沙田",
          poiid: "BV10321741",
        },
        FOT: {
          station_code: "FOT",
          station_name: "Fo Tan",
          station_name_zh: "火炭",
          poiid: "BV10321742",
        },
        UNI: {
          station_code: "UNI",
          station_name: "University",
          station_name_zh: "大学",
          poiid: "BV10321743",
        },
        TAP: {
          station_code: "TAP",
          station_name: "Tai Po Market",
          station_name_zh: "大埔墟",
          poiid: "BV10316419",
        },
        TWO: {
          station_code: "TWO",
          station_name: "Tai Wo",
          station_name_zh: "太和",
          poiid: "BV10321786",
        },
        FAN: {
          station_code: "FAN",
          station_name: "Fanling",
          station_name_zh: "粉岭",
          poiid: "BV10321745",
        },
        SHS: {
          station_code: "SHS",
          station_name: "Sheung Shui",
          station_name_zh: "上水",
          poiid: "BV10321746",
        },
        LOW: {
          station_code: "LOW",
          station_name: "Lo Wu",
          station_name_zh: "罗湖",
          poiid: "BV10321747",
        },
        LMC: {
          station_code: "LMC",
          station_name: "Lok Ma Chau",
          station_name_zh: "落马洲",
          poiid: "BV10316441",
        },
      },
    },
    SIL: {
      line_code: "SIL",
      line_name: "South Island Line",
      line_name_zh: "南港岛线",
      stations: {
        ADM: {
          station_code: "ADM",
          station_name: "Admiralty",
          station_name_zh: "金钟",
          poiid: "BV10321756",
        },
        OCP: {
          station_code: "OCP",
          station_name: "Ocean Park",
          station_name_zh: "海洋公园",
          poiid: "BV10836153",
        },
        WCH: {
          station_code: "WCH",
          station_name: "Wong Chuk Hang",
          station_name_zh: "黄竹坑",
          poiid: "BV10836155",
        },
        LET: {
          station_code: "LET",
          station_name: "Lei Tung",
          station_name_zh: "利东",
          poiid: "BV10836154",
        },
        SOH: {
          station_code: "SOH",
          station_name: "South Horizons",
          station_name_zh: "海怡半岛",
          poiid: "BV10836152",
        },
      },
    },
    TWL: {
      line_code: "TWL",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      stations: {
        CEN: {
          station_code: "CEN",
          station_name: "Central",
          station_name_zh: "中环",
          poiid: "BV10313831",
        },
        ADM: {
          station_code: "ADM",
          station_name: "Admiralty",
          station_name_zh: "金钟",
          poiid: "BV10321756",
        },
        TST: {
          station_code: "TST",
          station_name: "Tsim Sha Tsui",
          station_name_zh: "尖沙咀",
          poiid: "BV10313829",
        },
        JOR: {
          station_code: "JOR",
          station_name: "Jordan",
          station_name_zh: "佐敦",
          poiid: "BV10321775",
        },
        YMT: {
          station_code: "YMT",
          station_name: "Yau Ma Tei",
          station_name_zh: "油麻地",
          poiid: "BV10321766",
        },
        MOK: {
          station_code: "MOK",
          station_name: "Mong Kok",
          station_name_zh: "旺角",
          poiid: "BV10321767",
        },
        PRE: {
          station_code: "PRE",
          station_name: "Prince Edward",
          station_name_zh: "太子",
          poiid: "BV10321768",
        },
        SSP: {
          station_code: "SSP",
          station_name: "Sham Shui Po",
          station_name_zh: "深水埗",
          poiid: "BV10321776",
        },
        CSW: {
          station_code: "CSW",
          station_name: "Cheung Sha Wan",
          station_name_zh: "长沙湾",
          poiid: "BV10321777",
        },
        LCK: {
          station_code: "LCK",
          station_name: "Lai Chi Kok",
          station_name_zh: "荔枝角",
          poiid: "BV10314534",
        },
        MEF: {
          station_code: "MEF",
          station_name: "Mei Foo",
          station_name_zh: "美孚",
          poiid: "BV10314014",
        },
        LAK: {
          station_code: "LAK",
          station_name: "Lai King",
          station_name_zh: "荔景",
          poiid: "BV10321733",
        },
        KWF: {
          station_code: "KWF",
          station_name: "Kwai Fong",
          station_name_zh: "葵芳",
          poiid: "BV10321778",
        },
        KWH: {
          station_code: "KWH",
          station_name: "Kwai Hing",
          station_name_zh: "葵兴",
          poiid: "BV10321779",
        },
        TWH: {
          station_code: "TWH",
          station_name: "Tai Wo Hau",
          station_name_zh: "大窝口",
          poiid: "BV10321780",
        },
        TSW: {
          station_code: "TSW",
          station_name: "Tsuen Wan",
          station_name_zh: "荃湾",
          poiid: "BV10321782",
        },
      },
    },
    ISL: {
      line_code: "ISL",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      stations: {
        KET: {
          station_code: "KET",
          station_name: "Kennedy Town",
          station_name_zh: "坚尼地城",
          poiid: "BV10420638",
        },
        HKU: {
          station_code: "HKU",
          station_name: "HKU",
          station_name_zh: "香港大学",
          poiid: "BV10420640",
        },
        SYP: {
          station_code: "SYP",
          station_name: "Sai Ying Pun",
          station_name_zh: "西营盘",
          poiid: "BV10420639",
        },
        SHW: {
          station_code: "SHW",
          station_name: "Sheung Wan",
          station_name_zh: "上环",
          poiid: "BV10321757",
        },
        CEN: {
          station_code: "CEN",
          station_name: "Central",
          station_name_zh: "中环",
          poiid: "BV10313831",
        },
        ADM: {
          station_code: "ADM",
          station_name: "Admiralty",
          station_name_zh: "金钟",
          poiid: "BV10321756",
        },
        WAC: {
          station_code: "WAC",
          station_name: "Wan Chai",
          station_name_zh: "湾仔",
          poiid: "BV10313833",
        },
        CAB: {
          station_code: "CAB",
          station_name: "Causeway Bay",
          station_name_zh: "铜锣湾",
          poiid: "BV10321755",
        },
        TIH: {
          station_code: "TIH",
          station_name: "Tin Hau",
          station_name_zh: "天后",
          poiid: "BV10321754",
        },
        FOH: {
          station_code: "FOH",
          station_name: "Fortress Hill",
          station_name_zh: "炮台山",
          poiid: "BV10580044",
        },
        NOP: {
          station_code: "NOP",
          station_name: "North Point",
          station_name_zh: "北角",
          poiid: "BV10313861",
        },
        QUB: {
          station_code: "QUB",
          station_name: "Quarry Bay",
          station_name_zh: "鰂鱼涌",
          poiid: "BV10314366",
        },
        TAK: {
          station_code: "TAK",
          station_name: "Tai Koo",
          station_name_zh: "太古",
          poiid: "BV10321752",
        },
        SWH: {
          station_code: "SWH",
          station_name: "Sai Wan Ho",
          station_name_zh: "西湾河",
          poiid: "BV10321751",
        },
        SKW: {
          station_code: "SKW",
          station_name: "Shau Kei Wan",
          station_name_zh: "筲箕湾",
          poiid: "BV10313793",
        },
        HFC: {
          station_code: "HFC",
          station_name: "Heng Fa Chuen",
          station_name_zh: "杏花邨",
          poiid: "BV10314411",
        },
        CHW: {
          station_code: "CHW",
          station_name: "Chai Wan",
          station_name_zh: "柴湾",
          poiid: "BV10321749",
        },
      },
    },
    KTL: {
      line_code: "KTL",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      stations: {
        WHA: {
          station_code: "WHA",
          station_name: "Whampoa",
          station_name_zh: "黄埔",
          poiid: "BV10789131",
        },
        HOM: {
          station_code: "HOM",
          station_name: "Ho Man Tin",
          station_name_zh: "何文田",
          poiid: "BV10789130",
        },
        YMT: {
          station_code: "YMT",
          station_name: "Yau Ma Tei",
          station_name_zh: "油麻地",
          poiid: "BV10321766",
        },
        MOK: {
          station_code: "MOK",
          station_name: "Mong Kok",
          station_name_zh: "旺角",
          poiid: "BV10321767",
        },
        PRE: {
          station_code: "PRE",
          station_name: "Prince Edward",
          station_name_zh: "太子",
          poiid: "BV10321768",
        },
        SKM: {
          station_code: "SKM",
          station_name: "Shek Kip Mei",
          station_name_zh: "石硖尾",
          poiid: "BV10321769",
        },
        KOT: {
          station_code: "KOT",
          station_name: "Kowloon Tong",
          station_name_zh: "九龙塘",
          poiid: "BV10321739",
        },
        LOF: {
          station_code: "LOF",
          station_name: "Lok Fu",
          station_name_zh: "乐富",
          poiid: "BV10318167",
        },
        WTS: {
          station_code: "WTS",
          station_name: "Wong Tai Sin",
          station_name_zh: "黄大仙",
          poiid: "BV10314130",
        },
        DIH: {
          station_code: "DIH",
          station_name: "Diamond Hill",
          station_name_zh: "钻石山",
          poiid: "BV10321770",
        },
        CHH: {
          station_code: "CHH",
          station_name: "Choi Hung",
          station_name_zh: "彩虹",
          poiid: "BV10314333",
        },
        KOB: {
          station_code: "KOB",
          station_name: "Kowloon Bay",
          station_name_zh: "九龙湾",
          poiid: "BV10321771",
        },
        NTK: {
          station_code: "NTK",
          station_name: "Ngau Tau Kok",
          station_name_zh: "牛头角",
          poiid: "BV10314847",
        },
        KWT: {
          station_code: "KWT",
          station_name: "Kwun Tong",
          station_name_zh: "观塘",
          poiid: "BV10321772",
        },
        LAT: {
          station_code: "LAT",
          station_name: "Lam Tin",
          station_name_zh: "蓝田",
          poiid: "BV10321773",
        },
        YAT: {
          station_code: "YAT",
          station_name: "Yau Tong",
          station_name_zh: "油塘",
          poiid: "BV10315564",
        },
        TIK: {
          station_code: "TIK",
          station_name: "Tiu Keng Leng",
          station_name_zh: "调景岭",
          poiid: "BV10321774",
        },
      },
    },
    DRL: {
      line_code: "DRL",
      line_name: "Disneyland Resort Line",
      line_name_zh: "迪士尼线",
      stations: {
        SUN: {
          station_code: "SUN",
          station_name: "Sunny Bay",
          station_name_zh: "欣澳",
          poiid: "BV10321732",
        },
        DIS: {
          station_code: "DIS",
          station_name: "Disneyland Resort",
          station_name_zh: "迪士尼",
          poiid: "BV10321748",
        },
      },
    },
  },
  poiid_to_station: {
    BV10313841: [
      {
        line_code: "AEL",
        station_code: "HOK",
        line_name: "Airport Express",
        line_name_zh: "机场快线",
        station_name: "Hong Kong",
        station_name_zh: "香港",
      },
      {
        line_code: "TCL",
        station_code: "HOK",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Hong Kong",
        station_name_zh: "香港",
      },
    ],
    BV10313840: [
      {
        line_code: "AEL",
        station_code: "KOW",
        line_name: "Airport Express",
        line_name_zh: "机场快线",
        station_name: "Kowloon",
        station_name_zh: "九龙",
      },
      {
        line_code: "TCL",
        station_code: "KOW",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Kowloon",
        station_name_zh: "九龙",
      },
    ],
    BV10313839: [
      {
        line_code: "AEL",
        station_code: "TSY",
        line_name: "Airport Express",
        line_name_zh: "机场快线",
        station_name: "Tsing Yi",
        station_name_zh: "青衣",
      },
      {
        line_code: "TCL",
        station_code: "TSY",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Tsing Yi",
        station_name_zh: "青衣",
      },
    ],
    BV10313838: {
      line_code: "AEL",
      station_code: "AIR",
      line_name: "Airport Express",
      line_name_zh: "机场快线",
      station_name: "Airport",
      station_name_zh: "机场",
    },
    BV10313837: {
      line_code: "AEL",
      station_code: "AWE",
      line_name: "Airport Express",
      line_name_zh: "机场快线",
      station_name: "AsiaWorld Expo",
      station_name_zh: "博览馆",
    },
    BV10321735: {
      line_code: "TCL",
      station_code: "OLY",
      line_name: "Tung Chung Line",
      line_name_zh: "东涌线",
      station_name: "Olympic",
      station_name_zh: "奥运",
    },
    BV10321734: [
      {
        line_code: "TCL",
        station_code: "NAC",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Nam Cheong",
        station_name_zh: "南昌",
      },
      {
        line_code: "TML",
        station_code: "NAC",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Nam Cheong",
        station_name_zh: "南昌",
      },
    ],
    BV10321733: [
      {
        line_code: "TCL",
        station_code: "LAK",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Lai King",
        station_name_zh: "荔景",
      },
      {
        line_code: "TWL",
        station_code: "LAK",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Lai King",
        station_name_zh: "荔景",
      },
    ],
    BV10321732: [
      {
        line_code: "TCL",
        station_code: "SUN",
        line_name: "Tung Chung Line",
        line_name_zh: "东涌线",
        station_name: "Sunny Bay",
        station_name_zh: "欣澳",
      },
      {
        line_code: "DRL",
        station_code: "SUN",
        line_name: "Disneyland Resort Line",
        line_name_zh: "迪士尼线",
        station_name: "Sunny Bay",
        station_name_zh: "欣澳",
      },
    ],
    BV10321731: {
      line_code: "TCL",
      station_code: "TUC",
      line_name: "Tung Chung Line",
      line_name_zh: "东涌线",
      station_name: "Tung Chung",
      station_name_zh: "东涌",
    },
    BV10321783: {
      line_code: "TML",
      station_code: "WKS",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Wu Kai Sha",
      station_name_zh: "乌溪沙",
    },
    BV10321784: {
      line_code: "TML",
      station_code: "MOS",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Ma On Shan",
      station_name_zh: "马鞍山",
    },
    BV10321785: {
      line_code: "TML",
      station_code: "HEO",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Heng On",
      station_name_zh: "恒安",
    },
    BV10321786: [
      {
        line_code: "TML",
        station_code: "TSH",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Tai Shui Hang",
        station_name_zh: "大水坑",
      },
      {
        line_code: "EAL",
        station_code: "TWO",
        line_name: "East Rail Line",
        line_name_zh: "东铁线",
        station_name: "Tai Wo",
        station_name_zh: "太和",
      },
    ],
    BV10321787: {
      line_code: "TML",
      station_code: "SHM",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Shek Mun",
      station_name_zh: "石门",
    },
    BV10321788: {
      line_code: "TML",
      station_code: "CIO",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "City One",
      station_name_zh: "第一城",
    },
    BV10321789: {
      line_code: "TML",
      station_code: "STW",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Sha Tin Wai",
      station_name_zh: "沙田围",
    },
    BV10316079: {
      line_code: "TML",
      station_code: "CKT",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Che Kung Temple",
      station_name_zh: "车公庙",
    },
    BV10321740: [
      {
        line_code: "TML",
        station_code: "TAW",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Tai Wai",
        station_name_zh: "大围",
      },
      {
        line_code: "EAL",
        station_code: "TAW",
        line_name: "East Rail Line",
        line_name_zh: "东铁线",
        station_name: "Tai Wai",
        station_name_zh: "大围",
      },
    ],
    BV11334700: {
      line_code: "TML",
      station_code: "HIK",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Hin Keng",
      station_name_zh: "显径",
    },
    BV10321770: [
      {
        line_code: "TML",
        station_code: "DIH",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Diamond Hill",
        station_name_zh: "钻石山",
      },
      {
        line_code: "KTL",
        station_code: "DIH",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Diamond Hill",
        station_name_zh: "钻石山",
      },
    ],
    BV11334699: {
      line_code: "TML",
      station_code: "KAT",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Kai Tak",
      station_name_zh: "启德",
    },
    BV11567298: {
      line_code: "TML",
      station_code: "SUW",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Sung Wong Toi",
      station_name_zh: "宋皇台",
    },
    BV11567297: {
      line_code: "TML",
      station_code: "TKW",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "To Kwa Wan",
      station_name_zh: "土瓜湾",
    },
    BV10789130: [
      {
        line_code: "TML",
        station_code: "HOM",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Ho Man Tin",
        station_name_zh: "何文田",
      },
      {
        line_code: "KTL",
        station_code: "HOM",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Ho Man Tin",
        station_name_zh: "何文田",
      },
    ],
    BV10321737: [
      {
        line_code: "TML",
        station_code: "HUH",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Hung Hom",
        station_name_zh: "红磡",
      },
      {
        line_code: "EAL",
        station_code: "HUH",
        line_name: "East Rail Line",
        line_name_zh: "东铁线",
        station_name: "Hung Hom",
        station_name_zh: "红磡",
      },
    ],
    BV11567286: {
      line_code: "TML",
      station_code: "ETS",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "East Tsim Sha Tsui",
      station_name_zh: "尖东",
    },
    BV11567287: {
      line_code: "TML",
      station_code: "AUS",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Austin",
      station_name_zh: "柯士甸",
    },
    BV10314014: [
      {
        line_code: "TML",
        station_code: "MEF",
        line_name: "Tuen Ma Line",
        line_name_zh: "屯马线",
        station_name: "Mei Foo",
        station_name_zh: "美孚",
      },
      {
        line_code: "TWL",
        station_code: "MEF",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Mei Foo",
        station_name_zh: "美孚",
      },
    ],
    BV11567296: {
      line_code: "TML",
      station_code: "TWW",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Tsuen Wan West",
      station_name_zh: "荃湾西",
    },
    BV11567291: {
      line_code: "TML",
      station_code: "KSR",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Kam Sheung Road",
      station_name_zh: "锦上路",
    },
    BV11567295: {
      line_code: "TML",
      station_code: "YUL",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Yuen Long",
      station_name_zh: "元朗",
    },
    BV11567290: {
      line_code: "TML",
      station_code: "LOP",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Long Ping",
      station_name_zh: "朗屏",
    },
    BV11567292: {
      line_code: "TML",
      station_code: "TIS",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Tin Shui Wai",
      station_name_zh: "天水围",
    },
    BV11567294: {
      line_code: "TML",
      station_code: "SIH",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Siu Hong",
      station_name_zh: "兆康",
    },
    BV11567288: {
      line_code: "TML",
      station_code: "TUM",
      line_name: "Tuen Ma Line",
      line_name_zh: "屯马线",
      station_name: "Tuen Mun",
      station_name_zh: "屯门",
    },
    BV10313861: [
      {
        line_code: "TKL",
        station_code: "NOP",
        line_name: "Tseung Kwan O Line",
        line_name_zh: "将军澳线",
        station_name: "North Point",
        station_name_zh: "北角",
      },
      {
        line_code: "ISL",
        station_code: "NOP",
        line_name: "Island Line",
        line_name_zh: "港岛线",
        station_name: "North Point",
        station_name_zh: "北角",
      },
    ],
    BV10314366: [
      {
        line_code: "TKL",
        station_code: "QUB",
        line_name: "Tseung Kwan O Line",
        line_name_zh: "将军澳线",
        station_name: "Quarry Bay",
        station_name_zh: "鰂鱼涌",
      },
      {
        line_code: "ISL",
        station_code: "QUB",
        line_name: "Island Line",
        line_name_zh: "港岛线",
        station_name: "Quarry Bay",
        station_name_zh: "鰂鱼涌",
      },
    ],
    BV10315564: [
      {
        line_code: "TKL",
        station_code: "YAT",
        line_name: "Tseung Kwan O Line",
        line_name_zh: "将军澳线",
        station_name: "Yau Tong",
        station_name_zh: "油塘",
      },
      {
        line_code: "KTL",
        station_code: "YAT",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Yau Tong",
        station_name_zh: "油塘",
      },
    ],
    BV10321774: [
      {
        line_code: "TKL",
        station_code: "TIK",
        line_name: "Tseung Kwan O Line",
        line_name_zh: "将军澳线",
        station_name: "Tiu Keng Leng",
        station_name_zh: "调景岭",
      },
      {
        line_code: "KTL",
        station_code: "TIK",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Tiu Keng Leng",
        station_name_zh: "调景岭",
      },
    ],
    BV10321728: {
      line_code: "TKL",
      station_code: "TKO",
      line_name: "Tseung Kwan O Line",
      line_name_zh: "将军澳线",
      station_name: "Tseung Kwan O",
      station_name_zh: "将军澳",
    },
    BV10321729: {
      line_code: "TKL",
      station_code: "LHP",
      line_name: "Tseung Kwan O Line",
      line_name_zh: "将军澳线",
      station_name: "LOHAS Park",
      station_name_zh: "康城",
    },
    BV10321791: {
      line_code: "TKL",
      station_code: "HAH",
      line_name: "Tseung Kwan O Line",
      line_name_zh: "将军澳线",
      station_name: "Hang Hau",
      station_name_zh: "坑口",
    },
    BV10321790: {
      line_code: "TKL",
      station_code: "POA",
      line_name: "Tseung Kwan O Line",
      line_name_zh: "将军澳线",
      station_name: "Po Lam",
      station_name_zh: "宝琳",
    },
    BV10321756: [
      {
        line_code: "EAL",
        station_code: "ADM",
        line_name: "East Rail Line",
        line_name_zh: "东铁线",
        station_name: "Admiralty",
        station_name_zh: "金钟",
      },
      {
        line_code: "SIL",
        station_code: "ADM",
        line_name: "South Island Line",
        line_name_zh: "南港岛线",
        station_name: "Admiralty",
        station_name_zh: "金钟",
      },
      {
        line_code: "TWL",
        station_code: "ADM",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Admiralty",
        station_name_zh: "金钟",
      },
      {
        line_code: "ISL",
        station_code: "ADM",
        line_name: "Island Line",
        line_name_zh: "港岛线",
        station_name: "Admiralty",
        station_name_zh: "金钟",
      },
    ],
    BV11683275: {
      line_code: "EAL",
      station_code: "EXC",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Exhibition Centre",
      station_name_zh: "会展",
    },
    BV10321738: {
      line_code: "EAL",
      station_code: "MKK",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Mong Kok East",
      station_name_zh: "旺角东",
    },
    BV10321739: [
      {
        line_code: "EAL",
        station_code: "KOT",
        line_name: "East Rail Line",
        line_name_zh: "东铁线",
        station_name: "Kowloon Tong",
        station_name_zh: "九龙塘",
      },
      {
        line_code: "KTL",
        station_code: "KOT",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Kowloon Tong",
        station_name_zh: "九龙塘",
      },
    ],
    BV10321741: {
      line_code: "EAL",
      station_code: "SHT",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Sha Tin",
      station_name_zh: "沙田",
    },
    BV10321742: {
      line_code: "EAL",
      station_code: "FOT",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Fo Tan",
      station_name_zh: "火炭",
    },
    BV10321743: {
      line_code: "EAL",
      station_code: "UNI",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "University",
      station_name_zh: "大学",
    },
    BV10316419: {
      line_code: "EAL",
      station_code: "TAP",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Tai Po Market",
      station_name_zh: "大埔墟",
    },
    BV10321745: {
      line_code: "EAL",
      station_code: "FAN",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Fanling",
      station_name_zh: "粉岭",
    },
    BV10321746: {
      line_code: "EAL",
      station_code: "SHS",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Sheung Shui",
      station_name_zh: "上水",
    },
    BV10321747: {
      line_code: "EAL",
      station_code: "LOW",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Lo Wu",
      station_name_zh: "罗湖",
    },
    BV10316441: {
      line_code: "EAL",
      station_code: "LMC",
      line_name: "East Rail Line",
      line_name_zh: "东铁线",
      station_name: "Lok Ma Chau",
      station_name_zh: "落马洲",
    },
    BV10836153: {
      line_code: "SIL",
      station_code: "OCP",
      line_name: "South Island Line",
      line_name_zh: "南港岛线",
      station_name: "Ocean Park",
      station_name_zh: "海洋公园",
    },
    BV10836155: {
      line_code: "SIL",
      station_code: "WCH",
      line_name: "South Island Line",
      line_name_zh: "南港岛线",
      station_name: "Wong Chuk Hang",
      station_name_zh: "黄竹坑",
    },
    BV10836154: {
      line_code: "SIL",
      station_code: "LET",
      line_name: "South Island Line",
      line_name_zh: "南港岛线",
      station_name: "Lei Tung",
      station_name_zh: "利东",
    },
    BV10836152: {
      line_code: "SIL",
      station_code: "SOH",
      line_name: "South Island Line",
      line_name_zh: "南港岛线",
      station_name: "South Horizons",
      station_name_zh: "海怡半岛",
    },
    BV10313831: [
      {
        line_code: "TWL",
        station_code: "CEN",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Central",
        station_name_zh: "中环",
      },
      {
        line_code: "ISL",
        station_code: "CEN",
        line_name: "Island Line",
        line_name_zh: "港岛线",
        station_name: "Central",
        station_name_zh: "中环",
      },
    ],
    BV10313829: {
      line_code: "TWL",
      station_code: "TST",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Tsim Sha Tsui",
      station_name_zh: "尖沙咀",
    },
    BV10321775: {
      line_code: "TWL",
      station_code: "JOR",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Jordan",
      station_name_zh: "佐敦",
    },
    BV10321766: [
      {
        line_code: "TWL",
        station_code: "YMT",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Yau Ma Tei",
        station_name_zh: "油麻地",
      },
      {
        line_code: "KTL",
        station_code: "YMT",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Yau Ma Tei",
        station_name_zh: "油麻地",
      },
    ],
    BV10321767: [
      {
        line_code: "TWL",
        station_code: "MOK",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Mong Kok",
        station_name_zh: "旺角",
      },
      {
        line_code: "KTL",
        station_code: "MOK",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Mong Kok",
        station_name_zh: "旺角",
      },
    ],
    BV10321768: [
      {
        line_code: "TWL",
        station_code: "PRE",
        line_name: "Tsuen Wan Line",
        line_name_zh: "荃湾线",
        station_name: "Prince Edward",
        station_name_zh: "太子",
      },
      {
        line_code: "KTL",
        station_code: "PRE",
        line_name: "Kwun Tong Line",
        line_name_zh: "观塘线",
        station_name: "Prince Edward",
        station_name_zh: "太子",
      },
    ],
    BV10321776: {
      line_code: "TWL",
      station_code: "SSP",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Sham Shui Po",
      station_name_zh: "深水埗",
    },
    BV10321777: {
      line_code: "TWL",
      station_code: "CSW",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Cheung Sha Wan",
      station_name_zh: "长沙湾",
    },
    BV10314534: {
      line_code: "TWL",
      station_code: "LCK",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Lai Chi Kok",
      station_name_zh: "荔枝角",
    },
    BV10321778: {
      line_code: "TWL",
      station_code: "KWF",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Kwai Fong",
      station_name_zh: "葵芳",
    },
    BV10321779: {
      line_code: "TWL",
      station_code: "KWH",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Kwai Hing",
      station_name_zh: "葵兴",
    },
    BV10321780: {
      line_code: "TWL",
      station_code: "TWH",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Tai Wo Hau",
      station_name_zh: "大窝口",
    },
    BV10321782: {
      line_code: "TWL",
      station_code: "TSW",
      line_name: "Tsuen Wan Line",
      line_name_zh: "荃湾线",
      station_name: "Tsuen Wan",
      station_name_zh: "荃湾",
    },
    BV10420638: {
      line_code: "ISL",
      station_code: "KET",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Kennedy Town",
      station_name_zh: "坚尼地城",
    },
    BV10420640: {
      line_code: "ISL",
      station_code: "HKU",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "HKU",
      station_name_zh: "香港大学",
    },
    BV10420639: {
      line_code: "ISL",
      station_code: "SYP",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Sai Ying Pun",
      station_name_zh: "西营盘",
    },
    BV10321757: {
      line_code: "ISL",
      station_code: "SHW",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Sheung Wan",
      station_name_zh: "上环",
    },
    BV10313833: {
      line_code: "ISL",
      station_code: "WAC",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Wan Chai",
      station_name_zh: "湾仔",
    },
    BV10321755: {
      line_code: "ISL",
      station_code: "CAB",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Causeway Bay",
      station_name_zh: "铜锣湾",
    },
    BV10321754: {
      line_code: "ISL",
      station_code: "TIH",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Tin Hau",
      station_name_zh: "天后",
    },
    BV10580044: {
      line_code: "ISL",
      station_code: "FOH",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Fortress Hill",
      station_name_zh: "炮台山",
    },
    BV10321752: {
      line_code: "ISL",
      station_code: "TAK",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Tai Koo",
      station_name_zh: "太古",
    },
    BV10321751: {
      line_code: "ISL",
      station_code: "SWH",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Sai Wan Ho",
      station_name_zh: "西湾河",
    },
    BV10313793: {
      line_code: "ISL",
      station_code: "SKW",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Shau Kei Wan",
      station_name_zh: "筲箕湾",
    },
    BV10314411: {
      line_code: "ISL",
      station_code: "HFC",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Heng Fa Chuen",
      station_name_zh: "杏花邨",
    },
    BV10321749: {
      line_code: "ISL",
      station_code: "CHW",
      line_name: "Island Line",
      line_name_zh: "港岛线",
      station_name: "Chai Wan",
      station_name_zh: "柴湾",
    },
    BV10789131: {
      line_code: "KTL",
      station_code: "WHA",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Whampoa",
      station_name_zh: "黄埔",
    },
    BV10321769: {
      line_code: "KTL",
      station_code: "SKM",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Shek Kip Mei",
      station_name_zh: "石硖尾",
    },
    BV10318167: {
      line_code: "KTL",
      station_code: "LOF",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Lok Fu",
      station_name_zh: "乐富",
    },
    BV10314130: {
      line_code: "KTL",
      station_code: "WTS",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Wong Tai Sin",
      station_name_zh: "黄大仙",
    },
    BV10314333: {
      line_code: "KTL",
      station_code: "CHH",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Choi Hung",
      station_name_zh: "彩虹",
    },
    BV10321771: {
      line_code: "KTL",
      station_code: "KOB",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Kowloon Bay",
      station_name_zh: "九龙湾",
    },
    BV10314847: {
      line_code: "KTL",
      station_code: "NTK",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Ngau Tau Kok",
      station_name_zh: "牛头角",
    },
    BV10321772: {
      line_code: "KTL",
      station_code: "KWT",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Kwun Tong",
      station_name_zh: "观塘",
    },
    BV10321773: {
      line_code: "KTL",
      station_code: "LAT",
      line_name: "Kwun Tong Line",
      line_name_zh: "观塘线",
      station_name: "Lam Tin",
      station_name_zh: "蓝田",
    },
    BV10321748: {
      line_code: "DRL",
      station_code: "DIS",
      line_name: "Disneyland Resort Line",
      line_name_zh: "迪士尼线",
      station_name: "Disneyland Resort",
      station_name_zh: "迪士尼",
    },
  },
};

/**
 * 香港地铁查询工具类
 */
class HKMetroQuery {
  constructor(data = METRO_DATA) {
    this.data = data;
  }

  /**
   * 根据POI ID获取站点信息
   * @param {string} poiid - POI ID
   * @returns {Object|Array|null} 站点信息（单线路返回对象，换乘站返回数组，未找到返回null）
   */
  getStationByPoiId(poiid) {
    return this.data.poiid_to_station[poiid] || null;
  }

  /**
   * 根据POI ID获取所有相关线路信息
   * @param {string} poiid - POI ID
   * @returns {Array} 包含所有线路信息的数组
   */
  getAllLinesByPoiId(poiid) {
    const stationInfo = this.getStationByPoiId(poiid);
    if (!stationInfo) return [];

    // 如果是单线路站点，转换为数组格式
    if (!Array.isArray(stationInfo)) {
      return [stationInfo];
    }

    // 如果是换乘站，直接返回数组
    return stationInfo;
  }

  /**
   * 根据POI ID获取主要线路的线路代码和站点代码
   * @param {string} poiid - POI ID
   * @returns {Object} {lineCode, stationCode} 或 {lineCode: null, stationCode: null}
   */
  getPrimaryLineAndStationCodes(poiid) {
    const lines = this.getAllLinesByPoiId(poiid);
    if (lines.length > 0) {
      return {
        lineCode: lines[0].line_code,
        stationCode: lines[0].station_code,
      };
    }
    return { lineCode: null, stationCode: null };
  }

  /**
   * 根据POI ID获取站点中英文名称
   * @param {string} poiid - POI ID
   * @returns {Object} {englishName, chineseName} 或 {englishName: null, chineseName: null}
   */
  getStationNames(poiid) {
    const lines = this.getAllLinesByPoiId(poiid);
    if (lines.length > 0) {
      return {
        englishName: lines[0].station_name,
        chineseName: lines[0].station_name_zh,
      };
    }
    return { englishName: null, chineseName: null };
  }

  /**
   * 判断是否为换乘站
   * @param {string} poiid - POI ID
   * @returns {boolean} true表示是换乘站，false表示不是
   */
  isInterchangeStation(poiid) {
    const stationInfo = this.getStationByPoiId(poiid);
    return Array.isArray(stationInfo);
  }

  /**
   * 获取换乘站的所有线路代码
   * @param {string} poiid - POI ID
   * @returns {Array} 线路代码数组，如果不是换乘站返回空数组
   */
  getInterchangeLines(poiid) {
    if (this.isInterchangeStation(poiid)) {
      const lines = this.getAllLinesByPoiId(poiid);
      return lines.map((line) => line.line_code);
    }
    return [];
  }

  /**
   * 根据线路代码获取线路信息
   * @param {string} lineCode - 线路代码（如 'AEL', 'TCL' 等）
   * @returns {Object|null} 线路信息或null
   */
  getLineInfo(lineCode) {
    return this.data.lines[lineCode] || null;
  }

  /**
   * 根据线路代码和站点代码获取站点信息
   * @param {string} lineCode - 线路代码
   * @param {string} stationCode - 站点代码
   * @returns {Object|null} 站点信息或null
   */
  getStationInfo(lineCode, stationCode) {
    const lineInfo = this.getLineInfo(lineCode);
    if (lineInfo && lineInfo.stations) {
      return lineInfo.stations[stationCode] || null;
    }
    return null;
  }

  /**
   * 获取所有线路列表
   * @returns {Array} 线路信息数组
   */
  getAllLines() {
    return Object.keys(this.data.lines).map((lineCode) => ({
      lineCode,
      ...this.data.lines[lineCode],
    }));
  }

  /**
   * 根据线路代码获取该线路的所有站点
   * @param {string} lineCode - 线路代码
   * @returns {Array} 站点信息数组
   */
  getStationsByLine(lineCode) {
    const lineInfo = this.getLineInfo(lineCode);
    if (lineInfo && lineInfo.stations) {
      return Object.keys(lineInfo.stations).map((stationCode) => ({
        stationCode,
        ...lineInfo.stations[stationCode],
      }));
    }
    return [];
  }

  /**
   * 搜索站点（根据中文或英文名称）
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的站点信息数组
   */
  searchStations(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();

    Object.keys(this.data.lines).forEach((lineCode) => {
      const lineInfo = this.data.lines[lineCode];
      Object.keys(lineInfo.stations).forEach((stationCode) => {
        const station = lineInfo.stations[stationCode];
        const englishMatch = station.station_name
          .toLowerCase()
          .includes(lowerKeyword);
        const chineseMatch = station.station_name_zh.includes(keyword);

        if (englishMatch || chineseMatch) {
          results.push({
            lineCode,
            lineName: lineInfo.line_name,
            lineNameZh: lineInfo.line_name_zh,
            stationCode,
            stationName: station.station_name,
            stationNameZh: station.station_name_zh,
            poiid: station.poiid,
          });
        }
      });
    });

    return results;
  }

  /**
   * 获取所有换乘站信息
   * @returns {Array} 换乘站信息数组
   */
  getAllInterchangeStations() {
    const interchangeStations = [];

    Object.keys(this.data.poiid_to_station).forEach((poiid) => {
      if (this.isInterchangeStation(poiid)) {
        const lines = this.getAllLinesByPoiId(poiid);
        interchangeStations.push({
          poiid,
          stationName: lines[0].station_name,
          stationNameZh: lines[0].station_name_zh,
          lines: lines.map((line) => ({
            lineCode: line.line_code,
            lineName: line.line_name,
            lineNameZh: line.line_name_zh,
          })),
        });
      }
    });

    return interchangeStations;
  }

  /**
   * 验证POI ID是否存在
   * @param {string} poiid - POI ID
   * @returns {boolean} true表示存在，false表示不存在
   */
  isValidPoiId(poiid) {
    return this.data.poiid_to_station.hasOwnProperty(poiid);
  }

  /**
   * 获取数据统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const lines = Object.keys(this.data.lines);
    let totalStations = 0;
    let totalPoiIds = Object.keys(this.data.poiid_to_station).length;
    let interchangeStations = 0;

    lines.forEach((lineCode) => {
      const stations = this.data.lines[lineCode].stations;
      totalStations += Object.keys(stations).length;
    });

    Object.keys(this.data.poiid_to_station).forEach((poiid) => {
      if (this.isInterchangeStation(poiid)) {
        interchangeStations++;
      }
    });

    return {
      totalLines: lines.length,
      totalStations,
      totalPoiIds,
      interchangeStations,
      singleLineStations: totalPoiIds - interchangeStations,
    };
  }
}

// 创建默认实例
const hkMetro = new HKMetroQuery();

// ES6模块导出（推荐用于Vue 3）
export { METRO_DATA, HKMetroQuery, hkMetro };

// 默认导出
export default hkMetro;

// 兼容其他模块系统
if (typeof module !== "undefined" && module.exports) {
  // Node.js
  module.exports = {
    METRO_DATA,
    HKMetroQuery,
    hkMetro,
  };
} else if (typeof window !== "undefined") {
  // 浏览器环境
  window.METRO_DATA = METRO_DATA;
  window.HKMetroQuery = HKMetroQuery;
  window.hkMetro = hkMetro;
}

// 使用示例（在浏览器控制台或Node.js中测试）
/*
// 基本查询
console.log(hkMetro.getStationNames('BV10321756')); // 金钟站
console.log(hkMetro.getPrimaryLineAndStationCodes('BV10321756'));

// 换乘站查询
console.log(hkMetro.isInterchangeStation('BV10321756')); // true
console.log(hkMetro.getInterchangeLines('BV10321756')); // ['EAL', 'SIL', 'TWL', 'ISL']

// 搜索功能
console.log(hkMetro.searchStations('金钟'));
console.log(hkMetro.searchStations('Central'));

// 统计信息
console.log(hkMetro.getStatistics());
*/
