import React from 'react';

const WoodruffMap = () => {

    return (
        <div>
            <iframe href="https://www.mappedin.com/"
            title="Mappedin Map"
            name="Mappedin Map"
            allow="clipboard-write 'self' https://app.mappedin.com; web-share 'self' https://app.mappedin.com"
            scrolling="no"
            width="100%"
            height="650"
            frameborder="0"
            style={{border:0}}
            src="https://app.mappedin.com/map/673a8bd3b67da0000c41d3f4?embedded=true"></iframe>
        </div>
    );
};

export default WoodruffMap;