import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { loadStays } from "../store/stay.action.js";
import { toggleIsExplore, toggleHeaderIsTop, toggleHeaderIsActive } from "../store/header.action.js";

import { SortAmenities } from "../cmps/Explore/Filter/SortAmenities";
import { StayList } from "../cmps/Explore/StayList.jsx";
import { Loader } from "../cmps/General/Loader";
// import { useParams } from "react-router-dom";

export function _Explore({ match, loadStays, stays, staysToShow, toggleIsExplore }) {
	const [currStays, setCurrStays] = useState(null);
	const [searchLocation, setSearchLocation] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
		(async () => {
			toggleIsExplore(true);
			if (match.params.search) {
				const { search } = match.params;
				let searchParams = search.split("&");
				let params = {};
				searchParams.forEach((param) => {
					let searchObj = param.split("=");
					params[searchObj[0]] = searchObj[1];
				});
				for (let key in params) {
					if (params[key] === "null") params[key] = null;
					else if (!isNaN(+params[key])) params[key] = +params[key];
				}
				if (!params.location) params.location = null;
				setSearchLocation(params.location);
				await loadStays(params);
				setCurrStays({ stays });
			} else {
				await loadStays();
				setCurrStays({ stays });
			}
		})();
	}, [match.params]);

	if (!staysToShow) return <Loader />;
	return (
		<main className='main-layout main-container'>
			<section className='middle-layout'>
				<SortAmenities />
				{searchLocation && (
					<div>
						<div className='sort-stays-seperator'></div>
						<div className='explore-search-stays'>
							{staysToShow.length} stays in {searchLocation}
						</div>
					</div>
				)}
				{!staysToShow.length ? (
					<div className='empty-list'>
						<h2>Nothing comes up here</h2>
						<h3>Try adjusting some of your filters to explore more places to stay.</h3>
					</div>
				) : (
					<StayList staysToShow={staysToShow} />
				)}
			</section>
		</main>
	);
}

function mapStateToProps({ stayModule }) {
	return {
		stays: stayModule.stays,
		staysToShow: stayModule.staysToShow,
	};
}
const mapDispatchToProps = {
	loadStays,
	toggleIsExplore,
	toggleHeaderIsTop,
	toggleHeaderIsActive,
};

export const Explore = connect(mapStateToProps, mapDispatchToProps)(_Explore);
