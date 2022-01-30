import React from "react";
import { Link } from "react-router-dom";

export function AppFooter() {
	return (
		<footer id='footer' className=' app-footer footer-layout main-layout'>
			<main className="middle-layout">
				<section className='footer-content'>
					<ul>
						<li><b>Support</b></li>
						<li>Help Center</li>
						<li>Safety information</li>
						<li>Cancellation options</li>
						<li>Our COVID-19 Response</li>
						<li>Supporting people with disabilities</li>
						<li>Report a neighborhood concern</li>
					</ul>
					<ul>
						<li><b>Community</b></li>
						<li>Airbnb.org: disaster relief housing</li>
						<li>Support Afghan refugees</li>
						<li>Celebrating diversity & belonging</li>
						<li>Combating discrimination</li>
					</ul>
					<ul>
						<li><b>Hosting</b></li>
						<li>Try hosting</li>
						<li>AirCover: protection for Hosts</li>
						<li>Explore hosting resources</li>
						<li>Visit our community forum</li>
						<li>How to host responsibly</li>
					</ul>
					<ul>
						<li><b>About</b></li>
						<li>Newsroom</li>
						<li>
						Learn about new features</li>
						<li>Letter from our founders</li>
						<li>Careers</li>
						<li>Investors</li>
						<li>Airbnb Luxe</li>
					</ul>
				</section>
				<section className="footer-credits flex justify-center">
					<p>
						Coffee Rights © www.DrinkACoffee.<b>com</b>
					</p>
				</section>
			</main>
		</footer>
	);
}
