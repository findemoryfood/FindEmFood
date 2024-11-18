import React from 'react';



const IndoorMap = () => {
  return (
    <div>
      <h1>Welcome to the Map</h1>
      <iframe href="https://www.mappedin.com/" 
      title="Mappedin Map" 
      name="Mappedin Map" 
      allow="clipboard-write 'self' https://app.mappedin.com; web-share 'self' https://app.mappedin.com" 
      scrolling="no" 
      width="100%" 
      height="650" 
      frameBorder="0"
      style="border:0" src="https://app.mappedin.com/map/6732310c66ce60000b9169e8?embedded=true"></iframe>
    </div>
  );
};

export default IndoorMap;
