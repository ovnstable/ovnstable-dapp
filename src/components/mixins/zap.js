import loadJSON from "@/utils/http-utils";
import {mapGetters} from "vuex";

export const zap = {

    data() {
        return {
            chronosContract: null,
            pollsMap: {
                "0xb260163158311596ea88a700c5a30f101d072326": '0xcd4a56221175b88d4fb28ca2138d670cc1197ca9',
                "0x0d20ef7033b73ea0c9c320304b05da82e2c14e33": '0xaF618E6F5EF781e3aCFe00708BD005E0cc9A2e6F',
                "0x0df5f52afa0308fdd65423234c4fda9add0b9eba": '0xF319285fa8b5323A40c71D3c006dBd0BE4f5171b',
                "0x69fd0ea1041bc4c495d5371a074bf1dcd6700577": '0xD1C05e0770968c8b9C7dC0f3aC1DD419A3417971',
                "0x94c20b48faed9148a00ccf3229f4e50f791a26b6": '0x8Bc7811fdC24c82E842452F6EA3C7a20e1994889',
                "0xa885a1e7511cf6b572d949b1e60ac0a8449f3b18": '0xc8d79Fd3Ecc0F91d9C56E279Daba12257bE24619',
                "0xbbd7ff1728963a5eb582d26ea90290f84e89bd66": '0x3004F018B2C01d40D19C7dC4a5a0AFA8743a7e24',
                "0xcd78e225e36e724c9fb4bd8287296557d728cda7": '0x7de0998eE1Fce80c160AD1F5Fe768BFF9b0ee87f',
            }
        }
    },
    mounted() {
        this.loadChronosZapContract();
    },
    methods: {

        async loadChronosZapContract() {
            let abiFile = await loadJSON(`/contracts/arbitrum/ChronosZap.json`);
            this.chronosContract = this._loadContract(abiFile, this.web3, abiFile.address);
            console.log("Chronos loaded: ", this.chronosContract);
        },
        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },
        getProportion(poolAddress) {
            let gauge = this.pollsMap[poolAddress];
            if (!gauge) {
                console.log("Error when get proportion. Gauge not found at pool: ", poolAddress)
                return
            }

            return this.chronosContract.methods.getProportion(gauge).call().then(data => {
                console.log('Get proportion: ', poolAddress, gauge, data);
                return data;
            }).catch(e => {
                console.error('Error get proportion for: ', poolAddress, gauge, e);
            });
        }
    }

}
