import React from 'react';
import { Detector } from 'react-detect-offline';

// eslint-disable-next-line import/no-unresolved
import imgDisconnect from '../../img/icons-disconnected.png';

import './check-connection.css';

function CheckConnection(props) {
  return (
    <Detector
      render={({ online }) =>
        online ? (
          props.children
        ) : (
          <div style={{ paddingTop: '10px', textAlign: 'center' }}>
            <img src={imgDisconnect} alt='' />
            <h1 style={{ marginBottom: '5px' }}>Connection</h1>
            <h4 style={{ margin: '0' }}>
              Please check your internet connection
            </h4>
          </div>
        )
      }
    />
  );
}

export default CheckConnection;
