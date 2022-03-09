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
  const [loading, setLoading] = useState(false)
  const [imageCount, setImageCount] = useState(0)
  const [images, setImages] = useState([])

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      const contract = await getContract(web3)
      const accounts = await getAccounts()
      const imageCount = await contract.methods.imageCount().call()
      setWeb3(web3)
      setDecentragram(contract)
      setAccounts(accounts)
      setImageCount(imageCount)
    }
    init()
  }, [])

  useEffect(() => {
    console.log(buffer)
  }, [buffer])

  useEffect(() => {
    const init = async () => {
      if(decentragram){
        for(let i = 0; i <= imageCount; i++){
          const image = await decentragram.methods.images(i).call()
          setImages([...images, image])
          console.log(images)
        }
      }
    }
    init()
  },[imageCount])

  const isReady = () => {
        return (
            typeof web3 !== 'undefined' &&
            typeof decentragram !== 'undefined' &&
            accounts.length > 0 &&
            !loading
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

    ipfs.add(buffer, async (error, result) => {
      console.log('IPFS result', result)
      if(error){
        console.log(error)
        return
      }
      
      setLoading(true)
      await decentragram.methods.uploadImage(result[0].hash, description).send({from: accounts[0]}).on('transactionHash', async (hash) => {
        setImageCount(await decentragram.methods.imageCount().call())
        setLoading(false)
      })
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