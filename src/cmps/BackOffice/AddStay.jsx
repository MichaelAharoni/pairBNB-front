import React from "react";

import { stayService } from "../../services/stay.service";

import { SpecialBtn } from "../../cmps/General/SpecialBtn";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { userService } from "../../services/user.service";

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

const amenities = [
	"Shampoo",
	"Suitable for events",
	"Security cameras",
	"Wifi",
	"Washer",
	"TV",
	"Stove",
	"Smoking allowed",
	"Essentials",
	"Smoke alarm",
	"Refrigerator",
	"Private entrance",
	"Pool",
	"Long term stays allowed",
	"Pets allowed",
	"Patio or balcony",
	"Iron",
	"Kitchen",
	"Ethernet connection",
	"Indoor fireplace",
	"Free parking on premises",
	"Hair dryer",
	"Heating",
	"Hot water",
	"Hangers",
	"Fire extinguisher",
	"First aid kit",
	"Extra pillows and blankets",
	"Air conditioning",
	"BBQ grill",
	"Beach access",
	"Bed linens",
	"Coffee maker",
	"Cooking basics",
	"Dedicated workspace",
	'Dishes and silverware"',
	"Dishwasher",
];

export function AddStay() {
	const [stayName, setStayName] = React.useState("");
	const [stayAdress, setStayAdress] = React.useState("");
	const [stayCapacity, setStayCapacity] = React.useState("");
	const [stayPrice, setStayPrice] = React.useState("");
	const [placeType, setPlaceType] = React.useState("");
	const [spaceType, setSpaceType] = React.useState("");
	const [stayDescription, setStayDescription] = React.useState("");
	const [stayAmenities, setStayAmenities] = React.useState([]);
	const [stayImgs, setStayImgs] = React.useState([null, null, null, null, null]);

	function uploadImg(ev, idx) {
		const CLOUD_NAME = "dqj9g5gso";
		const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

		const formData = new FormData();
		formData.append("file", ev.target.files[0]);
		formData.append("upload_preset", "xj6rycmx");

		return fetch(UPLOAD_URL, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((res) => {
				const newUrls = stayImgs;
				newUrls[idx] = res.url;
				setStayImgs([...newUrls]);
				console.log(stayImgs);
			})
			.catch((err) => console.error(err));
	}

	const handleChangeName = (event) => {
		setStayName(event.target.value);
	};

	const handleChangeAdress = (event) => {
		setStayAdress(event.target.value);
	};

	const handleChangeCapacity = (event) => {
		setStayCapacity(event.target.value);
	};
	const handleChangePrice = (event) => {
		setStayPrice(event.target.value);
	};
	const handleChangePlaceType = (event) => {
		setPlaceType(event.target.value);
	};
	const handleChangeSpaceType = (event) => {
		setSpaceType(event.target.value);
	};
	const handleChangeDescription = (event) => {
		setStayDescription(event.target.value);
	};

	const handleChangeAmenities = (event) => {
		let amenity = event.target.name;
		if (!event.target.checked) {
			let currIdx = stayAmenities.indexOf(amenity);
			stayAmenities.splice(currIdx, 1);
			setStayAmenities(stayAmenities);
			return;
		}
		stayAmenities.push(amenity);
		setStayAmenities(stayAmenities);
	};

	function addStay() {
		let stay = { stayName, stayAdress, stayCapacity, stayPrice, placeType, spaceType, stayDescription, stayAmenities, stayImgs };
		stayService.save(stay);
		const user = userService.getLoggedinUser();
		userService.setLoggedinUser({...user, isHost:true})
	}

	return (
		<ThemeProvider theme={theme}>
			<div className='add-stay-container main-layout'>
				<div className='stay-primary-details'>
					<div className='add-input-box'>
						<TextField required id='outlined-required' onChange={handleChangeName} name='name' label='Name' />
					</div>
					<div className='add-input-box'>
						<TextField className='add-input-box' required id='outlined-required' onChange={handleChangeAdress} name='adress' label='Adress' />
					</div>
					<div className='add-input-number'>
						<TextField
							id='outlined-number'
							type='number'
							required
							InputLabelProps={{
								shrink: true,
							}}
							onChange={handleChangePrice}
							name='price'
							label='Price $/night'
							placeholder='0'
						/>
					</div>
					<div className='add-input-number'>
						<TextField
							id='outlined-number'
							type='number'
							InputLabelProps={{
								shrink: true,
							}}
							onChange={handleChangeCapacity}
							name='capacity'
							label='Capacity'
							placeholder='1'
						/>
					</div>
					<div className='add-input-dropdown'>
						<Box>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>Place Type</InputLabel>
								<Select labelId='demo-simple-select-label' id='demo-simple-select' value={placeType} label='Place-Type' name='place-type' onChange={handleChangePlaceType}>
									<MenuItem value={"Duplex"}>Duplex</MenuItem>
									<MenuItem value={"Villa"}>Villa</MenuItem>
									<MenuItem value={"Loft"}>Loft</MenuItem>
									<MenuItem value={"Cabin"}>Cabin</MenuItem>
									<MenuItem value={"Home"}>Home</MenuItem>
									<MenuItem value={"Hotel"}>Hotel room</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</div>
					<div className='add-input-dropdown'>
						<Box style={{ color: "#FF385C" }}>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>Space Type</InputLabel>

								<Select labelId='demo-simple-select-label' id='demo-simple-select' value={spaceType} label='Space-Type' name='space-type' onChange={handleChangeSpaceType}>
									<MenuItem value={"Entire Place"}>Entire place</MenuItem>
									<MenuItem value={"Hotel Room"}>Hotel room</MenuItem>
									<MenuItem value={"Private Room"}>Private room</MenuItem>
									<MenuItem value={"Shared Room"}>Shared room</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</div>
				</div>

				<TextField
					sx={{ minWidth: 620 }}
					id='outlined-multiline-static'
					label='Describe your asset'
					multiline
					rows={4}
					placeholder='Describe your asset...'
					onChange={handleChangeDescription}
					name='description'
				/>

				<div className='add-images-container'>
					<img />
					<div className='image-upload image1'>
						{stayImgs[0] ? (
							<img src={stayImgs[0]} />
						) : (
							<div className='file-upload'>
								<label>Upload image</label>
								<input placeholder='Upload image' className='file-upload' onChange={(ev) => uploadImg(ev, 0)} type='file' />
							</div>
						)}
					</div>
					<div className='image-upload image2'>
						{stayImgs[1] ? (
							<img src={stayImgs[1]} />
						) : (
							<div className='file-upload'>
								<label>Upload image</label>
								<input placeholder='Upload image' className='file-upload' onChange={(ev) => uploadImg(ev, 1)} type='file' />
							</div>
						)}
					</div>
					<div className='image-upload image3'>
						{stayImgs[2] ? (
							<img src={stayImgs[2]} />
						) : (
							<div className='file-upload'>
								<label>Upload image</label>
								<input placeholder='Upload image' className='file-upload' onChange={(ev) => uploadImg(ev, 2)} type='file' />
							</div>
						)}
					</div>
					<div className='image-upload image4'>
						{stayImgs[3] ? (
							<img src={stayImgs[3]} />
						) : (
							<div className='file-upload'>
								<label>Upload image</label>
								<input placeholder='Upload image' className='file-upload' onChange={(ev) => uploadImg(ev, 3)} type='file' />
							</div>
						)}
					</div>
					<div className='image-upload image5'>
						{stayImgs[4] ? (
							<img src={stayImgs[4]} />
						) : (
							<div className='file-upload'>
								<label>Upload image</label>
								<input placeholder='Upload image' className='file-upload' onChange={(ev) => uploadImg(ev, 4)} type='file' />
							</div>
						)}
					</div>
				</div>
				<label className='amenities-title'>Amenities:</label>
				<div className='amenities-container'>
					<FormGroup className='amenities-list'>
						{amenities.map((amenity, idx) => {
							return <FormControlLabel key={idx} control={<Checkbox style={{ color: "#FF385C" }} />} label={amenity} name={amenity} onChange={handleChangeAmenities} />;
						})}
					</FormGroup>
				</div>
				<div style={{ margin: "20px Auto" }} className='special-btn'>
					<SpecialBtn onClick={addStay} text='Add Stay' size={{ width: "400px", height: "50px" }} />
				</div>
			</div>
		</ThemeProvider>
	);
}
