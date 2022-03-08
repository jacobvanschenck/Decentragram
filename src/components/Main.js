import React, {useState} from 'react'

function Main(captureFile) {
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
              
              {/* Code ... */}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;