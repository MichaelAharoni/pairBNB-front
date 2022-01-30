import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";

import { utilService } from "../../services/util.service";
import { userService } from "../../services/user.service";
import { stayService } from "../../services/stay.service";
import { openMsg } from "../../store/msg.action";

import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import userSvg from "../../styles/svg/user.svg";

import { createTheme, ThemeProvider } from "@mui/material/styles";

export function AddReview({ stay, set }) {
	const dispatch = useDispatch();
	const [value, setValue] = React.useState("");
	const [rating, setRating] = React.useState([5, 5, 5, 5, 5, 5]);
	const types = ["Cleanliness:", "Communication:", "Check-in:", "Accuracy:", "Location:", "Value:"];

	function MultilineTextFields() {}

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	async function addReview() {
		let avg = (rating[0] + rating[1] + rating[2] + rating[3] + rating[4] + rating[5]) / 6;
		let newStay = stay;
		let user = userService.getLoggedinUser();
		if (user) user = { fullName: user.fullName, imgUrl: user.imgUrl };
		if (!user) user = { fullName: "Guest", imgUrl: userSvg };
		const newReview = {};
		newReview.id = utilService.makeId(10);
		newReview.txt = value;
		newReview.rate = { cleanliness: rating[0], communication: rating[1], checkin: rating[2], accuracy: rating[3], location: rating[4], value: rating[5], avg };
		newReview.by = user;
		newStay.reviews.unshift(newReview);
		const updatedStay = await stayService.update(newStay);

		set({ ...newStay });
		dispatch(openMsg({ txt: "Review added", type: "bnb" }));
		console.log(updatedStay);
	}

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
	const btnTheme = createTheme({
		palette: {
			primary: {
				main: "#222222",
			},
			secondary: {
				main: "#222222",
			},
		},
	});

	return (
		<div>
			<div className='rating-bars-container'>{types.map((type, idx) => RatingBar(type, idx, rating, setRating))}</div>
			<div className='type-area'>
				<ThemeProvider theme={theme}>
					<TextField fullWidth label='Share your exprience with this stay' color='secondary' multiline rows={3} value={value} onChange={handleChange} />
				</ThemeProvider>
			</div>
			<div className='add-review-btn'>
				<ThemeProvider theme={btnTheme}>
					<Button onClick={addReview} variant='outlined' endIcon={<SendIcon />}>
						Add Review
					</Button>
				</ThemeProvider>
			</div>
		</div>
	);
}

function RatingBar(type, idx, value, setValue) {
	// const [value, setValue] = React.useState(5);
	const [hover, setHover] = React.useState(-1);

	function setnewValue() {
		value[idx] = hover;
		setValue([...value]);
		console.log(value);
	}

	return (
		<div className='bar-container'>
			<span className='rating-bar-header'>{type}</span>
			<Rating
				name='hover-feedback'
				value={value[idx]}
				precision={0.5}
				onChange={() => {
					setnewValue();
				}}
				onChangeActive={(event, newHover) => {
					setHover(newHover);
				}}
				emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
			/>
		</div>
	);
}
