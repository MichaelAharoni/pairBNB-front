export function Review({ review }) {
	console.log(review);
	return (
		<div className='review'>
			<div className='review-user-info flex'>
				<img src={review.by.imgUrl} />
				<h2>{review.by.fullName}</h2>
			</div>
			<p>{review.txt}</p>
		</div>
	);
}
