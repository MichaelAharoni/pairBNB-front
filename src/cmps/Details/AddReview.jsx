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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import userSvg from "../../styles/svg/user.svg";

export function AddReview({ stay, set }) {
	const dispatch = useDispatch();
	const [value, setValue] = React.useState("");
	const [rating, setRating] = React.useState([5, 5, 5, 5, 5, 5]);
	const types = ["Cleanliness:", "Check-in:", "Accuracy:", "Communication:", "Location:", "Value:"];

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
		newReview.rate = { cleanliness: rating[0], checkin: rating[1], accuracy: rating[2], communication: rating[3], location: rating[4], value: rating[5], avg };
		newReview.by = user;
		newStay.reviews.unshift(newReview);
		await stayService.update(newStay);
		set({ ...newStay });

		dispatch(openMsg({ txt: "Review added", type: "bnb" }));
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
					<a href='#reviews'>
						<Button onClick={addReview} variant='outlined' endIcon={<SendIcon />}>
							Add Review
						</Button>
					</a>
				</ThemeProvider>
			</div>
		</div>
	);
}

function RatingBar(type, idx, value, setValue) {
	const [hover, setHover] = React.useState(-1);

	function setnewValue() {
		value[idx] = hover;
		setValue([...value]);
	}

	return (
		<div key={idx} className='bar-container'>
			<span className='rating-bar-header'>{type}</span>
			<Rating
				name='hover-feedback'
				value={value[idx]}
				precision={0.5}
				onChange={() => {
					setnewValue();
				}}
				onChangeActive={(ev, newHover) => {
					setHover(newHover);
				}}
				emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
			/>
		</div>
	);
}
