import {mapActions} from "vuex";

export const pool = {
    computed: {

    },
    data() {
        return {
            isZapModalShow: false,
            currentZapPool: null,
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
                default:
                    url = pool.explorerUrl + '/address/';
                    break;
            }

            if (pool.platform === 'Thena' ||
                pool.platform === 'Wombat' ||
                pool.platform === 'Beefy' ||
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
