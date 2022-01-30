export function ReviewStats({ reviews }) {
	const stats = { Accuracy: 0, Checkin: 0, Cleanliness: 0, Communication: 0, Location: 0, Value: 0 };
	reviews.forEach((review) => {
		stats.Accuracy += review.rate.accuracy;
		stats.Checkin += review.rate.checkin;
		stats.Cleanliness += review.rate.cleanliness;
		stats.Communication += review.rate.communication;
		stats.Location += review.rate.location;
		stats.Value += review.rate.value;
	});
	for (const key in stats) {
		stats[key] = (stats[key] / reviews.length).toFixed(1);
	}
	const avgStats = Object.keys(stats);

	return (
		<div className='review-stats'>
			{avgStats.map((stat) => {
				const currAvg = `${(stats[stat] / 5) * 100}%`;
				return (
					<div className='rating-container'>
						{stat}
						<div className='stat-container'>
							<div className='stat-bar-container'>
								<div style={{ width: currAvg }} className='stat-value'></div>
							</div>
							<span>{stats[stat]}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
