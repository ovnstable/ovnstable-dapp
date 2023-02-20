/*
import { init } from '@web3-onboard/vue';
import injectedModule from '@web3-onboard/injected-wallets';
import uauthModule from '@web3-onboard/uauth'

// initialize the module with options
const uauth = uauthModule({
  clientID: 'YOUR_CLIENT_ID',
  redirectUri: 'YOUR_REDIRECT_URI',
  scope?: 'YOUR_SCOPES',
  shouldLoginWithRedirect?: false
  bridge?: 'YOUR_CUSTOM_BRIDGE_SERVER',
  qrcodeModalOptions?: {
    mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
  },
  connectFirstChainId?: true
})

const injected = injectedModule()

// Only one RPC endpoint required per chain
const rpcAPIKey = '<INFURA_KEY>' || '<ALCHEMY_KEY>'
const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${rpcAPIKey}` || `https://mainnet.infura.io/v3/${rpcAPIKey}`

const web3Onboard = init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl
    }
  ]
})

const { wallets, connectWallet, disconnectConnectedWallet, connectedWallet } =
    useOnboard()

if (connectedWallet) {
  const ethersProvider = new ethers.providers.Web3Provider(
      connectedWallet.provider,
      'any'
  )
  // ..... do stuff with the provider
}

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    uauth
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
*/
