import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import jerusalemImg from "../styles/img/jerusalem.jpg";
import dubaiImg from "../styles/img/dubai.jpg";
import vegasImg from "../styles/img/vegas.jpeg";
import parisImg from "../styles/img/paris.jpg";
import hostImg from "../styles/img/host.jpg";

import { toggleIsExplore, toggleHeaderIsActive, toggleHeaderIsTop } from "../store/header.action";
import { setParams } from "../store/stay.action";

export function Home() {
	const dispatch = useDispatch();
	const searchParams = useSelector((state) => state.stayModule.searchParams);
	const heroUrl = "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642610299/imgs/HD_wallpaper__brown_wooden_dock_and_cottages_Maldives_resort_artificial_lights_zxkna8.jpg";
	const history = useHistory();
	useEffect(() => {
		dispatch(
			setParams({
				adults: 1,
				checkIn: null,
				checkOut: null,
				children: 0,
				guestsCount: 1,
				infants: 0,
				location: "",
			})
		);
		dispatch(toggleIsExplore(false));
		dispatch(toggleHeaderIsActive(true));
		dispatch(toggleHeaderIsTop(true));
		return () => {
			dispatch(toggleIsExplore(true));
			dispatch(toggleHeaderIsActive(false));
			dispatch(toggleHeaderIsTop(false));
		};
	}, []);

	function searchCity(city) {
		dispatch(setParams({ ...searchParams, location: city }));
		console.log(searchParams);
		window.scrollTo(0, 0);
		history.push(`/explore/location=${city}`);
	}
	return (
		<main className='home main-layout'>
			<div className='middle-layout'></div>
			<section className='hero full-layout'>
				<img src={heroUrl} alt='Hero Img' />
				<h1 className='hero-title'>Not sure where to go? Perfect.</h1>
				<Link className='home-btn' to={"/explore"}>
					<button className='hero-btn home-btn'>
						<span>Explore</span>
					</button>
				</Link>
			</section>
			<h1 className='middle-layout cities-title'>Popular cities around the word.</h1>
			<section className='popular-cities middle-layout'>
				<article onClick={() => searchCity("Paris")} className='city-container'>
					<img src={parisImg} alt='City Img' />
					<h1>Paris</h1>
				</article>
				<article onClick={() => searchCity("Jerusalem")} className='city-container'>
					<img src={jerusalemImg} alt='City Img' />
					<h1>Jerusalem</h1>
				</article>
				<article onClick={() => searchCity("Dubai")} className='city-container'>
					<img src={dubaiImg} alt='City Img' />
					<h1>Dubai</h1>
				</article>
				<article onClick={() => searchCity("Las Vegas")} className='city-container'>
					<img src={vegasImg} alt='City Img' />
					<h1>Las Vegas</h1>
				</article>
			</section>
			<section className='host middle-layout'>
				<img src={hostImg} alt='Host Img' />
				<h1 className='host-title'>Become a host.</h1>
				<Link to={"/host"}>
					<button className='host-btn home-btn'>
						<span>Start Here</span>
					</button>
				</Link>
			</section>
		</main>
	);
}
