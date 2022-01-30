import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";

import { Map } from "../cmps/Details/Map";
import { Loader } from "../cmps/General/Loader";
import { Checkout } from "../cmps/Details/Checkout";
import { Amenities } from "../cmps/Details/Amenities";
import { Review } from "../cmps/Details/Review";
import { AddReview } from "../cmps/Details/AddReview";
import { ReviewStats } from "../cmps/Details/ReviewsStats.jsx";
import ImageCarousel from "../cmps/Explore/ImageCarousel";

import { stayService } from "../services/stay.service";
import { userService } from "../services/user.service";
import { toggleDetailsLayout } from "../store/header.action";

import reviewStar from "../styles/svg/star.svg";
import home from "../styles/svg/entirehome.svg";
import clean from "../styles/svg/clean.svg";
import checkin from "../styles/svg/checkin.svg";
import greyHeart from "../styles/svg/detail-heart.svg";
import pinkHeart from "../styles/svg/pink-heart.svg";
import uploadSvg from "../styles/svg/upload.svg";
import { openMsg } from "../store/msg.action";

function _StayDetails({ toggleDetailsLayout }) {
	const params = useParams();
	const [stay, setStay] = useState(null);
	const [avg, setAvg] = useState(0);
	const [currUser, setCurrUser] = useState(userService.getLoggedinUser());
	const isUserLikeCurrStay = currUser?.likedStays?.some((currStay) => currStay._id === stay?._id);
	console.log(isUserLikeCurrStay);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const stayByid = await stayService.getById(params.id);
			console.log(stayByid);
			getAvgRating(stayByid);
			setStay(stayByid);
			toggleDetailsLayout(true);
		})();
		return () => {
			toggleDetailsLayout(false);
		};
	}, []);

	async function onToggleLikedPlace(stay) {
		let loggedinUser = userService.getLoggedinUser();
		if (!loggedinUser) return dispatch(openMsg({ txt: "Log in first", type: "bnb" }));
		let likedStay = loggedinUser.likedStays.find((currStay) => {
			return currStay._id === stay._id;
		});
		if (likedStay) {
			loggedinUser.likedStays = loggedinUser.likedStays.filter((currStay) => {
				return currStay._id !== likedStay._id;
			});
		} else {
			const miniStay = { _id: stay._id, name: stay.name };
			loggedinUser.likedStays.push(miniStay);
		}
		const userToSave = await userService.getById(loggedinUser._id);
		userToSave.likedStay = loggedinUser.likedStay;
		const newUser = await userService.update(userToSave);
		dispatch(openMsg({ txt: likedStay ? "Stay unliked" : "Stay liked", type: "bnb" }));
		setCurrUser({ ...newUser });
		userService.setLoggedinUser(newUser);
	}

	function onCopyUrlToClipboard() {
		navigator.clipboard.writeText(window.location.href);
		dispatch(openMsg({ txt: "Link Copied to clipboard    ", type: "bnb" }));
	}

	function getAvgRating(stayToAvg) {
		let ammount = 0;
		stayToAvg.reviews.forEach((review) => (ammount += review.rate.avg));
		const divider = stayToAvg.reviews.length;
		let calcAvg = (ammount / divider).toFixed(1);

		if ((calcAvg * 100) % 10 === 0) return setAvg(calcAvg);
		if (isNaN(calcAvg)) calcAvg = "";
		setAvg(calcAvg);
	}

	if (!stay) return <Loader />;

	return (
		<main className='detail-layout main-container details-page'>
			<div className='middle-layout'>
				<h1 className='stay-name-details'>{stay.name}</h1>

				<div className='stay-reviews-details'>
					<div className='flex info-start'>
						<div>
							<img className='star-details' src={reviewStar} />
							<span className='avg-top-details'>{avg}</span>
							<span className='dot-before-reviews'>·</span>
							<a href='#reviews' className='reviews-count-details'>
								{stay.reviews.length} reviews
							</a>
							<span className='dot-before-address'>·</span>
							<a href='#map' className='stay-location-href'>
								<span className='stay-location-details'>{stay.loc.address}</span>
								<span>, </span>
								<span className='stay-location-country'> {stay.loc.country}</span>
							</a>
						</div>
						<div className='flex share-save'>
							<div onClick={onCopyUrlToClipboard} className='flex detail-btn'>
								<img className='heart-details' src={uploadSvg} />
								<div>Share</div>
							</div>
							<div
								onClick={() => {
									onToggleLikedPlace(stay);
								}}
								className='flex detail-btn'>
								{isUserLikeCurrStay ? <img className='heart-details' src={pinkHeart} /> : <img className='heart-details' src={greyHeart} />}
								<div>Save</div>
							</div>
						</div>
					</div>
				</div>

				{window.innerWidth > 780 ? (
					<div className='details-img-container'>
						<img className='main-img' src={stay.imgUrls[0]} alt='' />
						<img className='small-img' src={stay.imgUrls[1]} alt='' />
						<img className='small-img corner-top' src={stay.imgUrls[2]} alt='' />
						<img className='small-img' src={stay.imgUrls[3]} alt='' />
						<img className='small-img corner-bottom' src={stay.imgUrls[4]} alt='' />
					</div>
				) : (
					<div className='details-mobile-carousel'>
						<ImageCarousel stay={stay} />
					</div>
				)}
				<div className='stay-info-container'>
					<div className='stay-info'>
						<div className='host-info flex'>
							<div>
								<h2>
									{stay.type} hosted by <span className='host-name'>{stay.host.fullName}</span>
								</h2>
								<ul className='stay-baths-beds flex'>
									<div>{stay.capacity} guests</div>
									<span className='dot'>·</span>
									<div>{stay.capacity - 1} beds</div>
									<span className='dot'>·</span>
									<div>{parseInt(stay.capacity / 2)} baths</div>
								</ul>
							</div>
							<img className='mini-host-img' src={stay.host.imgUrl} />
						</div>
						<ul className='stay-main-amenities-list'>
							<li className='flex'>
								<img className='stay-main-amenities' src={home} />
								<div>
									<h3>Entire home</h3>
									<p>You will have the {stay.type.toLowerCase()} to yourself.</p>
								</div>
							</li>
							<li className='flex'>
								<img className='stay-main-amenities' src={clean} />
								<div>
									<h3>Enhanced clean</h3>
									<p>This Host committed to Airbnb's 5-step enhanced cleaning process.</p>
								</div>
							</li>
							<li className='flex'>
								<img className='stay-main-amenities' src={checkin} />
								<div>
									<h3>Self check-in</h3>
									<p>Check yourself in with the lockbox.</p>
								</div>
							</li>
						</ul>
						<p className={"stay-summery"}>{stay.summary}</p>
						<Amenities amenities={stay.amenities} />
					</div>
					<Checkout avg={avg} stay={stay} />
				</div>
				<div id='reviews' className='reviews-header flex'>
					<img src={reviewStar} />
					<span>{avg}</span>
					<div>({stay.reviews.length} Reviews)</div>
				</div>

				{stay.reviews.length > 0 && <ReviewStats reviews={stay.reviews} />}
				<div className='reviews-container'>
					{stay.reviews.map((review, idx) => {
						return <Review key={review + idx} review={review} avg={avg} />;
					})}
				</div>
				<h1 className='add-review-header'>Add a review about this stay</h1>
				<AddReview stay={stay} set={setStay} />
				<Map lat={stay.loc.lat} lng={stay.loc.lng} name={stay.name} country={stay.loc.country} address={stay.loc.address} />
			</div>
		</main>
	);
}

function mapStateToProps({}) {
	return {};
}
const mapDispatchToProps = {
	toggleDetailsLayout,
};

export const StayDetails = connect(mapStateToProps, mapDispatchToProps)(_StayDetails);
