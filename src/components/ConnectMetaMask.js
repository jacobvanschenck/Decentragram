import React from 'react'

function ConnectMetaMask({loadWeb3}) {
    return(
        <div className="text-center mt-5">  
            <button 
                className='btn btn-warning btn-lg mt-5' 
                onClick={() => {
                    loadWeb3()
                }}
            >
                Connect MetaMask
            </button>
        </div>  
    )
}

export default ConnectMetaMask