import { useState } from "react";
import { Switch, Route } from "react-router";
import { connect } from "react-redux";

import { signingUp, signingIn } from "../store/user.action";

import { LogIn } from "../cmps/Header/User/LogIn";
import { Loader } from "../cmps/General/Loader";
import { SignUp } from "../cmps/Header/User/SignUp";

function _UserLogin({ signingUp, signingIn, history }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	if (isSubmitting) return <Loader />;
	return (
		<section style={{ marginBlockStart: "140px",marginBlockEnd: "60px" }}>
			<Switch>
				<Route component={() => <LogIn setIsSubmitting={setIsSubmitting} signingIn={signingIn} history={history} />} path='/user/login' />
				<Route component={() => <SignUp setIsSubmitting={setIsSubmitting} signingUp={signingUp} history={history} />} path='/user/signup' />
			</Switch>
		</section>
	);
}

function mapStateToProps({ userModule }) {
	return {
		user: userModule.user,
	};
}
const mapDispatchToProps = {
	signingUp,
	signingIn,
};

export const UserLogin = connect(mapStateToProps, mapDispatchToProps)(_UserLogin);
