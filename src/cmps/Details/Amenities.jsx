import airconditioning from "../../styles/svg/amenities/air-conditioning.svg";
import bbqgrill from "../../styles/svg/amenities/bbq-grill.svg";
import beachaccess from "../../styles/svg/amenities/beach-access.svg";
import bedlinens from "../../styles/svg/amenities/bed-linens.svg";
import carbonmonoxidealarm from "../../styles/svg/amenities/carbon-monoxide-alarm.svg";
import coffeemaker from "../../styles/svg/amenities/coffee-maker.svg";
import cookingbasics from "../../styles/svg/amenities/cooking-basics.svg";
import dedicatedworkspace from "../../styles/svg/amenities/dedicated-workspace.svg";
import dishesandsilverware from "../../styles/svg/amenities/dishes-and-silverware.svg";
import dishwasher from "../../styles/svg/amenities/dishwasher.svg";
import essentials from "../../styles/svg/amenities/essentials.svg";
import ethernetconnection from "../../styles/svg/amenities/ethernet-connection.svg";
import extrapillowsandblankets from "../../styles/svg/amenities/extra-pillows-and-blankets.svg";
import fireextinguisher from "../../styles/svg/amenities/fire-extinguisher.svg";
import firstaidkit from "../../styles/svg/amenities/first-aid-kit.svg";
import freeparkingonpremises from "../../styles/svg/amenities/free-parking-on-premises.svg";
import hairdryer from "../../styles/svg/amenities/hair-dryer.svg";
import hangers from "../../styles/svg/amenities/hangers.svg";
import heating from "../../styles/svg/amenities/heating.svg";
import hotwater from "../../styles/svg/amenities/hot-water.svg";
import indoorfireplace from "../../styles/svg/amenities/indoor-fireplace.svg";
import iron from "../../styles/svg/amenities/iron.svg";
import kitchen from "../../styles/svg/amenities/kitchen.svg";
import longtermstaysallowed from "../../styles/svg/amenities/long-term-stays-allowed.svg";
import patioorbalcony from "../../styles/svg/amenities/patio-or-balcony.svg";
import petsallowed from "../../styles/svg/amenities/pets-allowed.svg";
import pool from "../../styles/svg/amenities/pool.svg";
import privateentrance from "../../styles/svg/amenities/private-entrance.svg";
import refrigerator from "../../styles/svg/amenities/refrigerator.svg";
import shampoo from "../../styles/svg/amenities/shampoo.svg";
import smokealarm from "../../styles/svg/amenities/smoke-alarm.svg";
import smokingallowed from "../../styles/svg/amenities/smoking-allowed.svg";
import stove from "../../styles/svg/amenities/stove.svg";
import suitableforevents from "../../styles/svg/amenities/suitable-for-events.svg";
import tv from "../../styles/svg/amenities/tv.svg";
import washer from "../../styles/svg/amenities/washer.svg";
import wifi from "../../styles/svg/amenities/wifi.svg";
import securitycameras from "../../styles/svg/amenities/security-cameras.svg";

const urls = {
	shampoo,
	suitableforevents,
	securitycameras,
	wifi,
	washer,
	tv,
	stove,
	smokingallowed,
	essentials,
	smokealarm,
	refrigerator,
	privateentrance,
	pool,
	longtermstaysallowed,
	petsallowed,
	patioorbalcony,
	iron,
	kitchen,
	ethernetconnection,
	indoorfireplace,
	freeparkingonpremises,
	hairdryer,
	heating,
	hotwater,
	hangers,
	fireextinguisher,
	hangers,
	firstaidkit,
	extrapillowsandblankets,
	airconditioning,
	bbqgrill,
	beachaccess,
	bedlinens,
	carbonmonoxidealarm,
	coffeemaker,
	cookingbasics,
	dedicatedworkspace,
	dishesandsilverware,
	dishwasher,
};

export function Amenities({ amenities }) {
	const labels = [];
	const NotIncluded = [];
	amenities.forEach((amenitie) => {
		const [values] = Object.values(amenitie);
		if (amenitie["Not included"]) {
			values.forEach((label) => NotIncluded.push(label));
			return;
		}
		values.forEach((label) => labels.push(label));
	});

	function fixAmenitie(amenitie) {
		return amenitie.replaceAll(" ", "").toLowerCase();
	}

	return (
		<div>
			<h1 className='amenities-list-header'>What this place offers</h1>
			<ul className='amenities-list'>
				{labels.map((amenitie) => {
					return (
						<li className='amenitie-item' key={amenitie}>
							<img className='amenitie' src={urls[fixAmenitie(amenitie)]} />
							<span>{amenitie}</span>
						</li>
					);
				})}
				{NotIncluded.map((amenitie) => {
					return (
						<li key={amenitie} className='amenitie-item not-included'>
							<img className='amenitie' src={urls[fixAmenitie(amenitie)]} />
							{amenitie}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
