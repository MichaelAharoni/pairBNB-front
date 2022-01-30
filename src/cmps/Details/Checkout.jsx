import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Guests } from "../General/Guests";
import { SpecialBtn } from "../General/SpecialBtn";
import { DatePicker } from "./DatePicker.jsx";
import { Loader } from "../General/Loader";

import { orderService } from "../../services/order.service";
import { socketService } from "../../services/socket.service";
import { userService } from "../../services/user.service";
import { openMsg } from "../../store/msg.action";
import { setParams } from "../../store/stay.action";
import { updateUserNotifications } from "../../store/user.action";

import reviewStar from "../../styles/svg/star.svg";
import { differenceInSeconds } from "date-fns";

export function Checkout({ stay, avg }) {
	const order = useSelector((state) => state.stayModule.searchParams);
	// const [order, setOrder] = useState({ checkIn: null, checkOut: null, guestsCount: 1, adults: 1, children: 0, infants: 0 });
	const [isGuestsActive, toggleGuests] = useState(false);
	const [btnMode, setIsDeley] = useState({ loader: false, reserve: false, btnTxt: "Check availability" });
	const dispatch = useDispatch();

	function setDeley() {
		if (!order.checkIn || !order.checkOut) return dispatch(openMsg({ txt: "Pick Dates", type: "bnb" }));
		if (btnMode.reserve) return reserveOrder();
		setIsDeley({ ...btnMode, loader: true });
		setTimeout(() => {
			setIsDeley({ loader: false, reserve: true, btnTxt: "Reserve" });
			dispatch(openMsg({ txt: "Dates are available", type: "bnb" }));
		}, 1000);
	}

	async function reserveOrder(ev, args) {
		const currUser = userService.getLoggedinUser();
		if (!currUser) return dispatch(openMsg({ txt: "Log in first", type: "bnb" }));
		const reserved = {
			hostId: stay.host._id,
			buyerId: currUser._id,
			stayId: stay._id,
			totalPrice: (getTotalNights() * stay.price * 1.025).toFixed(1),
			startDate: new Date(order.checkIn).toDateString(),
			endDate: new Date(order.checkOut).toDateString(),
			guests: { total: order.guestsCount, adults: order.adults, children: order.children, infants: order.infants },
			status: "Pending",
		};
		try {
			setIsDeley({ ...btnMode, loader: true });
			await orderService.save(reserved);
			socketService.emit("new-order", stay.host._id);
			const userTosave = await userService.getById(currUser._id);
			userTosave.notifications.push("your order has been recived in our system");
			const newUser = await userService.update(userTosave);
			userService.setLoggedinUser(newUser);
			dispatch(updateUserNotifications(newUser.notifications));
			setIsDeley({ ...btnMode, loader: "done" });
		} catch (err) {
			dispatch(openMsg({ txt: "Order Failed try again later", type: "bnb" }));
			setIsDeley({ ...btnMode, loader: false });
		}
	}

	function onUpdateGuets(parms) {
		dispatch(setParams(parms));
	}

	function onToggleGuests() {
		toggleGuests(!isGuestsActive);
	}

	function getTotalNights() {
		return (new Date(order.checkOut) - new Date(order.checkIn)) / (1000 * 60 * 60 * 24);
	}

	return (
		<main className='special-btn checkout-container'>
			{isGuestsActive && <div onClick={() => toggleGuests()} className='guest-screen'></div>}
			<section className='order-container'>
				<div className='order-form-header'>
					<p>
						<span className='cost'>${stay.price}</span> / night
					</p>
					<p>
						<span>
							<img className='star-checkout' src={reviewStar} />
						</span>
						<span className='avg-checkout'> {avg} · </span>
						<span className='reviews'>{stay.reviews.length} reviews</span>
					</p>
				</div>

				<div className='order-data'>
					<div className='date-picker'>
						<DatePicker order={order} setOrder={setParams} />
					</div>

					<div onClick={onToggleGuests} className='guest-input'>
						<label>guests</label>
						<div>
							{order.guestsCount} {order.guestsCount > 1 ? "guests" : "guest"}
						</div>
					</div>
				</div>
				{!btnMode.loader || btnMode.loader === "done" ? (
					btnMode.loader === "done" ? (
						<button className='after-reserver-btn'>Reserved!</button>
					) : (
						<SpecialBtn
							args={{ checkIn: order.checkIn, checkOut: order.checkOut, guestCount: order.guestsCount, price: getTotalNights() * stay.price }}
							onClick={setDeley}
							text={btnMode.btnTxt}
						/>
					)
				) : (
					<div className='checkout-loader'>
						<Loader />
					</div>
				)}
				{isGuestsActive && <Guests init={order} ammount={stay.capacity} set={onUpdateGuets} />}
				{order.checkIn && order.checkOut && (
					<div className='price-container'>
						<div>
							<div className='flex price-details'>
								<div>
									${stay.price} X {getTotalNights()} nights
								</div>
								<div>${(getTotalNights() * stay.price).toFixed()}</div>
							</div>
							<div className='flex price-details'>
								<div>Service fee</div>
								<div>${parseInt(getTotalNights() * stay.price * 0.025)}</div>
							</div>
						</div>
						<div className='flex total-price'>
							<h3> Total price:</h3>
							<h3>${parseInt(getTotalNights() * stay.price * 1.025)}</h3>
						</div>
					</div>
				)}
			</section>
		</main>
	);
}
