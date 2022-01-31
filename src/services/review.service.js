import { httpService } from './http.service'

export const reviewService = {
  add,
  query,
}


function query(filterBy) {
  var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  return httpService.get(`review${queryStr}`)

}

async function add(review) {
  const addedReview = await httpService.post(`review`, review)
  return addedReview
}

