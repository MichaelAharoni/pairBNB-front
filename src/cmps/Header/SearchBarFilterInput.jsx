import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setParams } from "../../store/stay.action";

import locationSvg from "../../styles/svg/location.svg";

function _SearchBarFilterInput({ placeholder, data, ChooseLocation, elLocationInput, isScreenOpen, setIsScreenOpen, searchBarTabs,updateHeaderActiveTab, setParams, searchParams }) {
	const [filteredData, setFilteredData] = useState([]);

	// const searchParams = useSelector(state => state.stayModule.searchParams.location)

	function handleChange({ target }) {
		const { value } = target;
		let newFilter = data.filter((item) => item.loc.country.toLowerCase().includes(value.toLowerCase()) || item.loc.address.toLowerCase().includes(value.toLowerCase()));
		if (!value) newFilter = [];
		setFilteredData(newFilter);
		setParams({ ...searchParams, location: value });
	}

	function onPlaceClick(ev, location) {
		ev.stopPropagation();
		setIsScreenOpen(false);
		setParams({ ...searchParams, location });
		ChooseLocation(location);
		updateHeaderActiveTab("check-in");
	}

	return (
		<article className='search-filter-container'>
			<div className='search-filter-inputs'>
				<input
					autoComplete='off'
					ref={elLocationInput}
					id='location'
					className='search-input'
					value={searchParams.location}
					placeholder={placeholder}
					onChange={handleChange}
					type='text'
				/>
				<div className='search-icon'></div>
				{filteredData.length !== 0 && isScreenOpen && searchBarTabs === "location" && (
					<ul
						className={`data-result 
      `}>
						{filteredData.map((value, idx) => {
							return (
								<li onClick={(ev) => onPlaceClick(ev, value.loc.address)} key={value.loc.country + idx} className='data-item'>
									<img src={locationSvg} />
									<p>
										{value.loc.address} , <small>{value.loc.country}</small>
									</p>
								</li>
							);
						})}
					</ul>
				)}
				{!filteredData.length && isScreenOpen && searchBarTabs === "location" && (
					<article className='flexible-btn-container'>
						<p>GO ANYWHERE, ANYTIME</p>
						<Link to={`/explore`}>
							<button className='hero-btn home-btn'>
								<span>I'm flexible</span>
							</button>
						</Link>
					</article>
				)}
			</div>
		</article>
	);
}

function mapStateToProps({ stayModule }) {
	return {
		searchParams: stayModule.searchParams,
	};
}
const mapDispatchToProps = {
	setParams,
};

export const SearchBarFilterInput = connect(mapStateToProps, mapDispatchToProps)(_SearchBarFilterInput);
