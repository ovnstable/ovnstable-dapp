import { mapActions, mapGetters } from "vuex";
import { poolApiService } from "@/services/pool-api-service";
import {
  USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM,
  USD_PLUS_CONTRACT_ADDRESS_ARBITRUM
} from "@/utils/const";

export const pool = {
  computed: {
    ...mapGetters("network", [
      "allNetworkConfigs",
      "appApiUrl",
      "networkName",
      "networkId",
      "polygonConfig",
      "bscConfig",
      "opConfig",
      "arConfig",
      "zkConfig",
      "switchToOtherNetwork",
      "getParams"
    ])
  },
  data() {
    return {
      sortedPoolList: [],
      sortedPoolSecondList: [],
      pools: [],
      isPoolsLoading: true,

      topPool: null,

      // todo: remove after presale
      aerodromePool: null,
      velodromePool: null,

      typeOfPool: "ALL", // ALL, OVN

      isZapModalShow: false,
      currentZapPool: null,
      zapPlatformSupportList: [
        // 'Chronos',
        "Thena",
        "Velodrome",
        "Aerodrome",
        "Ramses",
        "Arbidex",
        "Sperax",
        "Convex",
        // 'Defiedge',
        // 'Baseswap',
        "Velocimeter",
        "Alienbase",
        "Swapbased",
        "Curve",
        "Pancake",
        "Beefy"
      ],
      poolTokensForZapMap: {
        // Chronos
        // pool address
        "0xb260163158311596ea88a700c5a30f101d072326": [
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          },
          {
            name: "DAI+",
            address: "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
          }
        ],
        "0xbbd7ff1728963a5eb582d26ea90290f84e89bd66": [
          {
            name: "DOLA",
            address: "0x6a7661795c374c0bfc635934efaddff3a7ee23b6"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        "0x0d20ef7033b73ea0c9c320304b05da82e2c14e33": [
          {
            name: "FRAX",
            address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        "0xcd78e225e36e724c9fb4bd8287296557d728cda7": [
          {
            name: "LUSD",
            address: "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        // Thena
        "0x1561d9618db2dcfe954f5d51f4381fa99c8e5689": [
          {
            name: "USDT+",
            address: "0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        "0x1f3ca66c98d682fa1bec31264692dad4f17340bc": [
          {
            name: "HAY",
            address: "0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        // Velodrome
        "0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d": [
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8cf2b920918e23032"
          },
          {
            name: "DOLA",
            address: "0x8ae125e8653821e851f12a49f7765db9a9ce7384"
          }
        ],

        "0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223": [
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8cf2b920918e23032"
          },
          {
            name: "DAI+",
            address: "0x970d50d09f3a656b43e11b0d45241a84e3a6e011"
          }
        ],

        "0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B": [
          {
            name: "FRAX",
            address: "0x2e3d870790dc77a83dd1d18184acc7439a53f475"
          },
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8cf2b920918e23032"
          }
        ],

        "0xd95E98fc33670dC033424E7Aa0578D742D00f9C7": [
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8cf2b920918e23032"
          },
          {
            name: "USDC",
            address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607"
          }
        ],

        "0x37e7D30CC180A750C83D68ED0C2511dA10694d63": [
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8cf2b920918e23032"
          },
          {
            name: "LUSD",
            address: "0xc40f949f8a4e094d1b49a23ea9241d289b7b2819"
          }
        ],

        "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0": [
          {
            name: "OVN",
            address: "0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e"
          },
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8CF2B920918e23032"
          }
        ],

        // Ramses
        "0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb": [
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          },
          {
            name: "DAI+",
            address: "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
          }
        ],

        // Demeter Sperax TODO: TOKEN ADDRESSES need to update
        "0x9be8026c5c55a3d5513d4c6607355b3678c0afdb": [
          {
            name: "USDS",
            address: "0xD74f5255D557944cf7Dd0E45FF521520002D5748"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        // Arbidex
        "0xeE5e74Dc56594d070E0827ec270F974A68EBAF22": [
          {
            name: "DAI",
            address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
          },
          {
            name: "DAI+",
            address: "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
          }
        ],

        "0xE8C060d40D7Bc96fCd5b758Bd1437C8653400b0e": [
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          },
          {
            name: "DAI+",
            address: "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
          }
        ],

        "0xECe52B1fc32D2B4f22eb45238210b470a64bfDd5": [
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          },
          {
            name: "USDC.E",
            address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
          }
        ],

        "0xb0Fb1787238879171Edc30b9730968600D55762A": [
          {
            name: "FRAX",
            address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
          },
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          }
        ],

        // '0xEa5f97aab76E397E4089137345c38b5c4e7939B3': [
        //     {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
        //     {name: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'},
        // ],

        "0x306132b6147751B85E608B4C1EC452E111531eA2": [
          {
            name: "FRAX",
            address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
          },
          {
            name: "DAI+",
            address: "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
          }
        ],

        // Defiedge
        // '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3': [
        //     {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
        //     {name: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'},
        // ],

        // Baseswap
        "0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A": [
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],

        "0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306": [
          {
            name: "DAI+",
            address: "0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275"
          },
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          }
        ],

        // Velocimeter
        "0x298c9f812c470598c5f97e3da9261a9899b89d35": [
          // gauge 0x0daf00a383f8897553ac1d03f4445b15afa1dcb9
          {
            name: "DAI+",
            address: "0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275"
          },
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          }
        ],

        "0x653685aa9913c6ab13d659a4ea8f358ecec3d34f": [
          // gauge 0xD9875fBe2A706f9Fed68F066D7420D63FDC5eD76
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],

        // Alienbase
        "0x553666081db0a8fdb337560009932852059d589a": [
          // 7 pool
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],
        "0xd97a40434627D5c897790DE9a3d2E577Cba5F2E0": [
          // 8 pool
          {
            name: "DAI+",
            address: "0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275"
          },
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          }
        ],

        // Swapbased
        "0x282f9231e5294e7354744df36461c21e0e68061c": [
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],
        "0x164bc404c64fa426882d98dbce9b10d5df656eed": [
          {
            name: "DAI+",
            address: "0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275"
          },
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          }
        ],

        // Aerodrome
        "0x1b05e4e814b3431a48b8164c41eac834d9ce2da6": [
          {
            name: "DAI+",
            address: "0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275"
          },
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          }
        ],

        "0x4a3636608d7bc5776cb19eb72caa36ebb9ea683b": [
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],

        "0xdc0f1f6ecd03ec1c9ffc2a17bababd313477b20e": [
          {
            name: "USD+",
            address: "0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376"
          },
          {
            name: "USDbC",
            address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"
          }
        ],

        "0x8E9154AC849e839d60299E85156bcb589De2693A": [
          {
            name: "DOLA",
            address: "0x4621b7a9c75199271f773ebd9a499dbd165c3191"
          },
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          }
        ],

        "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197": [
          {
            name: "OVN",
            address: "0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396"
          },
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          }
        ],

        // Curve
        "0xda3de145054ED30Ee937865D31B500505C4bDfe7": [
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          },
          {
            name: "crvUSD",
            address: "0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93"
          }
        ],
        // Curve (3 tokens) -> usd+ / fraxbp
        "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013": [
          {
            name: "USD+",
            address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65"
          },
          {
            name: "FRAXbp",
            address: "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5"
          }
        ],

        // Beefy
        "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome": [
          // Aerodrome
          {
            name: "OVN",
            address: "0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396"
          },
          {
            name: "USD+",
            address: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376"
          }
        ],

        "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome": [
          // Velodrome
          {
            name: "OVN",
            address: "0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e"
          },
          {
            name: "USD+",
            address: "0x73cb180bf0521828d8849bc8CF2B920918e23032"
          }
        ],

        // PANCAKE ZAPS
        "0xd01075f7314a6436e8b74fc18069848229d0c555": [
          {
            name: "USD+",
            address: USD_PLUS_CONTRACT_ADDRESS_ARBITRUM
          },
          {
            name: "USDC",
            address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
          }
        ],

        "0xb9c2d906f94b27bc403ab76b611d2c4490c2ae3f": [
          {
            name: "USDT+",
            address: USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM
          },
          {
            name: "USD+",
            address: USD_PLUS_CONTRACT_ADDRESS_ARBITRUM
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions("track", ["trackClick"]),

    setIsZapModalShow(isShow) {
      this.isZapModalShow = isShow;
    },
    openZapInWithInputOvn(pool, clickType) {
      this.openZapIn(pool, clickType);
    },

    openZapIn(pool, clickType) {
      this.currentZapPool = pool;
      this.setIsZapModalShow(true);

      this.trackClickByType(clickType);
    },

    trackClickByType(clickType) {
      if (clickType === "featured") {
        try {
          this.trackClick({
            action: "click_zap_in_featured",
            event_category: "Click button",
            event_label: "View zap featured page"
          });
        } catch (e) {
          console.error("Track error:", e);
        }
        return;
      }

      if (clickType === "pools") {
        try {
          this.trackClick({
            action: "click_zap_in_pools",
            event_category: "Click button",
            event_label: "View zap pools page"
          });
        } catch (e) {
          console.error("Track error:", e);
        }
        return;
      }

      if (clickType === "claim") {
        try {
          this.trackClick({
            action: "click_zap_in_claim",
            event_category: "Click button",
            event_label: "View zap claim page"
          });
        } catch (e) {
          console.error("Track error:", e);
        }
        return;
      }

      console.error("Unknown click type: ", clickType);
    },

    openLink(pool) {
      let url;

      switch (pool.platform) {
        case "Dystopia":
          url = "https://www.dystopia.exchange/liquidity/";
          break;
        case "Cone":
          url = "https://www.cone.exchange/liquidity/";
          break;
        case "Thena":
          url = "https://www.thena.fi/liquidity/";
          break;
        case "QuickSwap":
          url = "https://info.quickswap.exchange/#/pair/";
          break;
        case "Meshswap":
          url = "https://meshswap.fi/exchange/pool/detail/";
          break;
        case "Velodrome":
          url = "https://velodrome.finance/liquidity/?query=usd%2B&filter=all";
          break;
        case "Aerodrome":
          url = "https://aerodrome.finance/liquidity/?query=usd%2B&filter=all";
          break;
        case "Beethoven":
          url = "https://op.beets.fi/pool/";
          break;
        case "Uniswap":
          url = "https://info.uniswap.org/#/polygon/pools/";
          break;
        case "Sushiswap":
          url = "https://www.sushi.com/earn/matic:";
          break;
        case "Solidlizard":
          url = "https://info.solidlizard.finance/pair/";
          break;
        case "Arbidex":
          url = "https://arbidex.fi/farms";
          break;
        case "Sterling":
          url = "https://www.sterling.finance/liquidity/";
          break;
        case "Wombat":
          url = "https://app.wombat.exchange/pool/";
          break;
        case "Solunea":
          url = "https://www.solunea.xyz/liquidity/";
          break;
        case "Ramses":
          url = "https://app.ramses.exchange/liquidity/";
          break;
        case "Velocore":
          url = "https://app.velocore.xyz/liquidity/";
          break;
        case "Chronos":
          url = "https://app.chronos.exchange/liquidity/";
          break;
        case "Gnd":
          url = "https://farm.gndprotocol.com/farms";
          break;
        case "Vesync":
          url = "https://app.vesync.finance/liquidity/";
          break;
        case "Beefy":
          url = "https://app.beefy.com";
          break;
        case "Ennead":
          url = "https://beta.ennead.farm/pools";
          break;
        case "Pearl":
          url = "https://www.pearl.exchange/liquidity/manage/";
          break;
        case "Magixfox":
          url = "https://app.magicfox.fi/vaults/";
          break;
        case "Sperax":
          url = "https://demeter.sperax.io/farm/42161/";
          break;
        case "Ezkalibur":
          url = "https://dapp.ezkalibur.com";
          break;
        case "Mute":
          url = "https://app.mute.io/pool";
          break;
        case "Dracula":
          url = "https://draculafi.xyz/liquidity/";
          break;
        case "Maverick":
          url = "https://app.mav.xyz/pools?chain=324";
          break;
        case "Baseswap":
          url = "https://baseswap.fi/farm";
          break;
        case "Velocimeter":
          url = "https://base.velocimeter.xyz/liquidity";
          break;
        case "Shekel":
          url = "https://shekelswap.finance/#/farm";
          break;
        case "Swapbased":
          url = "https://swapbased.finance/#/farm";
          break;
        case "Curve":
          url = "https://curve.fi/#/arbitrum/pools/factory-v2-117/deposit";
          break;
        case "Alienbase":
          url = "https://app.alienbase.xyz/farms";
          break;
        case "Balancer":
          url = "https://app.balancer.fi/#/arbitrum/pool/";
          break;
        case "Convex": // aggregator of Curve
          url = "https://www.convexfinance.com/stake/arbitrum/13";
          break;
        case "Pancake":
          url = `https://pancakeswap.finance/info/v3/arb/pairs/${pool.address}`;
          break;
        case "Baseswapdefiedge":
          url = "https://baseswap.defiedge.io/s/base/";
          break;
        case "Lynex":
          url = "https://app.lynex.fi/liquidity";
          break;
        case "Frax Finance":
          url = "https://app.frax.finance/staking/";
          break;

        default:
          url = pool.explorerUrl + "/address/";
          break;
      }

      if (
        pool.platform === "Thena" ||
        pool.platform === "Wombat" ||
        pool.platform === "Beefy" ||
        pool.platform === "Ezkalibur" ||
        pool.platform === "Mute" ||
        pool.platform === "Velodrome" ||
        pool.platform === "Aerodrome" ||
        pool.platform === "Ennead" ||
        pool.platform === "Arbidex" ||
        pool.platform === "Gnd" ||
        pool.platform === "Baseswap" ||
        pool.platform === "Velocimeter" ||
        pool.platform === "Swapbased" ||
        pool.platform === "Shekel" ||
        pool.platform === "Maverick" ||
        pool.platform === "Alienbase" ||
        pool.platform === "Convex" ||
        pool.platform === "Pancake" ||
        pool.platform === "Lynex"
      ) {
        window.open(url, "_blank").focus();
        return;
      }

      if (pool.platform === "Frax Finance") {
        url = url + "convex-usdplus-fraxbp";
        window.open(url, "_blank").focus();
        return;
      }

      // promoting / exceptions
      if (
        pool.platform === "Defiedge" &&
        pool.address === "0xd1c33d0af58eb7403f7c01b21307713aa18b29d3"
      ) {
        url = "https://app.defiedge.io/s/optimism/" + pool.address;
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Defiedge" &&
        pool.address === "0x4784be205996d53d7a40bdb4e1d7b84e551d71d4"
      ) {
        url = "https://app.defiedge.io/s/arbitrum/" + pool.address;
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Defiedge" &&
        pool.address === "0x73f7039224c88378de8e2ce31b13debba1f0e05a"
      ) {
        url = "https://app.defiedge.io/s/arbitrum/" + pool.address;
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Defiedge" &&
        pool.address === "0x35a3b69f579ed1b0b88dc433ebcd7c65fdf57389"
      ) {
        url = "https://app.defiedge.io/s/arbitrum/" + pool.address;
        window.open(url, "_blank").focus();
        return;
      }

      if (pool.platform === "Beethoven") {
        url += pool.address + "000200000000000000000105";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Balancer" &&
        pool.address === "0xa8af146d79ac0bb981e4e0d8b788ec5711b1d5d0"
      ) {
        url += pool.address + "00000000000000000000047b";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Balancer" &&
        pool.address === "0x519cce718fcd11ac09194cff4517f12d263be067"
      ) {
        url += pool.address + "000000000000000000000382";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Balancer" &&
        pool.address === "0xd6d20527c7b0669989ee082b9d3a1c63af742290"
      ) {
        url += pool.address + "000000000000000000000483";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Balancer" &&
        pool.address === "0x85ec6ae01624ae0d2a04d0ffaad3a25884c7d0f3"
      ) {
        url += pool.address + "0002000000000000000004b6";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Balancer" &&
        pool.address === "0xa036553ad30f077bd46c37b1e8ac28e010d7b39e"
      ) {
        url =
          "https://app.balancer.fi/#/base/pool/" +
          pool.address +
          "000200000000000000000056";
        window.open(url, "_blank").focus();
        return;
      }

      if (pool.address === "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013") {
        url = "https://www.convexfinance.com/stake/arbitrum/13";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Curve" &&
        pool.address === "0xda3de145054ED30Ee937865D31B500505C4bDfe7"
      ) {
        url = "https://curve.fi/#/base/pools/factory-v2-2/deposit";
        window.open(url, "_blank").focus();
        return;
      }

      if (pool.platform === "Velocore" && pool.chainName === "linea") {
        url = "https://linea.velocore.xyz/stable-liquidity";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Velocore" &&
        pool.address === "0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6"
      ) {
        url = "https://zksync.velocore.xyz/stable-liquidity";
        window.open(url, "_blank").focus();
        return;
      }

      if (
        pool.platform === "Velocore" &&
        pool.address === "0x4b9f00860d7f42870addeb687fa4e47062df71d9"
      ) {
        url =
          "https://zksync-v1.velocore.xyz/liquidity/0x4b9f00860d7f42870addeb687fa4e47062df71d9";
        window.open(url, "_blank").focus();
        return;
      }

      url += pool.address;
      window.open(url, "_blank").focus();
    },
    async loadPools() {
      this.isPoolsLoading = true;

      this.pools = [];
      let networkConfigList = [...this.allNetworkConfigs];

      for (let networkConfig of networkConfigList) {
        await poolApiService
          .getAllPools(networkConfig.appApiUrl)
          .then((data) => {
            if (data) {
              data.forEach((pool) => {
                if (
                  this.typeOfPool === "OVN" &&
                  !pool.id.name.toLowerCase().includes("ovn")
                ) {
                  return;
                }

                let token0Icon;
                let token1Icon;
                let token2Icon;
                let token3Icon;

                let tokenNames = pool.id.name.split("/");

                if (pool?.id?.name === "Convex USD+FRAXBP") {
                  tokenNames = ["USD+", "FRAX"];
                }

                try {
                  token0Icon = require("@/assets/currencies/farm/" +
                    tokenNames[0] +
                    ".svg");
                } catch (e) {
                  try {
                    token0Icon = require("@/assets/currencies/farm/" +
                      tokenNames[0] +
                      ".png");
                  } catch (ex) {
                    // token0Icon = require('@/assets/currencies/undefined.svg');
                    token0Icon = null;
                  }
                }

                try {
                  token1Icon = require("@/assets/currencies/farm/" +
                    tokenNames[1] +
                    ".svg");
                } catch (e) {
                  try {
                    token1Icon = require("@/assets/currencies/farm/" +
                      tokenNames[1] +
                      ".png");
                  } catch (ex) {
                    // token1Icon = require('@/assets/currencies/undefined.svg');
                    token1Icon = null;
                  }
                }

                if (tokenNames[2]) {
                  try {
                    token2Icon = require("@/assets/currencies/farm/" +
                      tokenNames[2] +
                      ".svg");
                  } catch (e) {
                    try {
                      token2Icon = require("@/assets/currencies/farm/" +
                        tokenNames[2] +
                        ".png");
                    } catch (ex) {
                      // token2Icon = require('@/assets/currencies/undefined.svg');
                      token2Icon = null;
                    }
                  }
                }

                if (tokenNames[3]) {
                  try {
                    token3Icon = require("@/assets/currencies/farm/" +
                      tokenNames[3] +
                      ".svg");
                  } catch (e) {
                    try {
                      token3Icon = require("@/assets/currencies/farm/" +
                        tokenNames[3] +
                        ".png");
                    } catch (ex) {
                      // token3Icon = require('@/assets/currencies/undefined.svg');
                      token3Icon = null;
                    }
                  }
                }

                if (pool && pool?.tvl >= 0) {
                  // todo move to backend
                  if (
                    this.zapPlatformSupportList.includes(pool.platform) &&
                    Object.keys(this.poolTokensForZapMap).some(
                      (item) =>
                        item.toLowerCase() === pool.id.address.toLowerCase()
                    )
                  ) {
                    pool.zappable = true;
                  }

                  // todo move to backend
                  pool = this.initAggregators(pool);

                  const newName = pool.id.name.toUpperCase();
                  let platform = pool.platform;

                  // cases when LP staking platform differ from actual
                  if (
                    pool.id.address ===
                    "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013"
                  ) {
                    platform = "Convex";
                  }

                  this.pools.push({
                    id: pool.id.name + pool.tvl + pool.platform,
                    name: newName,
                    token0Icon: token0Icon,
                    token1Icon: token1Icon,
                    token2Icon: token2Icon,
                    token3Icon: token3Icon,
                    chain: networkConfig.networkId,
                    chainName: networkConfig.networkName,
                    address: pool.id.address,
                    platform,
                    tvl: pool.tvl,
                    apr: pool.apr,
                    skimEnabled: pool.skimEnabled,
                    explorerUrl: networkConfig.explorerUrl,
                    feature: pool.feature,
                    zappable: pool.zappable,
                    cardOpened: false,
                    data: pool,
                    aggregators: pool.aggregators,
                    promoted: pool.promoted,
                    poolNameForAgregator: pool.poolNameForAgregator,
                    isOpened:
                      pool.aggregators && pool.aggregators.length
                        ? false
                        : true, // pools without aggregators always is opened
                    stableFishUrl: null
                  });
                }
              });
            }
          })
          .catch((reason) => {
            console.log("Error get pools data: " + reason);
          });
      }

      // todo move to backend
      if (this.pools && this.pools.length) {
        // init pool at aggregator
        for (let i = 0; i < this.pools.length; i++) {
          let pool = this.pools[i];
          this.initReversePools(pool);
        }

        // init top pool
        const featuredPools = this.pools.filter(
          (pool) => pool.chain == this.networkId && pool.feature
        );
        featuredPools.sort((a, b) => b.apr - a.apr);
        if (featuredPools.length > 0) {
          this.topPool = featuredPools[0];
        } else {
          const topByApr = this.pools.filter(
            (pool) =>
              pool.chain == this.networkId &&
              (pool.tvl > 100000 || pool.promoted)
          );
          topByApr.sort((a, b) => b.apr - a.apr);

          if (topByApr.length > 0) {
            this.topPool = topByApr[0];
          } else {
            // any network
            const randomFeaturedPools = this.pools.filter(
              (pool) => pool.feature
            );
            randomFeaturedPools.sort((a, b) => b.apr - a.apr);
            if (randomFeaturedPools.length > 0) {
              this.topPool =
                randomFeaturedPools[
                  Math.floor(Math.random() * randomFeaturedPools.length)
                ];
            }
          }
        }

        // top pool from all pools
        if (!this.topPool) {
          this.topPool = this.pools.sort((a, b) => b.apr - a.apr);
        }
        /* const filteredPools = this.pools.filter(pool => pool.chain === this.networkId && pool.tvl > 100000);
                filteredPools.sort((a, b) => b.apr - a.apr);

                if (filteredPools.length > 0) {
                    this.topPool = filteredPools[0];
                }

                // top pool on chain not found, get top pool from all pools
                if (!this.topPool) {
                    this.topPool = this.pools.sort((a, b) => b.apr - a.apr);
                }*/

        // end init top pool

        // todo: remove after presale
        this.velodromePool = this.pools.find(
          (pool) =>
            pool.address ===
            "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome"
        );
        this.aerodromePool = this.pools.find(
          (pool) =>
            pool.address ===
            "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome"
        );
      }

      this.pools = this.initFeature(this.pools);

      if (this.typeOfPool === "OVN") {
        this.sortedPoolList = this.getSortedPools(this.pools, true);
        this.sortedPoolSecondList = [];
      } else {
        this.sortedPoolList = this.getSortedPools(this.pools, false);
        this.sortedPoolSecondList = this.getSortedSecondPools(this.pools);
      }

      this.isPoolsLoading = false;

      const map = new Map();

      // map.set('0x0d20ef7033b73ea0c9c320304b05da82e2c14e33', '1482'); // 1. Chronos FRAX/USD+
      // map.set('0xbbd7ff1728963a5eb582d26ea90290f84e89bd66', '1481'); // 2. Chronos DOLA/USD+
      // map.set('0xb260163158311596ea88a700c5a30f101d072326', '1479'); // 3. Chronos USD+/DAI+
      // map.set('0xcd78e225e36e724c9fb4bd8287296557d728cda7', '1483'); // 4. Chronos LUSD/USD+
      map.set("0x1561d9618db2dcfe954f5d51f4381fa99c8e5689", "1577"); // 5. Thena USDT+/USD+
      // map.set('', ''); // 6. Arbidex USD+/USDC.e ****
      map.set("0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223", "1619"); // 7. Velodrome USD+/DAI+
      map.set("0xd95E98fc33670dC033424E7Aa0578D742D00f9C7", "1618"); // 8. Velodrome USD+/USDC
      map.set("0x37e7D30CC180A750C83D68ED0C2511dA10694d63", "1621"); // 9. Velodrome USD+/LUSD
      map.set("0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d", "1620"); // 10. Velodrome USD+/DOLA
      map.set("0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B", "1622"); // 11. Velodrome FRAX/USD+
      map.set("0xd1c33d0af58eb7403f7c01b21307713aa18b29d3", "1625"); // 12. DefiEdge USD+/USDC
      map.set("0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb", "1575"); // 12. Ramses USD+/DAI+
      // map.set('0x571102a88928d74c049849af094a289c27fb794e', '1020'); // . SushiSwap USD+/USDC
      // map.set('0x421a018cc5839c4c0300afb21c725776dc389b1a', '603'); // . Dystopia USD+/USDC

      for (let i = 0; i < this.pools.length; i++) {
        let pool = this.pools[i];
        let stableFishId = map.get(pool.address);

        if (stableFishId) {
          pool.stableFishUrl = "https://stable.fish/defi/" + stableFishId;
        }
      }
    },

    getSortedPools(pools, isOnvPools) {
      let topPools;

      const revertAgg = [
        "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0",
        "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197"
      ];

      const convexDuplicatePromote =
        "0xb34a7d1444a707349bc7b981b7f2e1f20f81f013_convex";

      // if pool tvl too low
      const promotePools = [
        "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
        "0xd01075f7314a6436e8b74fc18069848229d0c555",
        "0xb9c2d906f94b27bc403ab76b611d2c4490c2ae3f",
        // LYNEX
        "0x58aacbccaec30938cb2bb11653cad726e5c4194a",
        "0xc5f4c5c2077bbbac5a8381cf30ecdf18fde42a91",
        // FRAX
        "0x56390acF12bce9675ab3922060D8d955149BE286"
      ];

      // execute revert aggregator
      pools = pools.filter((pool) => {
        if (!revertAgg.includes(pool.address)) false;
        if (pool.address?.toLowerCase() === convexDuplicatePromote) {
          return false;
        }
        return true;
      });

      if (!isOnvPools) {
        topPools = pools.filter((pool) =>
          promotePools.includes(pool.address) ? pool : pool.tvl >= 300000
        );
      } else {
        topPools = pools;
      }

      topPools = topPools.sort((a, b) => {
        if (a.feature && !b.feature) {
          return -1; // a comes first when a is featured and b is not
        } else if (!a.feature && b.feature) {
          return 1; // b comes first when b is featured and a is not
        } else if (a.apr !== b.apr) {
          return b.apr - a.apr; // sort by APR number
        } else {
          return b.tvl - a.tvl; // sort by TVL number
        }
      });

      return [...topPools];
    },

    getSortedSecondPools(pools) {
      let secondPools = pools.filter((pool) => {
        // this is for new pools which TVL do not pass pool.tvl < 300000 && pool.tvl > 100000
        // but its should be displayed
        const exception = [
          "0x0627dcdca49d749583c6a00327eb5e3846e265d3",
          "0x77ca2ddfd61d1d5e5d709cf07549fec3e2d80315"
        ];

        // convex duplicating
        const removeFromSecondPools = [
          "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013"
        ];
        if (removeFromSecondPools.includes(pool.address)) return false;
        // if its tvl higher than restrictions and its promotoed, its gonna duplicate
        if (pool.tvl > 300000 && pool.promoted) return false;

        if (exception.includes(pool.address)) return true;
        if (pool.tvl < 300000 && pool.tvl > 100000) return true;
        if (pool.promoted !== false) return true;

        return false;
      });
      secondPools = secondPools.sort((a, b) => {
        if (a.apr !== b.apr) {
          return b.apr - a.apr; // sort by APR number
        } else {
          return b.tvl - a.tvl; // sort by TVL number
        }
      });

      return [...secondPools];
    },

    initFeature(pools) {
      const topAprByChain = pools.reduce((acc, curr) => {
        const { chain, apr } = curr;

        // ignore binance chain
        if (curr.chainName === "bsc") {
          return acc;
        }

        if (curr.tvl < 500000) {
          return acc;
        }

        if (!acc[chain] || apr > acc[chain].apr) {
          acc[chain] = curr;
          return acc;
        }

        return acc;
      }, {});

      const topAprByAddress = Object.values(topAprByChain).map((_) =>
        _.address?.toLowerCase()
      );

      const newPools = pools.map((entry) => {
        const { address } = entry;

        // promoting special pool in FEATURES/all-pools
        const featurePromote = [
          "0x1b05e4e814b3431a48b8164c41eac834d9ce2da6",
          "0xb9c2d906f94b27bc403ab76b611d2c4490c2ae3f"
        ];
        const convexPromote = ["0xb34a7d1444a707349bc7b981b7f2e1f20f81f013"];
        const loweredAdd = address?.toLowerCase();

        // remove after CONVEX PROMO
        if (convexPromote.includes(loweredAdd)) {
          const aprConvex = pools.find(
            (_) =>
              _?.address.toLowerCase() ===
              "0xb34a7d1444a707349bc7b981b7f2e1f20f81f013_convex"
          );

          return {
            ...entry,
            apr: aprConvex?.apr ?? entry.apr,
            feature: true
          };
        }

        // for all other PROMO FEATURED pools
        if (
          featurePromote.includes(loweredAdd) ||
          topAprByAddress.includes(loweredAdd)
        ) {
          return {
            ...entry,
            feature: true
          };
        }

        return entry;
      });

      return newPools;
    },
    initReversePools(pool) {
      pool.aggregators = [];
      // usd+ dola arb
      let poolAddress = pool.address;

      if (
        poolAddress === "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome"
      ) {
        let findedPool = this.pools.find(
          (data) =>
            data.address === "0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197"
        );
        if (!pool) {
          console.error("Pool not found for aggregation reverse", poolAddress);
          return;
        }

        pool.aggregators.push({
          ...findedPool
        });
      }

      if (
        poolAddress === "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome"
      ) {
        let findedPool = this.pools.find(
          (data) =>
            data.address === "0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0"
        );
        if (!pool) {
          console.error("Pool not found for aggregation reverse", poolAddress);
          return;
        }

        pool.aggregators.push({
          ...findedPool
        });
        return;
      }
    },
    initAggregators(pool) {
      pool.aggregators = [];
      // usd+ dola arb
      let poolAddress = pool.id.address;

      // dola usd+ chronos
      /*  if (poolAddress === '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66')  {
                  pool.aggregators.push({
                      id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                      name: pool.id.name,
                      address: pool.id.address,
                      platform: 'Beefy',
                      zappable: false,
                  })
              }*/

      /*   if (pool.platform === 'Defiedge' || pool.platform === 'Gnd') {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Uniswap',
                    zappable: false,
                    link: 'https://info.uniswap.org/#/optimism/pools/' + pool.id.address
                })

                pool.poolNameForAgregator = 'Uniswap';
            }*/

      if (poolAddress === "0x1F3cA66c98d682fA1BeC31264692daD4f17340BC") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/thena-hay-usd+"
        });
      }

      if (poolAddress === "0xa99817d2d286c894f8f3888096a5616d06f20d46") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/velodrome-usd+-dola"
        });
      }

      if (poolAddress === "0x219fbc3ed20152a9501ddaa47f2a8c193e32d0c6") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/solidlizard-usd+-usdc"
        });
      }

      if (poolAddress === "0x69c28d5bbe392ef48c0dc347c575023daf0cd243") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/velodrome-usd+-dai+"
        });
      }

      if (poolAddress === "0x8a9cd3dce710e90177b4332c108e159a15736a0f") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/velodrome-usd+-lusd"
        });
      }

      if (poolAddress === "0x67124355cce2ad7a8ea283e990612ebe12730175") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Beefy",
          zappable: false,
          link: "https://app.beefy.com/vault/velodrome-usdp-usdc"
        });
      }

      if (poolAddress === "0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb") {
        pool.aggregators.push({
          id: "Aggregator" + pool.id.name + pool.tvl + pool.platform,
          name: pool.id.name,
          address: pool.id.address,
          platform: "Ennead",
          zappable: false
        });
      }

      return pool;
    }
  }
};
