import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { Loader } from "../General/Loader";

import { orderService } from "../../services/order.service";
import { userService } from "../../services/user.service";
import { socketService } from "../../services/socket.service";

import MUIDataTable from "mui-datatables";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { ThemeProvider } from "@mui/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import pendingSvg from "../../styles/svg/pending.svg";
import approvedSvg from "../../styles/svg/approved.svg";
import declineSvg from "../../styles/svg/declined.svg";
const pending = <img className='status' src={pendingSvg} />;
const approved = <img className='status' src={approvedSvg} />;
const declined = <img className='status' src={declineSvg} />;
const urls = { Pending: pending, Approved: approved, Declined: declined };

export function HostTable() {
	const responsive = "standard";

	const [myOrders, setOrders] = useState(null);
	const [currOrderClicked, setCurrOrderClick] = useState(null);
	const [loggedinUser] = useState(userService.getLoggedinUser());

	let approvedButtons;
	let pendingButtons;

	async function loadOrders() {
		const allOrders = await orderService.query();
		console.log(allOrders);
		console.log(loggedinUser);
		let orders = allOrders.filter((order) => order.host._id === loggedinUser._id);
		console.log(orders);
		orders = orders.map((order, idx) => {
			pendingButtons = (
				<div style={{ display: "flex", gap: "10px" }}>
					<button style={{ padding: "8px", color: "green" }} onClick={() => setCurrOrderClick({ order, idx, status: "Approved" })}>
						Approve
					</button>
					<button style={{ padding: "8px", color: "red" }} onClick={() => setCurrOrderClick({ order, idx, status: "Declined" })}>
						Decline
					</button>
				</div>
			);
			approvedButtons = (
				<button style={{ padding: "8px", margin: "auto" }} onClick={() => setCurrOrderClick({ order, idx, status: "Remove" })}>
					Remove
				</button>
			);
			return [
				order.buyer.fullName,
				order.stay.name,
				order.startDate,
				order.endDate,
				`$${+order.totalPrice}`,
				order.status,
				urls[order.status],
				order.status === "Pending" ? pendingButtons : approvedButtons,
			];
		});
		setOrders(orders);
	}

	useEffect(() => {
		loadOrders();
	}, []);

	useEffect(async () => {
		if (!myOrders) return;
		const newOrder = currOrderClicked.order;
		console.log(newOrder);
		if (currOrderClicked.status === "Remove") {
			newOrder.status = currOrderClicked.status;
			await orderService.remove(newOrder._id);
		} else {
			newOrder.status = currOrderClicked.status;
			console.log("new order before update", newOrder);
			await orderService.update(newOrder);
			socketService.emit("host-response", { id: newOrder.buyer._id, hostId: newOrder.hostId, status: newOrder.status });
		}
		loadOrders();
	}, [currOrderClicked]);

	function getPendingOrders(orders) {
		console.log(orders);
		const pending = orders.filter((order) => order[5] === "Pending");
		return pending.length;
	}
	function getTotalEarning(orders) {
		let price = 0;
		const approved = orders.filter((order) => order[5] === "Approved");
		approved.forEach((order) => {
			let currPrice = order[4].replace("$", "");
			price += +currPrice;
		});
		return price.toFixed(1);
		// return .length;
	}
	function getOrderTypes(orders, type) {
		let ammount = 0;
		orders.forEach((order) => {
			if (order[5] === type) ammount++;
		});
		return `${ammount}/${orders.length}`;
	}

	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	const columns = ["Client name", "Stay name", "Check in", "Check out", "Total", "Order status", "Status", "Actions"];

	const options = {
		filter: true,
		filterType: "dropdown",
		responsive,
	};

	if (!myOrders) return <Loader />;

	const tableHeader = (
		<div className='table-header'>
			<h2>
				Hi {loggedinUser.fullName}, your have {getPendingOrders(myOrders)} pending orders
			</h2>
			<div>
				<div className='orders-types flex'>
					<div>Orders:</div>
					<span>
						{getOrderTypes(myOrders, "Approved")}
						<div style={{ backgroundColor: "#9df89d" }} className='orders-ball'></div>
						(Approved)
					</span>
					<span>
						{getOrderTypes(myOrders, "Pending")}
						<div style={{ backgroundColor: "#faf87b" }} className='orders-ball'></div>
						(Pending)
					</span>
					<span>
						{getOrderTypes(myOrders, "Declined")}
						<div style={{ backgroundColor: "#fa7b7b" }} className='orders-ball'></div>
						(Declined)
					</span>
				</div>
				<div>
					<span>Total earning: ${getTotalEarning(myOrders)}</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className='table'>
			<ThemeProvider theme={theme}>
				<MUIDataTable title={tableHeader} data={myOrders} columns={columns} options={options} />
			</ThemeProvider>
		</div>
	);
}

export function UserTable() {
	const responsive = "standard";
	const [myOrders, setOrders] = useState(null);
	const [currOrderClicked, setCurrOrderClick] = useState(null);
	const [loggedinUser] = useState(userService.getLoggedinUser());

	async function loadOrders() {
		const allOrders = await orderService.query();
		let orders = allOrders.filter((order) => order.buyer._id === loggedinUser._id);
		orders = orders.map((order, idx) => {
			return [order.stay.name, order.host.name, order.startDate, order.endDate, `$${+order.totalPrice}`, order.status, urls[order.status]];
		});

		setOrders(orders);
	}

	useEffect(() => {
		loadOrders();
	}, []);

	useEffect(async () => {
		if (!myOrders) return;
		const newOrder = currOrderClicked.order;
		if (currOrderClicked.status === "Remove") {
			newOrder.status = currOrderClicked.status;
			await orderService.remove(newOrder._id);
		} else {
			newOrder.status = currOrderClicked.status;
			await orderService.update(newOrder);
			socketService.emit("host-response", { id: newOrder.buyer._id, hostId: newOrder.hostId, status: newOrder.status });
		}
		loadOrders();
	}, [currOrderClicked]);

	function getPendingOrders(orders) {
		console.log(orders);
		const pending = orders.filter((order) => order[5] === "Pending");

		return pending.length;
	}

	function getOrderTypes(orders, type) {
		let ammount = 0;
		orders.forEach((order) => {
			if (order[5] === type) ammount++;
		});
		return `${ammount}/${orders.length}`;
	}

	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	const columns = ["Stay name", "Host name", "Check in", "Check out", "Total", "Order status", "Status"];

	const options = {
		filter: true,
		filterType: "dropdown",
		responsive,
	};

	if (!myOrders) return <Loader />;

	const tableHeader = (
		<div className='table-header'>
			<h3>
				Hi {loggedinUser.fullName}, your have {getPendingOrders(myOrders)} pending trips
			</h3>
			{getPendingOrders(myOrders) > 0 && <p>Our hosts will respond to your pending trips soon</p>}
			<div>
				<div className='orders-types flex'>
					<div>Trips::</div>
					<span>
						{getOrderTypes(myOrders, "Approved")}
						<div style={{ backgroundColor: "#9df89d" }} className='orders-ball'></div>
						(Approved)
					</span>
					<span>
						{getOrderTypes(myOrders, "Pending")}
						<div style={{ backgroundColor: "#faf87b" }} className='orders-ball'></div>
						(Pending)
					</span>
					<span>
						{getOrderTypes(myOrders, "Declined")}
						<div style={{ backgroundColor: "#fa7b7b" }} className='orders-ball'></div>
						(Declined)
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className='table'>
			<ThemeProvider theme={theme}>
				<MUIDataTable title={tableHeader} data={myOrders} columns={columns} options={options} />
			</ThemeProvider>
		</div>
	);
}
