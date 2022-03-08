import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import Decentragram from '../abis/Decentragram.json'

const getWeb3 = async () => 
    new Promise(async (resolve, reject) => {
        let provider = await detectEthereumProvider()
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' })
            try {
                const web3 = new Web3(window.ethereum)
                resolve(web3)
            } catch (error) {
                reject(error)
            }
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask')
            reject('Install MetaMask')
        }
    })

const getContract = async (web3) => {
    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]
    let decentragram
    if(networkData){
        decentragram = web3.eth.Contract(
            Decentragram.abi,
            networkData.address
        )
    } else {
        window.alert('Decentragram contract not deployed to detected network.')
    }
    return decentragram
}

const getAccounts = async () => {
    const accounts = await window.ethereum.request({method: "eth_accounts"})
    return accounts
}
    


export {getWeb3, getContract, getAccounts}