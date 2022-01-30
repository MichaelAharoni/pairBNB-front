import React from "react";

import { StayPreview } from "./StayPreview";

export function StayList({ staysToShow, fromBackOffice = false }) {
	return (
		<div className='stay-list-container middle-layout'>
			{staysToShow.map((stay, idx) => {
				return <StayPreview key={idx} fromBackOffice={fromBackOffice} stay={stay} />;
			})}
		</div>
	);
}
