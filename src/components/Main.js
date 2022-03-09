import Identicon from 'identicon.js';
import React, {useState} from 'react'

function Main({captureFile, uploadImage, images, tipImageOwner, web3}) {
  const [description, setDescription] = useState('')

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            
            <h2>Share Image</h2>

            <form onSubmit={(event) => {
              event.preventDefault()
              uploadImage(description.value)
            }}>
              <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile}/>
              <div className="form-group mr-sm-2">
                <br></br>
                <input 
                  id="imageDescription"
                  type="text"
                  ref={(input) => {setDescription(input)}}
                  className="form-control"
                  placeholder="Image Description..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
            </form>

            <p>&nbsp;</p>
              
              {images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img 
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(image.author, 30)}`}
                        alt=""
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-items">
                        <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}} alt=""/></p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name)
                            tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;