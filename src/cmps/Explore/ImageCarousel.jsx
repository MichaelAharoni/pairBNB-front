
import React from 'react';
import { useHistory } from 'react-router-dom';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export default function ImageCarousel({ stay }) {

    const history = useHistory()

    function onClickItem(stayId) {
		window.scrollTo(0, 0);
        history.push(`/details/${stayId}`);   
    }

    return (
        <Carousel showThumbs={false} showStatus={false} onClickItem={() => onClickItem(stay._id)}>
            <div>
                <img src={stay.imgUrls[0]} />
            </div>
            <div>
                <img src={stay.imgUrls[1]} />
            </div>
            <div>
                <img src={stay.imgUrls[2]} />
            </div>
            <div>
                <img src={stay.imgUrls[3]} />
            </div>
            <div>
                <img src={stay.imgUrls[4]} />
            </div>
        </Carousel>
    );
}
;

