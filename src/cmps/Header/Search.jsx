import { SpecialBtn } from "../General/SpecialBtn";
import searchSvg from "../../styles/svg/search.svg";
import { useSelector } from "react-redux";

export function Search({ onToggleIsActive, setIsSearchBarOpen, isMobileWidth, setIsMobileScreenOpen }) {

	function handleSearchClick() {
		if (isMobileWidth) setIsMobileScreenOpen(true);
		setIsSearchBarOpen(true);
		onToggleIsActive();
	}

	const searchParams = useSelector((state) => state.stayModule.searchParams);
	return (
		<nav className='search' onClick={handleSearchClick}>
			<p>{searchParams.location ? searchParams.location : "Start your search"}</p>
			<div className='special-btn search-special-btn'>
				<SpecialBtn onClick={setIsMobileScreenOpen} text={<img src={searchSvg} className='search-svg' alt='' />} />
			</div>
		</nav>
	);
}
