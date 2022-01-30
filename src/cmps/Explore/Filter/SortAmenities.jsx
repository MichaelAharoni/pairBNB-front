import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import { PlaceTypeFilter } from "./PlaceType.jsx"
import { PriceSlider } from "./PriceSlider.jsx"

import { sortByAmenities } from "../../../store/stay.action.js";

import downArrow from "../../../styles/svg/arrows/down-arrow.svg";
import upArrow from "../../../styles/svg/arrows/up-arrow.svg";

export function _SortAmenities({ sortByAmenities, stayType, stayPrice, stays }) {
    const [filterBy, setFilter] = useState({
        "Wifi": false,
        "TV": false,
        "Kitchen": false,
        "Air conditioning": false,
        "Smoking allowed": false,
        "Pets allowed": false
    })
    const [placeType, toggleTypeSearch] = useState()
    const [isPriceFilter, togglePriceFilter] = useState()

    useEffect(() => {
        sortByAmenities(stays, filterBy, stayType, stayPrice)
    }, [filterBy])

    useEffect(() => {
    }, [placeType])

    function togglePrice() {
        togglePriceFilter(!isPriceFilter)
        toggleTypeSearch(false)
    }

    function togglePlaces() {
        toggleTypeSearch(!placeType)
        togglePriceFilter(false)
    }

    return (<div className="filter-container middle-layout">
        <div className="filter-dropdowns-container">
            <button className="filter-btn" onClick={() => { togglePrice() }} >{isPriceFilter ? <span className="flex"><span>Price </span><img className="filter-arrow" src={upArrow} /></span> : <span className="flex"><span>Price: ${stayPrice.minPrice}-{stayPrice.maxPrice}</span><img className="filter-arrow" src={downArrow} /></span>}</button>
            {isPriceFilter && <PriceSlider />}
            <button className="filter-btn" onClick={() => { togglePlaces() }} >{placeType ? <span className="flex"><span>Type of place </span><img className="filter-arrow" src={upArrow} /></span> : <span className="flex"><span>Type of place </span><img className="filter-arrow" src={downArrow} /></span>}</button>
            {placeType && <PlaceTypeFilter />}
        </div>
        <button className={filterBy["Wifi"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "Wifi": !filterBy["Wifi"] }) }}>Wifi</button>
        <button className={filterBy["TV"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "TV": !filterBy["TV"] }) }}>TV</button>
        <button className={filterBy["Kitchen"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "Kitchen": !filterBy["Kitchen"] }) }}>Kitchen</button>
        <button className={filterBy["Air conditioning"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "Air conditioning": !filterBy["Air conditioning"] }) }}>AC</button>
        <button className={filterBy["Smoking allowed"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "Smoking allowed": !filterBy["Smoking allowed"] }) }}>Smoking Allowed</button>
        <button className={filterBy["Pets allowed"] ? "filter-btn-active" : "filter-btn"} onClick={() => { setFilter({ ...filterBy, "Pets allowed": !filterBy["Pets allowed"] }) }}>Pets Allowed</button>
    </div >
    )

}

function mapStateToProps({ stayModule }) {
    return {
        filterBy: stayModule.filterBy,
        stayType: stayModule.stayType,
        stays: stayModule.stays,
        stayPrice: stayModule.stayPrice,
        searchParams: stayModule.searchParams
    };
}
const mapDispatchToProps = {
    sortByAmenities
};

export const SortAmenities = connect(mapStateToProps, mapDispatchToProps)(_SortAmenities);
