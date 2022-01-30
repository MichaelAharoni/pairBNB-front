import { httpService } from './http.service'
// import { storageService } from './async-storage.service'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED } from './socket.service'

export const reviewService = {
  add,
  query,
  // remove
}


function query(filterBy) {
  var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  return httpService.get(`review${queryStr}`)

}

//consider future use
// function remove(reviewId) {
//   return httpService.delete(`review/${reviewId}`)
// }
async function add(review) {
  const addedReview = await httpService.post(`review`, review)
  return addedReview
}

// (async () => {
//   var reviews = await storageService.query('review')
//   window.addEventListener('storage', async () => {
//     console.log('Storage updated');
//     const freshReviews = await storageService.query('review')
//     if (freshReviews.length === reviews.length + 1) {
//       console.log('Review Added - localStorage updated from another browser')
//       socketService.emit(SOCKET_EVENT_REVIEW_ADDED, freshReviews[freshReviews.length - 1])
//     }
//     reviews = freshReviews
//   });
// })()

