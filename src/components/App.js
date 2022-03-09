import React, {useState, useEffect} from 'react'
import {getWeb3, getContract, getAccounts} from './utils'
import './App.css'
import Navbar from './Navbar'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})


function App() {
  const [web3, setWeb3] = useState(undefined)
  const [decentragram, setDecentragram] = useState(undefined)
  const [accounts, setAccounts] = useState([])
  const [buffer, setBuffer] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      const contract = await getContract(web3)
      const accounts = await getAccounts()
      setWeb3(web3)
      setDecentragram(contract)
      setAccounts(accounts)
    }
    init()
  }, [])

  useEffect(() => {
    console.log(buffer)
  }, [buffer])

  const isReady = () => {
        return (
            typeof web3 !== 'undefined' &&
            typeof decentragram !== 'undefined' &&
            accounts.length > 0
        )
    }

  const captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result))
    }
  }

  const uploadImage = (description) => {
    console.log('Submitting file to ipfs...')

    ipfs.add(buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error){
        console.log(error)
        return
      }
    })
  }
  
  return (
    <div>
      <Navbar account={accounts[0]}/>
      { !isReady()
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
          captureFile={captureFile}
          uploadImage={uploadImage}
          />
      }
    </div>
  );
}

export default App;