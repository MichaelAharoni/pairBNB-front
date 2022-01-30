import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { toggleDetailsLayout, toggleHeaderIsActive } from "../../store/header.action";
import { setParams } from "../../store/stay.action";
import { stayService } from "../../services/stay.service";

import { Guests } from "../General/Guests";
import { SearchBarFilterInput } from "./SearchBarFilterInput";
import { SearchBarDatePicker } from "./SearchBarDatePicker";
import { SpecialBtn } from "../General/SpecialBtn";

import searchSvg from "../../styles/svg/search.svg";

function _SearchBar({ searchBarTabs, handleSearchBarTabs, setSearchBarTabsActive, isScreenOpen, setIsScreenOpen, searchParams, setParams, isMobileWidth, isTop }) {
	const [locationsData, setLocationsData] = useState(null);

	const elLocationInput = useRef();
	const history = useHistory();

	useEffect(() => {
		(async () => {
			const data = await stayService.query();
			data.unshift({ loc: { country: "Israel", address: "Ramat Hagolan" } });
			setLocationsData(data);
		})();
		window.addEventListener("scroll", handleSearchBarTabs);
		return () => {
			window.removeEventListener("scroll", handleSearchBarTabs);
		};
	}, []);

	function updateHeaderActiveTab(elName, ev) {
		ev?.stopPropagation();
		ev?.preventDefault();
		if (elName === "location" && searchBarTabs !== elName) {
			setIsScreenOpen(true);
			elLocationInput.current.focus();
		} else elLocationInput.current.blur();
		// elName === "check-in" || elName === "check-out" ? setIsScreenOpen(true) : setIsScreenOpen(false);
		setIsScreenOpen(elName === "check-in" || elName === "check-out");
		if (searchBarTabs === elName) {
			setSearchBarTabsActive(null);
			setIsScreenOpen(false);
		} else {
			setSearchBarTabsActive(elName);
			setIsScreenOpen(true);
		}
	}

	function onSearch(ev) {
		if (searchBarTabs !== "guests") ev.stopPropagation();
		const searchKeys = Object.keys(searchParams);
		let params = "/explore/";
		searchParams.location = searchParams.location.charAt(0).toUpperCase() + searchParams.location.slice(1);
		searchKeys.forEach((key) => (params += `${key}=${searchParams[key]}&`));
		history.push(params.slice(0, -1));
	}

	function ChooseLocation(location) {
		setParams({ ...searchParams, location });
	}

	function ChooseDates(dates) {
		const checkIn = dates[0] ? new Date(dates[0]).toDateString() : null;
		const checkOut = dates[1] ? new Date(dates[1]).toDateString() : null;
		setParams({ ...searchParams, checkIn, checkOut });
	}

	return (
		<div className={"bar original " + ((searchBarTabs || (!isTop && isMobileWidth)) && "active-search-bar")}>
			{isScreenOpen && (searchBarTabs === "check-in" || searchBarTabs === "check-out") && <SearchBarDatePicker searchBarTabs={searchBarTabs} updateHeaderActiveTab={updateHeaderActiveTab} ChooseDates={ChooseDates} />}
			<div onClick={(ev) => updateHeaderActiveTab("location", ev)} className={"location original " + (searchBarTabs === "location" && !isMobileWidth ? "active" : "")}>
				<p className='location-txt'>Location</p>
				<SearchBarFilterInput
					searchBarTabs={searchBarTabs}
					updateHeaderActiveTab={updateHeaderActiveTab}
					setIsScreenOpen={setIsScreenOpen}
					isScreenOpen={isScreenOpen}
					elLocationInput={elLocationInput}
					ChooseLocation={ChooseLocation}
					placeholder={"Where are you going ?"}
					data={locationsData}
				/>
			</div>
			<hr />
			<div onClick={(ev) => updateHeaderActiveTab("check-in", ev)} className={"check-in original " + (searchBarTabs === "check-in" ? "active" : "")}>
				<p>Check in</p>
				<input className='bar-input' readOnly type='text' placeholder={searchParams.checkIn ? searchParams.checkIn : "Add dates"} />
			</div>
			<hr />
			<div onClick={(ev) => updateHeaderActiveTab("check-out", ev)} className={"check-out original " + (searchBarTabs === "check-out" ? "active" : "")}>
				<p>Check out</p>
				<input className='bar-input' readOnly type='text' placeholder={searchParams.checkOut ? searchParams.checkOut : "Add dates"} />
			</div>
			<hr />
			<div onClick={(ev) => updateHeaderActiveTab("guests", ev)} className={"guests original " + ((searchBarTabs === "guests" && !isMobileWidth) ? "active" : "")}>
				<p>Guests</p>
				{searchBarTabs === "guests" && (
					<div className='header-guests'>
						<Guests init={searchParams} set={setParams} />
					</div>
				)}
				<input value={searchParams.guestsCount === 1 ? "" : searchParams.guestsCount} readOnly className='bar-input' type='text' placeholder='Add guests' />
				<div className='special-btn search-special-btn'>
					<SpecialBtn
						onClick={onSearch}
						args={searchParams}
						isActive={searchBarTabs}
						size={{ width: "50px", height: "50px" }}
						text={<img src={searchSvg} className='search-svg' alt='' />}
					/>
				</div>
			</div>
		</div>
	);
}

function mapStateToProps({ headerModule, stayModule }) {
	return {
		headerMode: headerModule.headerMode,
		searchParams: stayModule.searchParams,
	};
}
const mapDispatchToProps = {
	toggleDetailsLayout,
	toggleHeaderIsActive,
	setParams,
};

export const SearchBar = connect(mapStateToProps, mapDispatchToProps)(_SearchBar);
