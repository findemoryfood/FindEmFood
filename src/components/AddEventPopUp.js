import Popup from 'reactjs-popup';
import React from 'react';
import 'reactjs-popup/dist/index.css';

export default function AddEventPopUp() {
    return (
        <div>
            <h4> </h4>
            <h4> </h4>
            <h4> </h4>
            <h4> </h4>
            <Popup trigger=
                {<button style={{position: 'absolute', bottom: '20px', left: '20px' , width: '150px', height: '50px', fontSize: '25px', fontWeight: 'bold' }}> Add Event </button>} 
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                Event details:
                                <p>[input field 1]</p>
                                <p>[input field 2]</p>
                                <p>[input field 3]</p>
                            </div>
                            <div>
                                <button onClick=
                                    {() => close()}>
                                        Done
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    )
};

// css styles
const styles = {
    button: {
      position: 'absolute',
      bottom: 10,  // Distance from the bottom
      left: 10,    // Distance from the left
      width: 150
    },
  };