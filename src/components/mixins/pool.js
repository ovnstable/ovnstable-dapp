import {mapActions} from "vuex";

export const pool = {
    computed: {

    },
    data() {
        return {
            isZapModalShow: false,
            currentZapPool: null,
            zapPlatformSupportList: [
                // 'Chronos',
                'Thena',
                'Velodrome',
                'Ramses',
                'Arbidex',
                'Sperax',
                'Defiedge',
            ],
            poolTokensForZapMap: {
                // Chronos
                // pool address
                '0xb260163158311596ea88a700c5a30f101d072326': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],
                '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66': [
                    {name: 'DOLA', address: '0x6a7661795c374c0bfc635934efaddff3a7ee23b6'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                '0x0d20ef7033b73ea0c9c320304b05da82e2c14e33': [
                    {name: 'FRAX', address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                '0xcd78e225e36e724c9fb4bd8287296557d728cda7': [
                    {name: 'LUSD', address: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                // Thena
                '0x1561d9618db2dcfe954f5d51f4381fa99c8e5689': [
                    {name: 'USDT+', address: '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                '0x1f3ca66c98d682fa1bec31264692dad4f17340bc': [
                    {name: 'HAY', address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                // Velodrome
                '0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'DOLA', address: '0x8ae125e8653821e851f12a49f7765db9a9ce7384'},
                ],

                '0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'DAI+', address: '0x970d50d09f3a656b43e11b0d45241a84e3a6e011'},
                ],

                '0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B': [
                    {name: 'FRAX', address: '0x2e3d870790dc77a83dd1d18184acc7439a53f475'},
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                ],

                '0xd95E98fc33670dC033424E7Aa0578D742D00f9C7': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'},
                ],

                '0x37e7D30CC180A750C83D68ED0C2511dA10694d63': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'LUSD', address: '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819'},
                ],

                // Ramses
                '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],

                // Demeter Sperax TODO: TOKEN ADDRESSES need to update
                '0x9be8026c5c55a3d5513d4c6607355b3678c0afdb': [
                    {name: 'USDS', address: '0xD74f5255D557944cf7Dd0E45FF521520002D5748'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],


                // Arbidex
                '0xeE5e74Dc56594d070E0827ec270F974A68EBAF22': [
                    {name: 'DAI', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],

                '0xE8C060d40D7Bc96fCd5b758Bd1437C8653400b0e': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],

                '0xECe52B1fc32D2B4f22eb45238210b470a64bfDd5': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'USDC.E', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'},
                ],


                '0xb0Fb1787238879171Edc30b9730968600D55762A': [
                    {name: 'FRAX', address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                // '0xEa5f97aab76E397E4089137345c38b5c4e7939B3': [
                //     {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                //     {name: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'},
                // ],

                '0x306132b6147751B85E608B4C1EC452E111531eA2': [
                    {name: 'FRAX', address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],

                // Defiedge
                '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'},
                ],

            }
        }
    },
    methods: {
        ...mapActions('track', ['trackClick']),

        setIsZapModalShow(isShow) {
            this.isZapModalShow = isShow;
        },
        openZapIn(pool, clickType) {
            console.log("Zap open for pool: ", pool, clickType);
            this.currentZapPool = pool;
            this.setIsZapModalShow(true);

            this.trackClickByType(clickType);
        },

        trackClickByType(clickType) {
            if (clickType === 'featured') {
                try {
                    this.trackClick({action: 'click_zap_in_featured', event_category: 'Click button', event_label: 'View zap featured page' });
                } catch (e) {
                    console.error("Track error:", e);
                }
                return;
            }

            if (clickType === 'pools') {
                try {
                    this.trackClick({action: 'click_zap_in_pools', event_category: 'Click button', event_label: 'View zap pools page' });
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
                case 'Dystopia':
                    url = 'https://www.dystopia.exchange/liquidity/';
                    break;
                case 'Cone':
                    url = 'https://www.cone.exchange/liquidity/';
                    break;
                case 'Thena':
                    url = 'https://www.thena.fi/liquidity/';
                    break;
                case 'QuickSwap':
                    url = 'https://info.quickswap.exchange/#/pair/'
                    break;
                case 'Meshswap':
                    url = 'https://meshswap.fi/exchange/pool/detail/';
                    break;
                case 'Velodrome':
                    url = 'https://app.velodrome.finance/liquidity/?query=usd%2B&filter=default';
                    break;
                case 'Beethoven':
                    url = 'https://op.beets.fi/pool/';
                    break;
                case 'Uniswap':
                    url = 'https://info.uniswap.org/#/polygon/pools/';
                    break;
                case 'Sushiswap':
                    url = 'https://www.sushi.com/earn/matic:';
                    break;
                case 'Solidlizard':
                    url = 'https://info.solidlizard.finance/pair/';
                    break;
                case 'Arbidex':
                    url = 'https://arbidex.fi/farms';
                    break;
                case 'Sterling':
                    url = 'https://www.sterling.finance/liquidity/';
                    break;
                case 'Wombat':
                    url = 'https://app.wombat.exchange/pool/';
                    break;
                case 'Solunea':
                    url = 'https://www.solunea.xyz/liquidity/';
                    break;
                case 'Ramses':
                    url = 'https://app.ramses.exchange/liquidity/';
                    break;
                case 'Velocore':
                    url = 'https://app.velocore.xyz/liquidity/';
                    break;
                case 'Chronos':
                    url = 'https://app.chronos.exchange/liquidity/';
                    break;
                case 'Gnd':
                    url = 'https://farm.gndprotocol.com/farms';
                    break;
                case 'Vesync':
                    url = 'https://app.vesync.finance/liquidity/';
                    break;
                case 'Beefy':
                    url = 'https://app.beefy.com';
                    break;
                case 'Ennead':
                    url = 'https://beta.ennead.farm/pools';
                    break;
                case 'Pearl':
                    url = 'https://www.pearl.exchange/liquidity/manage/';
                    break;
                case 'Magixfox':
                    url = 'https://app.magicfox.fi/vaults/';
                    break;
                case 'Sperax':
                    url = 'https://demeter.sperax.io/farm/42161/';
                    break;
                case 'Ezkalibur':
                    url = 'https://dapp.ezkalibur.com';
                    break;
                case 'Mute':
                    url = 'https://app.mute.io/pool';
                    break;
                case 'Defiedge':
                    url = 'https://app.defiedge.io/s/optimism/';
                    break;
                case 'Dracula':
                    url = 'https://draculafi.xyz/liquidity';
                    break
                case 'Maverick':
                    url = 'https://app.mav.xyz/pools?chain=324';
                    break

                default:
                    url = pool.explorerUrl + '/address/';
                    break;
            }

            if (pool.platform === 'Thena' ||
                pool.platform === 'Wombat' ||
                pool.platform === 'Beefy' ||
                pool.platform === 'Ezkalibur' ||
                pool.platform === 'Mute' ||
                pool.platform === 'Velodrome' ||
                pool.platform === 'Ennead' ||
                pool.platform === 'Arbidex' ||
                pool.platform === 'Gnd' ||
                pool.platform === 'Maverick') {
                window.open(url, '_blank').focus();
                return;
            }

            if (pool.platform === 'Beethoven') {
                url += pool.address + '0000000000000000000000ae';
                window.open(url, '_blank').focus();
                return;
            }

            url += pool.address;
            window.open(url, '_blank').focus();
        }
    }
}
