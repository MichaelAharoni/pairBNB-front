export function SpecialBtn({
	text,
	size,
	isActive,
	onClick = (ev) => {
		ev.stopPropagation();
	},
	args,
}) {
	return (
		<div
			onClick={(ev) => onClick(ev, args)}
			style={size && (isActive ? { width: 120 + "px", height: size.height } : { width: size.width, height: size.height })}
			className={"btn-container " + (isActive && "active-mode")}>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='cell'></div>
			<div className='content'>
				<div className='action-btn'>
					<span style={size && { transform: "translate(0,0)" }}>
						{text}
						{isActive && "Search"}
					</span>
				</div>
			</div>
		</div>
	);
}
