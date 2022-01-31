import { httpService } from './http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    update
}

async function query() {
    const stays = await httpService.get(`order`);
    return stays;
}

async function getById(orderId) {
    const stay = await httpService.get(`order/${orderId}`)
    return stay

}

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}

function save(order) {
    return httpService.post(`order`, order)
}

function update(order) {
    return httpService.put(`order`, order)
}



