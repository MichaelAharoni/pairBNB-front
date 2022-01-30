import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { closeMsg } from "../../store/msg.action";

import closeSvg from "../../styles/svg/close.svg";
const close = <img className='close-user-msg' src={closeSvg} />;

let timeoutId;

function _UserMsg({ closeMsg, msg }) {
	useEffect(() => {
		return () => clearTimeout(timeoutId);
	}, []);
	const msgClass = msg.type || "";
	if (!msg.txt) return <React.Fragment></React.Fragment>;
	if (timeoutId) clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		closeMsg();
	}, 2000);

	return (
		<div className={"full-layout user-msg " + msgClass}>
			<p>{msg.txt}</p>
			<button onClick={closeMsg}>{close}</button>
		</div>
	);
}

function mapStateToProps({ msgModule }) {
	return {
		msg: msgModule.msg,
	};
}

const mapDispatchToProps = {
	closeMsg,
};

export const UserMsg = connect(mapStateToProps, mapDispatchToProps)(_UserMsg);
