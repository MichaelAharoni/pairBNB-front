import React, { useEffect } from "react";
import { Route, Switch } from "react-router";

import { socketService } from "./services/socket.service";

import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { StayDetails } from "./pages/StayDetails";
import { UserLogin } from "./pages/UserLogin";
import { BackOffice } from "./pages/BackOffice";

import { AppHeader } from "./cmps/Header/AppHeader";
import { AppFooter } from "./cmps/General/AppFooter";

export function RootCmp() {
	// useEffect(() => {
	// 	socketService.setup();
	// 	socketService.on("recive-new-order", (id) => {
	// 		console.log("new order recieved");
	// 	});
	// }, []);

	return (
		<div className='app-layout'>
			<AppHeader />
			<main className='main-app-layout'>
				<Switch>
					<Route component={Explore} path='/explore/:search?' />
					<Route component={UserLogin} path='/user/' />
					<Route component={StayDetails} path='/details/:id' />
					<Route component={BackOffice} path='/host' />
					<Route component={Home} path='/' />
				</Switch>
			</main>
			<AppFooter />
		</div>
	);
}
