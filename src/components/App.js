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
      const images = []
      setWeb3(web3)
      setDecentragram(contract)
      setAccounts(accounts)
      setImageCount(imageCount.toNumber())
      for(let i = 1; i <= imageCount.toNumber(); i++){
        const image = await contract.methods.images(i).call()
        console.log(images)
        images.push(image)
      }
      setImages(images)
    }
    init()
  }, [loading])

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
    console.log(file)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    console.log(reader.result)

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
        const count = await decentragram.methods.imageCount().call()
        console.log(count)
        setImageCount(count.toNumber())
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
          images={images}
          />
      }
    </div>
  );
}

export default App;