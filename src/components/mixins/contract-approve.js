import {odosApiService} from "@/services/external/odos-api-service";
import {mapActions} from "vuex";

export const contractApprove = {
    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),


        async getAllowanceValue(contract, from, checkContractAddress) {
            return await contract.methods.allowance(from, checkContractAddress).call();
        },
        async approveToken(contract, contractAddressForApprove, value) {
            console.log('approveToken: ', contract, contractAddressForApprove, value);
            let from = this.account;
            await this.refreshGasPrice();
            let approveParams = {gasPrice: this.gasPriceGwei, from: from};
            console.log('approveToken: ', contract, contractAddressForApprove, value, approveParams);
            return contract.methods.approve(contractAddressForApprove, value).send(approveParams)
        },
        async clearApproveToken(contract, contractAddressForDisapprove) {
            console.log('clearApproveToken: ', contract, contractAddressForDisapprove);
            let from = this.account;
            let allowanceValue = await this.getAllowanceValue(contract, from, contractAddressForDisapprove);
            await this.refreshGasPrice();
            let approveParams = {gasPrice: this.gasPriceGwei, from: from};
            console.log('clearApproveToken: ', contract, contractAddressForDisapprove, allowanceValue, approveParams);
            return contract.methods.decreaseAllowance(contractAddressForDisapprove, allowanceValue).send(approveParams)
        },
    }
}
