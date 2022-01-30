import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

import { sortByType } from "../../../store/stay.action.js";

export function _PlaceTypeFilter({ sortByType, filterBy, stayPrice, searchParams, stays, stayType }) {
	const handleChange = (event) => {
		const newStayTypes = { ...stayType, [event.target.name]: event.target.checked };
		sortByType(stays, filterBy, newStayTypes, stayPrice, searchParams);
	};

	return (
		<div className='place-type-filter-container'>
			<Box sx={{ display: "flex" }}>
				<FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
					<FormGroup className='place-type-filter'>
						<FormControlLabel
							control={<Checkbox style={{ color: "#FF385C" }} className='type-header' checked={stayType["Entire place"]} onChange={handleChange} name='Entire place' />}
							label='Entire place'
						/>
						<FormHelperText className='type-text'>Have a place to yourself</FormHelperText>

						<FormControlLabel
							control={<Checkbox style={{ color: "#FF385C" }} className='type-header' checked={stayType["Hotel room"]} onChange={handleChange} name='Hotel room' />}
							label='Hotel room'
						/>
						<FormHelperText className='type-text'>Have a private or shared room in a boutique hotel, hostel, and more</FormHelperText>

						<FormControlLabel
							control={<Checkbox style={{ color: "#FF385C" }} className='type-header' checked={stayType["Private room"]} onChange={handleChange} name='Private room' />}
							label='Private room'
						/>
						<FormHelperText className='type-text'>Have your own room and share some common spaces</FormHelperText>

						<FormControlLabel
							control={<Checkbox style={{ color: "#FF385C" }} className='type-header' checked={stayType["Shared room"]} onChange={handleChange} name='Shared room' />}
							label='Shared room'
						/>
						<FormHelperText className='type-text'>Stay in shared space, like a common room </FormHelperText>
					</FormGroup>
				</FormControl>
			</Box>
		</div>
	);
}

function mapStateToProps({ stayModule }) {
	return {
		stayType: stayModule.stayType,
		filterBy: stayModule.filterBy,
		stays: stayModule.stays,
		stayPrice: stayModule.stayPrice,
		searchParams: stayModule.searchParams,
		staysToShow: stayModule.staysToShow,
	};
}
const mapDispatchToProps = {
	sortByType,
};

export const PlaceTypeFilter = connect(mapStateToProps, mapDispatchToProps)(_PlaceTypeFilter);
