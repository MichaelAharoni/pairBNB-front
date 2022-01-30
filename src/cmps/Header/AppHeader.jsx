import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { userService } from "../../services/user.service";
import { toggleDetailsLayout, toggleHeaderIsTop, toggleHeaderIsActive, toggleIsExplore } from "../../store/header.action";

import { Search } from "./Search";
import { SearchBar } from "./SearchBar";
import { UserModal } from "./User/UserModal";
import { UserNotification } from "./User/UserNotification";
import airLogoSvg from "../../styles/svg/air-logo.svg";
import airTopLogoSvg from "../../styles/svg/air-dark-logo.svg";
import userSvg from "../../styles/svg/user.svg";
import hamburgerSvg from "../../styles/svg/hamburger.svg";
import { UserMsg } from "../../cmps/General/UserMsg";

function _AppHeader({ toggleDetailsLayout, toggleHeaderIsTop, toggleIsExplore, toggleHeaderIsActive, headerMode }) {
	const { headerLayoutSmall, isTop, isActive, isExplore } = headerMode;
	const userIsHost = userService.getLoggedinUser()?.isHost || false;
	// const [userModalState, toggleModal] = useState(false);
	const [isScreenOpen, setIsScreenOpen] = useState(false);
	const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
	const [isUserModalScreenOpen, setIsUserModalScreenOpen] = useState(false);
	const [searchBarTabs, setSearchBarTabsActive] = useState(null);
	const [isMobileWidth, setIsMobileWidth] = useState(false);

	const location = useLocation();
	const history = useHistory();
	const img = getImgToShow();

	function onToggleIsActive() {
		toggleHeaderIsActive(!isActive);
	}

	function getImgToShow() {
		const currUser = userService.getLoggedinUser();
		return currUser ? (currUser.imgUrl ? currUser.imgUrl : userSvg) : userSvg;
	}

	function resetHeaderModes() {
		setIsUserModalScreenOpen(false)
		if (history.location.pathname !== "/") return toggleIsExplore(true);
		if (isExplore) return;
		if (window.scrollY <= 1) {
			if (isExplore) {
				toggleHeaderIsActive(false);
				toggleHeaderIsTop(false);
			} else {
				setSearchBarTabsActive(null);
				toggleHeaderIsActive(true);
				toggleHeaderIsTop(true);
			}
		} else {
			toggleHeaderIsActive(false);
			toggleHeaderIsTop(false);
		}
	}

	function handleSearchBarTabs() {
		searchBarTabs ? setSearchBarTabsActive(null) : toggleHeaderIsActive(false);
	}

	function handleSearchModals(ev) {
		ev.stopPropagation();
		setIsScreenOpen(!isScreenOpen);
		handleSearchBarTabs();
	}

	function handleCloseSearchBar(ev) {
		ev.stopPropagation();
		if (!isExplore && isTop) return;
		toggleHeaderIsActive(!isActive);
		setIsSearchBarOpen(!isSearchBarOpen);
	}

	function measureClientWindowWidth() {
		if (window.innerWidth < 780) setIsMobileWidth(true);
		else setIsMobileWidth(false);
	}

	function handleUserModal() {
		setIsUserModalScreenOpen(!isUserModalScreenOpen);
		toggleHeaderIsActive((isUserModalScreenOpen && !isExplore));
		toggleHeaderIsTop((isUserModalScreenOpen && !isExplore));
	}

	useEffect(() => {
		if (!location.pathname || location.pathname === "/") {
			toggleHeaderIsActive(false);
			toggleHeaderIsTop(false);
		} else if (location.pathname.includes("details")) {
			toggleIsExplore(true);
			toggleDetailsLayout(true);
			toggleHeaderIsActive(false);
			toggleHeaderIsTop(false);
		} else {
			toggleIsExplore(true);
			toggleDetailsLayout(false);
			toggleHeaderIsActive(false);
			toggleHeaderIsTop(false);
		}
		measureClientWindowWidth();
		window.addEventListener("scroll", resetHeaderModes);
		window.addEventListener("resize", measureClientWindowWidth);
		return () => {
			window.removeEventListener("scroll", resetHeaderModes);
			window.removeEventListener("resize", measureClientWindowWidth);
			toggleIsExplore(true);
		};
	}, []);

	return (
		<header
			className={`app-header column ${isExplore ? "explore-header" : ""} ${isActive ? "active-header" : ""} ${isTop ? "top-header" : ""} header-layout ${headerLayoutSmall ? "detail-layout" : "main-layout"
				}`}>
			<div onClick={handleSearchModals} className={isScreenOpen ? "screen screen-open full-layout" : "screen full-layout"}></div>
			<div onClick={handleCloseSearchBar} className={isSearchBarOpen ? "screen screen-open search-bar-screen full-layout" : "search-bar-screen  screen full-layout"}></div>
			<div onClick={handleUserModal} className={isUserModalScreenOpen ? "screen screen-open user-modal-screen full-layout" : "screen user-modal-screen full-layout"}></div>
			{isUserModalScreenOpen && <UserModal handleUserModal={handleUserModal}  resetHeaderModes={resetHeaderModes}  />}
			<section className='short-search-bar middle-layout'>
				<Link to={`/`}>
					<span className='logo'>
						P{isTop ? <img src={airTopLogoSvg} className='air-logo' alt='' /> : <img src={airLogoSvg} className='air-logo' alt='' />}I<span className='logo-r'>R</span>
						BNB
					</span>
				</Link>

				{!isActive && <Search isSearchBarOpen={isSearchBarOpen} setIsSearchBarOpen={setIsSearchBarOpen} onToggleIsActive={onToggleIsActive} />}
				<article className='nav-link'>
					<Link to={`/explore`}> Explore</Link>
					<Link className='become' to={userIsHost ? "/host" : "/"}>
						{userIsHost ? "My Stays" : "Become a Host"}
					</Link>
					<button onClick={handleUserModal} className='user-menu'>
						<UserNotification />
						<img className='hamburger-svg' src={hamburgerSvg} />
						<img className='user-svg' src={img} />
					</button>
				</article>
			</section>
			<nav className='middle-layout search-bar-container'>
				{(isActive || isMobileWidth) && (
					<SearchBar
						handleSearchBarTabs={handleSearchBarTabs}
						setSearchBarTabsActive={setSearchBarTabsActive}
						searchBarTabs={searchBarTabs}
						isScreenOpen={isScreenOpen}
						isMobileWidth={isMobileWidth}
						isTop={isTop}
						setIsScreenOpen={setIsScreenOpen}
						ToggleIsActive={onToggleIsActive}
					/>
				)}
			</nav>
			<UserMsg />
		</header>
	);
}

function mapStateToProps({ headerModule }) {
	return {
		headerMode: headerModule.headerMode,
	};
}
const mapDispatchToProps = {
	toggleDetailsLayout,
	toggleHeaderIsTop,
	toggleHeaderIsActive,
	toggleIsExplore,
};

export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(_AppHeader);
