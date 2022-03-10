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
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      const contract = await getContract(web3)
      const accounts = await getAccounts()
      const imageCount = await contract.methods.imageCount().call()
      const images = await loadImages(imageCount.toNumber(), contract)
      setWeb3(web3)
      setDecentragram(contract)
      setAccounts(accounts)
      setImages(images)
      setLoading(false)
    }
    init()
  }, []
  )

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
      await decentragram.methods.uploadImage(result[0].hash, description).send({from: accounts[0]}).on('confirmation', async (hash) => {
        const count = await decentragram.methods.imageCount().call()
        const imagesArray = await loadImages(count.toNumber(), decentragram)
        setImages(imagesArray)
        setLoading(false)
      })
    })
  }

  const tipImageOwner = async (id, tipAmount) => {
    setLoading(true)
    await decentragram.methods.tipImageOwner(id).send({from: accounts[0], value: tipAmount}).on('confirmation', async (hash) => {
      const count = await decentragram.methods.imageCount().call()
      const imagesArray = await loadImages(count.toNumber(), decentragram)
      setImages(imagesArray)
      setLoading(false)
    })
    
  }

  const loadImages = async (imageCount, decentragram) => {
    const imageArray = []
    for(let i = 1; i <= imageCount; i++){
        const image = await decentragram.methods.images(i).call()
        imageArray.push(image)
      }
    return imageArray.sort((a,b) => b.tipAmount - a.tipAmount)
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
          tipImageOwner={tipImageOwner}
          web3={web3}
          />
      }
    </div>
  );
}

export default App;