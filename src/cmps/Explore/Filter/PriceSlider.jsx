import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import PropTypes from 'prop-types';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { sortByPrice } from "../../../store/stay.action.js";
function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};

const AirbnbSlider = styled(Slider)(({ theme }) => ({
    color: '#FF385C',
    height: 3,
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 3,
    },
    '& .MuiSlider-rail': {
        color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
        opacity: theme.palette.mode === 'dark' ? undefined : 1,
        height: 3,
    },
}));

function AirbnbThumbComponent(props) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <span className="airbnb-bar" />
            <span className="airbnb-bar" />
            <span className="airbnb-bar" />
        </SliderThumb>
    );
}

AirbnbThumbComponent.propTypes = {
    children: PropTypes.node,
};

export function _PriceSlider({ stays, sortByPrice, filterBy, stayType }) {
    const [stayPrice, setPriceRange] = useState({
        minPrice: 0,
        maxPrice: 1000,
    });

    const handleChange = (event) => {
        let priceRange = event.target.value
        setPriceRange({ minPrice: priceRange[0], maxPrice: priceRange[1] })
    };

    useEffect(() => {
        sortByPrice(stays, filterBy, stayType, stayPrice)
    }, [stayPrice])

    let maxPrice = 1000
    let minPrice = 0

    const stayPrices = stays.map(stay => {
        if (stay.price > maxPrice) maxPrice = stay.price
        if (stay.price < minPrice) minPrice = stay.price
        return stay.price
    })

    return (
        <section className="price-filter-container">
            <Box sx={{ width: 285 }}>
                <Box sx={{ m: 3 }} />
                <AirbnbSlider
                    min={minPrice}
                    name="priceRange"
                    max={maxPrice}
                    onChange={(ev) => handleChange(ev)}
                    // marks={marks}
                    components={{ Thumb: AirbnbThumbComponent }}
                    getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                    defaultValue={[0, 1000]} />
                <div className="price-range flex">
                    <div className="minmax-price">
                        <div className="min-price">Min Price</div>
                        <div className="min-price">${stayPrice.minPrice}</div>
                    </div>
                    <div className="minmax-price">
                        <div className="max-price">Max Price </div>
                        <div className="max-price">${stayPrice.maxPrice}</div>
                    </div>
                </div>
            </Box>
        </section>
    );
}

function mapStateToProps({ stayModule }) {
    return {
        stayType: stayModule.stayType,
        filterBy: stayModule.filterBy,
        stays: stayModule.stays,
        stayPrice: stayModule.stayPrice,
        searchParams: stayModule.searchParams

    };
}
const mapDispatchToProps = {
    sortByPrice,
};

export const PriceSlider = connect(mapStateToProps, mapDispatchToProps)(_PriceSlider);


