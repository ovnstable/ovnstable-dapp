import {mapActions} from "vuex";

export const pool = {
    computed: {

    },
    data() {
        return {
            isZapModalShow: false,
            currentZapPool: null,
            zapPlatformSupportList: [
                'Chronos',
                'Ramses',
                'Thena',
                'Velodrome',
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
                '0xa99817d2d286c894f8f3888096a5616d06f20d46': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'DOLA', address: '0x8ae125e8653821e851f12a49f7765db9a9ce7384'},
                ],

                '0x69c28d5bbe392ef48c0dc347c575023daf0cd243': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'DAI+', address: '0x970d50d09f3a656b43e11b0d45241a84e3a6e011'},
                ],

                '0x947a96b025c70497dbc0d095d966f3b59a675a70': [
                    {name: 'FRAX', address: '0x2e3d870790dc77a83dd1d18184acc7439a53f475'},
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                ],

                '0x67124355cce2ad7a8ea283e990612ebe12730175': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'},
                ],

                '0x8a9cd3dce710e90177b4332c108e159a15736a0f': [
                    {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
                    {name: 'LUSD', address: '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819'},
                ],

                // Ramses
                '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],
            }
        }
    },
    methods: {
        ...mapActions('track', ['trackClick']),

        setIsZapModalShow(isShow) {
            this.isZapModalShow = isShow;
        },
        openZapIn(pool) {
            console.log("Zap open for pool: ", pool);
            this.currentZapPool = pool;
            this.setIsZapModalShow(true);

            try {
                this.trackClick({action: 'click_zap_in', event_category: 'Page view', event_label: 'View zap page' });
            } catch (e) {
                console.error("Track error:", e);
            }
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
                    url = 'https://app.velodrome.finance/liquidity/manage?address=';
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
                    url = 'https://arbidex.fi/add/';
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

                default:
                    url = pool.explorerUrl + '/address/';
                    break;
            }

            if (pool.platform === 'Thena' ||
                pool.platform === 'Wombat' ||
                pool.platform === 'Beefy' ||
                pool.platform === 'Ezkalibur' ||
                pool.platform === 'Mute' ||
                pool.platform === 'Ennead') {
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
