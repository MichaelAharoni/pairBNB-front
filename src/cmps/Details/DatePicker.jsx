import React, { useState } from "react";
import { useDispatch } from "react-redux";

import addWeeks from "date-fns/addWeeks";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import remove from "../../styles/svg/delete-date.svg";
const mode = window.innerWidth < 780 ? 1 : 2;
const theme = createTheme({
	palette: {
		primary: {
			main: "#FF385C",
		},
		secondary: {
			main: "#FF385C",
		},
	},
});

export function DatePicker({ order, setOrder }) {
	const dispatch = useDispatch();
	const removeUrl = (
		<img onClick={() => dispatch(setOrder({ ...order, checkIn: null, checkOut: null, guestsCount: 1, adults: 1, children: 0, infants: 0 }))} className='clear-dates' src={remove} />
	);

	function getWeeksAfter(date, amount) {
		return date ? addWeeks(date, amount) : undefined;
	}

	return (
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DateRangePicker
					disablePast
					calendars={mode}
					value={[order.checkIn, order.checkOut]}
					maxDate={getWeeksAfter(order.checkIn, 8)}
					onChange={(newValue) => {
						dispatch(setOrder({ ...order, checkIn: newValue[0], checkOut: newValue[1] }));
					}}
					startText='Check-in'
					endText='Check-out'
					renderInput={(startProps, endProps) => (
						<React.Fragment>
							<TextField className={"start-date"} {...startProps} />
							<TextField className={"end-date"} {...endProps} />
							{/* <span>{removeUrl}</span> */}
						</React.Fragment>
					)}
				/>
			</LocalizationProvider>
		</ThemeProvider>
	);
}
