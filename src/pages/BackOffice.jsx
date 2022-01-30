import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { StayList } from "../cmps/Explore/StayList.jsx";
import { AddStay } from "../cmps/BackOffice/AddStay.jsx";
import { loadStays } from "../store/stay.action.js";
import { HostTable, UserTable } from "../cmps/BackOffice/OrderTables";

import { userService } from "../services/user.service";
import { stayService } from "../services/stay.service";

import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const colors = {
	bnb: "#FF385C",
	grey: "#ebebeb",
	white: "#FFFFFF",
};

const Tab = styled(TabUnstyled)`
	font-family: IBM Plex Sans, sans-serif;
	color: ${colors.bnb};
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: bold;
	background-color: transparent;
	width: 100%;
	padding: 12px 16px;
	margin: 6px 6px;
	border: none;
	border-radius: 5px;
	display: flex;
	justify-content: center;

	&:hover {
		background-color: ${colors.grey};
	}

	&:focus {
		color: #fff;
		border-radius: 3px;
		outline: 2px solid ${colors.grey};
		outline-offset: 2px;
	}

	&.${tabUnstyledClasses.selected} {
		background-color: ${colors.bnb};
		color: ${colors.white};
	}

	&.${buttonUnstyledClasses.disabled} {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

const TabPanel = styled(TabPanelUnstyled)`
	width: 100%;
	font-family: IBM Plex Sans, sans-serif;
	font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
	min-width: 320px;
	background-color: ${colors.white};
	border-radius: 8px;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: space-between;
`;

export function _BackOffice({ stays, loadStays }) {
	const [hostStays, setHostStays] = useState([]);
	const [likedStays, setLikedStays] = useState([]);
	const history = useHistory();
	let loggedInUser = userService.getLoggedinUser();

	useEffect(async () => {
		let stays = await stayService.query();
		let currUserLikesStays = [];
		loggedInUser.likedStays.forEach((stay) => {
			const found = stays.find((currStay) => currStay._id === stay._id);
			if (found !== 1) currUserLikesStays.push(found);
		});
		setLikedStays(currUserLikesStays);
		if (loggedInUser.isHost) {
			let hostStays = await stayService.getStaysByHostId(loggedInUser._id);

			setHostStays([...hostStays]);
		}
	}, []);

	if (!loggedInUser) return <React.Fragment> {history.push("/")}</React.Fragment>;
	return (
		<div className='main-layout main-container'>
			<TabsUnstyled className='middle-layout' defaultValue={0}>
				<TabsList>
					{loggedInUser.isHost && <Tab>ORDERS</Tab>}
					<Tab>MY TRIPS</Tab>
					{loggedInUser.isHost && <Tab>MY STAYS</Tab>}
					<Tab>WISHLIST</Tab>
					{loggedInUser.isHost && <Tab>ADD A STAY</Tab>}
				</TabsList>
				<TabPanel value={0}>{loggedInUser.isHost && <HostTable />}</TabPanel>
				<TabPanel value={loggedInUser.isHost ? 1 : 0}>
					<UserTable />
				</TabPanel>
				<TabPanel value={2}>{hostStays.length ? <StayList fromBackOffice={true} staysToShow={hostStays} /> : <div>You are not a host</div>}</TabPanel>
				<TabPanel value={loggedInUser.isHost ? 3 : 1}>
					{likedStays.length ? <StayList fromBackOffice={false} staysToShow={likedStays} /> : <div>You didnt like any stay yet</div>}
				</TabPanel>
				<TabPanel value={4}>{loggedInUser.isHost && <AddStay />}</TabPanel>
			</TabsUnstyled>
		</div>
	);
}

function mapStateToProps({ stayModule }) {
	return {
		stays: stayModule.stays,
	};
}
const mapDispatchToProps = {
	loadStays,
};

export const BackOffice = connect(mapStateToProps, mapDispatchToProps)(_BackOffice);
