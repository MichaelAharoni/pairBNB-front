
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service'

const STORAGE_KEY = 'stay_db'
const listeners = []

export const stayService = {
    query,
    getById,
    save,
    remove,
    update,
    sortStays,
    getStaysByHostId
    // searchStays,
    // subscribe,
}

async function query(params) {
    const stays = await httpService.get(`stay`, params);
    return stays;
}


function sortStays(stays, filterBy, stayType, stayPrice) {
    let filterValues;
    let stayTypeValues;
    const { minPrice, maxPrice } = (stayPrice) ? stayPrice : { minPrice: 0, maxPrice: 1000 };
    let pricedStays = [];
    stays.forEach(stay => {
        if (stay.price >= minPrice && stay.price <= maxPrice) return pricedStays.push(stay)
    })
    stays = pricedStays
    if (stayType) stayTypeValues = Object.values(stayType).some(value => value);
    if (filterBy) filterValues = Object.values(filterBy).some(value => value);
    if ((!filterBy || !filterValues) && (!stayType || !stayTypeValues)) return stays;
    if (filterBy && !stayTypeValues) {
        const labels = Object.keys(filterBy).filter(key => filterBy[key]);
        let filteredStays = []
        stays.filter(stay => {
            const stayAmenities = [];
            stay.amenities.forEach(amenity => {
                const [values] = Object.values(amenity)
                values.forEach((value) => stayAmenities.push(value));
            })
            let currStay = labels.every((label) => {
                return stayAmenities.includes(label);
            })
            if (currStay) filteredStays.push(stay);
        })
        return filteredStays
    }
    else if (stayType && !filterValues) {
        const types = Object.keys(stayType).filter(key => stayType[key]);
        let filteredStays = []
        stays.forEach(stay => {
            let currStay = types.some(type => stay["type of place"].toLowerCase() === type.toLowerCase())
            if (currStay) filteredStays.push(stay);
        })
        return filteredStays
    }
    else if (stayType && filterBy) {
        const labels = Object.keys(filterBy).filter(key => filterBy[key]);
        let filteredStays = []
        stays.filter(stay => {
            const stayAmenities = [];
            stay.amenities.forEach(amenity => {
                const [values] = Object.values(amenity)
                values.forEach((value) => stayAmenities.push(value));
            })
            let currStay = labels.every((label) => {
                return stayAmenities.includes(label);
            })
            if (currStay) filteredStays.push(stay);
            return filteredStays
        })
        const filterAndTypeStays = []
        const types = Object.keys(stayType).filter(key => stayType[key]);
        filteredStays.forEach(stay => {
            let currStay = types.some(type => stay["type of place"].toLowerCase() === type.toLowerCase())
            if (currStay) filterAndTypeStays.push(stay);
        })
        return filterAndTypeStays
    }
}


async function getById(stayId) {
    const stay = await httpService.get(`stay/${stayId}`)
    return stay
    // return storageService.get(STORAGE_KEY, stayId)
}

async function update(stay) {
    const updatedStay = await httpService.put(`stay/`, stay)
    return updatedStay
}


async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
    // return storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    let newStay = getEmptyStay()
    newStay.name = stay.stayName
    newStay.type = stay.placeType
    newStay["type of place"] = stay.spaceType
    newStay.price = +stay.stayPrice
    newStay.capacity = +stay.stayCapacity
    newStay.summary = stay.stayDescription
    newStay.loc.address = stay.stayAdress
    let amenities = getAmenities(stay.stayAmenities)
    newStay.amenities = amenities
    let currHost = userService.getLoggedinUser()
    let { _id, fullName, imgUrl } = currHost
    let host = { _id, fullName, imgUrl }
    newStay.host = host
    newStay.imgUrls = stay.stayImgs
    const addedStay = await httpService.post('stay', newStay);
    await httpService.put('user', { ...currHost, isHost: true });
    console.log('stay added', addedStay);

}

function getAmenities(stayAmenities) {
    let amenities = [{

        "Bathroom": []
    },
    {
        "Bedroom and laundry": []
    },
    {
        "Entertainment": []
    },

    {
        "Heating and cooling": []
    },
    {
        "Home safety": []
    },
    {
        "Internet and office": []
    },
    {
        "Kitchen and dining": []
    },
    {
        "Location features": []
    },
    {
        "Outdoor": []
    },
    {
        "Parking and facilities": []
    },
    {
        "Services": []
    },
    {
        "Not included": []
    }]
    stayAmenities.forEach(amenity => {
        switch (amenity) {
            case "Shampoo":
                amenities[0].Bathroom.push(amenity)
                console.log(amenities)
                break;
            case "Hot water":
                amenities[0].Bathroom.push(amenity)
                break;
            case "Hair dryer":
                amenities[0].Bathroom.push(amenity)
                break;
            case "Washer":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Essentials":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Hangers":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Bed Linens":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Iron":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Extra pillows and blankets":
                amenities[1]["Bedroom and laundry"].push(amenity)
                break;
            case "Ethernet connection":
                amenities[2].Entertainment.push(amenity)
                break;
            case "TV":
                amenities[2].Entertainment.push(amenity)
                break;
            case "Suitable for events":
                amenities[2].Entertainment.push(amenity)
                break;
            case "Air conditioning":
                amenities[3]["Heating and cooling"].push(amenity)
                break;
            case "Indoor fireplace":
                amenities[3]["Heating and cooling"].push(amenity)
                break;
            case "Heating":
                amenities[3]["Heating and cooling"].push(amenity)
                break;
            case "Fire extinguisher":
                amenities[4]["Home safety"].push(amenity)
                break;
            case "First aid kit":
                amenities[4]["Home safety"].push(amenity)
                break;
            case "Smoke alarm":
                amenities[4]["Home safety"].push(amenity)
                break;
            case "Wifi":
                amenities[5]["Internet and office"].push(amenity)
                break;
            case "Dedicated workspace":
                console.log(amenities[6])
                amenities[5]["Internet and office"].push(amenity)
                break;
            case "Dishwasher":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Coffee maker":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Stove":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Dishes and silverware":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Cooking basics":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Refrigerator":
                amenities[6]["Kitchen and dining"].push(amenity)
            case "Kitchen":
                amenities[6]["Kitchen and dining"].push(amenity)
                break;
            case "Beach access":
                amenities[7]["Location features"].push(amenity)
                break;
            case "Private entrance":
                amenities[7]["Location features"].push(amenity)
                break;
            case "Patio or balcony":
                amenities[8].Outdoor.push(amenity)
                break;
            case "BBQ grill":
                amenities[8].Outdoor.push(amenity)
                break;
            case "Free parking on premises":
                amenities[9]["Parking and facilities"].push(amenity)
                break;
            case "Pool":
                amenities[9]["Parking and facilities"].push(amenity)
                break;
            case "Pets allowed":
                amenities[10].Services.push(amenity)
                break;
            case "Smoking allowed":
                amenities[10].Services.push(amenity)
                break;
            case "Security cameras":
                amenities[10].Services.push(amenity)
                break;
            case "Long term stays allowed":
                amenities[10].Services.push(amenity)
                break;
        }
    })
    return amenities
}


async function getStaysByHostId(hostId) {
    const stays = await query()
    // let hostStays = []
    let hostStays = stays.filter(stay => {
        return stay.host._id === hostId
    })
    return hostStays
}

function getEmptyStay() {
    return {
        name: "",
        type: "",
        "type of place": "",
        imgUrls: [],
        price: "",
        summary: "",
        host: {},
        capacity: "",
        amenities: [{

            "Bathroom": []
        },
        {
            "Bedroom and laundry": []
        },
        {
            "Entertainment": []
        },

        {
            "Heating and cooling": []
        },
        {
            "Home safety": []
        },
        {
            "Internet and office": []
        },
        {
            "Kitchen and dining": []
        },
        {
            "Location features": []
        },
        {
            "Outdoor": []
        },
        {
            "Parking and facilities": []
        },
        {
            "Services": []
        },
        {
            "Not included": []
        }
        ],
        "loc": {
            "country": "Israel",
            "countryCode": "IL",
            "address": "",
            "lat": 31.010815229959928,
            "lng": 34.908554101114625
        },
        "reviews": [],
        "likedByUsers": []

    }
}

// function subscribe(listener) {
//     listeners.push(listener)
// }

// function _notifySubscribersStaysChanged(stays) {
//     console.log('Notifying Listeners');
//     listeners.forEach(listener => listener(stays))
// }

// window.addEventListener('storage', () => {
//     console.log('Storage Changed from another Browser!');
//     query()
//         .then(stays => {
//             _notifySubscribersStaysChanged(stays)
//         })
// })

// async function searchStays(search) {
//     const stays = await httpService.get(`stay`, search)
//     return stays
// const { location, guestsCount } = search
// let stays = await storageService.query(STORAGE_KEY);
// let staysByCapacity = [];
// stays.map(stay => {
//     if (stay.capacity >= guestsCount) return staysByCapacity.push(stay)
// })
// if (location) {
//     let staysByLocation = [];
//     staysByCapacity.map(stay => {
//         if (stay.loc.address === location) return staysByLocation.push(stay)
//     })
//     return staysByLocation
// }
// return staysByCapacity
// }
// TEST DATA
// addTestData()
// async function addTestData() {
//     await storageService.post(STORAGE_KEY,
//         {
//             "_id": "mongo001",
//             "name": "Jaklino Riso",
//             "type": "House",
//             "type of place": "Entire place",
//             "imgUrls": [
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520865/imgs/z8_yd5xza.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520865/imgs/z9_ly6miw.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z5_lpogr7.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z4_wvbadb.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z6_iwye5p.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z7_vbb404.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z2_m5ydxe.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642520864/imgs/z5_lpogr7.jpg"
//             ],
//             "price": 380.0,
//             "summary": "Welcome to my city home. It is centrally located in NYC, just steps from Madison Square Garden and Penn Station to get you off to all your favorite destinations. This apartment makes for lovely weekend stay when I'm not in town - close to attractions, restaurants, nightlife and shopping. Thank you for considering. Please reach out with any questions and I will happily answer them.",
//             "host": {
//                 "_id": 125,
//                 "fullName": "michael aharoni",
//                 "imgUrl": 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg',
//             },
//             "capacity": 6,
//             "amenities": [{

//                 "Bathroom": ["Shampoo", "Hot water"]
//             },
//             {
//                 "Bedroom and laundry": ["Washer", "Essentials", "Hangers", "Bed linens", "Iron"]
//             },
//             {
//                 "Entertainment": ["Ethernet connection", "TV",]
//             },

//             {
//                 "Heating and cooling": ["Air conditioning", "Indoor fireplace", "Heating"]
//             },
//             {
//                 "Home safety": ["Fire extinguisher", "First aid kit"]
//             },
//             {
//                 "Internet and office": ["Wifi", "Dedicated workspace"]
//             },
//             {
//                 "Kitchen and dining": ["Kitchen", "Refrigerator", "Cooking basics", "Dishes and silverware", "Dishwasher", "Stove", "Coffee maker"]
//             },
//             {
//                 "Location features": ["Beach access", "Private entrance"]
//             },
//             {
//                 "Outdoor": ["Patio or balcony", "BBQ grill"]
//             },
//             {
//                 "Parking and facilities": ["Free parking on premises", "Pool"]
//             },
//             {
//                 "Services": ["Pets allowed", "Smoking allowed", "Security cameras"]
//             },
//             {
//                 "Not included": ["Smoke alarm", "Carbon monoxide alarm", "Hair dryer", "Long term stays allowed",]
//             }
//                 ,],
//             "loc": {
//                 "country": "New-York",
//                 "countryCode": "NY",
//                 "address": "Porto, Portugal",
//                 "lat": 40.73061,
//                 "lng": -73.935242
//             },
//             "reviews": [
//                 {
//                     "id": "c002",
//                     "txt": "A very special, historic and beautiful place to be! Our room was decorated so nicely and everything was lovely - the bed, pillows, shower, coffee and more. We very much enjoyed our stay.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c007",
//                     "txt": "This was the most beautiful, delightful apartment I have seen. The host was respectful and friendly, we ran into some issues before the checkin, so he waited for us without any problems. The place is better than the photos, very cleaned and has a great river view especially in the morning. I would totally recommend this place for everyone want to enjoy his staying.",
//                     "rate": 4.4,
//                     "by": {
//                         "_id": 127,
//                         "fullName": "tal ekroni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png"
//                     }
//                 },
//                 {
//                     "id": "c003",
//                     "txt": "I cant even explain how amazing was the staying... the owner is very kind, the place is warm and clean.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c005",
//                     "txt": "Stunning view, the extra service wasnt so good, (I'm talking about the clean-up and the breakfast).",
//                     "rate": 4,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c006",
//                     "txt": "This is the second time we have stayed in the fantastic apartment in Tova! just a few wonderful days !! comfortable, clean, equipped with a magnificent view of the sea. Thanks!",
//                     "rate": 5,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 }
//             ],
//             "likedByUsers": ["Mosh Ben Ari", "Moris Boris"]

//         }
//     )
//     await storageService.post(STORAGE_KEY,
//         {
//             "_id": "mongo0015",
//             "name": "Magical Banna Cabana",
//             "type": "Cabin",
//             "type of place": "Shared room",
//             "imgUrls": [
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877625/imgs/dca4153e-abae-43c7-a114-5aad07a80cee_ocothx.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877621/imgs/7b5b08c5-2ba4-4019-baad-6bf79bf58c20_nug3vf.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877621/imgs/9bd4007e-2265-4af4-b515-4407904c6a67_vdzpq6.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877620/imgs/1e536207-477e-43c8-8419-7a4311590849_ehgcfs.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877620/imgs/b7258fec-b4e3-4f8e-85bf-d55ca26ad0ba_lfcxx7.jpg",
//             ],
//             "price": 133.0,
//             "summary": "A cozy and peaceful 2 BR Wood Cabin located in the heart of The Galilee mountains. just by Tabor mountain. the place is in the heart of the beautiful north of Israel. Acre (Akko), the religious city of Safed and the Sea of Galilee. Inside, you will find all the amenities needed, including an equipped kitchen, a seating area with cable TV, and a private indoor hot tub.The guests can enjoy the site's facilities, including a pool, a BBQ spot, and a spacious garden.",
//             "capacity": 4,
//             "host": {
//                 "_id": 126,
//                 "fullName": "idan gez",
//                 "imgUrl": 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg',
//             },
//             "loc": {
//                 "country": "Israel",
//                 "countryCode": "IL",
//                 "address": "Shadmot-Dvora",
//                 "lat": 32.69552072742962,
//                 "lng": 35.43172942172429
//             },
//             "amenities": [
//                 {
//                     "Bathroom": [
//                         "Shampoo",
//                         "Hot water"
//                     ]
//                 },
//                 {
//                     "Bedroom and laundry": [
//                         "Essentials",
//                         "Hangers"
//                     ]
//                 },
//                 {
//                     "Entertainment": [
//                         "TV",
//                         "Suitable for events"
//                     ]
//                 },

//                 {
//                     "Heating and cooling": [
//                         "Air conditioning",
//                         "Indoor fireplace",
//                         "Heating"
//                     ]
//                 },
//                 {
//                     "Home safety": [
//                         "Fire extinguisher",
//                         "Smoke Alarm"
//                     ]
//                 },
//                 {
//                     "Internet and office": [
//                         "Wifi",
//                         "Dedicated workspace"
//                     ]
//                 },
//                 {
//                     "Kitchen and dining": [
//                         "Kitchen",
//                         "Cooking basics"
//                     ]
//                 },
//                 {
//                     "Outdoor": [
//                         "Patio or balcony",
//                     ]
//                 },
//                 {
//                     "Parking and facilities": [
//                         "Free parking on premises",
//                         "Pool"
//                     ]
//                 },
//                 {
//                     "Services": [
//                         "Pets allowed",
//                         "Smoking allowed",
//                         "Long term stays allowed"
//                     ]
//                 },
//                 {
//                     "Not included": [
//                         "Security cameras",
//                         "Hair dryer"
//                     ]
//                 }
//             ],
//             "reviews": [
//                 {
//                     "id": "c004",
//                     "txt": "I could not picked a better place to stay , had a wonderful and amazing time . This was top of the list of best places/experiences ever .... Cozy amazing suite ,super clean, and comfortable , lovely authentic castle.... Location is awesome , available parking. Amazing Views from Castle , unique ,fairy tale experience type. a great host, very friendly , pays attention to every single detail to take care of guest , she exceeded my expectations .Traveling through Italy for 7 weeks . I have stayed in many places in Europe, Italy and around the world . I have never experience a place like this ! I recommend this place to everyone , Thank you for a wonderful experience.",
//                     "rate": 4.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c007",
//                     "txt": "This was the most beautiful, delightful apartment I have seen. The host was respectful and friendly, we ran into some issues before the checkin, so he waited for us without any problems. The place is better than the photos, very cleaned and has a great river view especially in the morning. I would totally recommend this place for everyone want to enjoy his staying.",
//                     "rate": 4.4,
//                     "by": {
//                         "_id": 127,
//                         "fullName": "tal ekroni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png"
//                     }
//                 },
//                 {
//                     "id": "c001",
//                     "txt": "No pictures can do justice to the serenity you feel at this place. Waking up and sleeping to the sounds of river, sunshine always peaking through the trees, birds and butterflies fluttering around- there was a whimsical quality to it all. It felt like a slice of paradise. this hospitality was humbling and she made me feel at home thousands of miles away from my own. I wish I could’ve stayed longer. It’s a home for all fellow wanderers and a place to heal/ for dreams and realities to become one.",
//                     "rate": 3.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c005",
//                     "txt": "Stunning view, the extra service wasnt so good, (I'm talking about the clean-up and the breakfast).",
//                     "rate": 4,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c006",
//                     "txt": "This is the second time we have stayed in the fantastic apartment in Tova! just a few wonderful days !! comfortable, clean, equipped with a magnificent view of the sea. Thanks!",
//                     "rate": 5,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 }
//             ],
//             "likedByUsers": [
//                 "Mosh Ben Ari",
//                 "Moris Boris"
//             ]
//         }
//     )
//     await storageService.post(STORAGE_KEY,
//         {
//             "_id": "mongo002",
//             "name": "Ella's cabin",
//             "type": "Cabin",
//             "type of place": "Private room",
//             "imgUrls": [
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877498/imgs/48f19d45-6c06-418f-a881-9ee26edfe6c0_wzqq5e.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877496/imgs/4509c0b5-a038-4ab2-abeb-4ec9c7183898_bolx8b.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877495/imgs/bf0662bc-8aee-4774-9a69-044795e3c8ba_cvzxke.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877494/imgs/bb35384e-5506-4cfa-bb68-e2e8828b3bcc_mrh2s5.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877494/imgs/7d33bda6-bddb-4f51-9389-f464f889e36c_ywoyto.jpg",

//             ],
//             "price": 306.0,
//             "summary": "With an absolutely stunning view, our cabin offers a beautiful and peaceful place to stay in. The cabin is fully equipped with all the essentials including an oven toaster and a minifridge in the kitchen. Ella's cabin also have it's own private garden, unique sauna cabin and an outdoor round jacuzzi hot tube. The cabin is located on a top of a mountain above the Zavit crick and near a magical, old forest. In the area you can enjoy attractions such as horse riding, ATV trips, hiking and more.",
//             "capacity": 6,
//             "amenities": [
//                 {
//                     "Bathroom": [
//                         "Hair dryer",
//                         "Shampoo",
//                         "Hot water"
//                     ]
//                 },
//                 {
//                     "Bedroom and laundry": [
//                         "Essentials",
//                         "Hangers",
//                         "Bed linens",
//                         "Extra pillows and blankets",
//                         "Iron"
//                     ]
//                 },
//                 {
//                     "Entertainment": [
//                         "Ethernet connection"
//                     ]
//                 },
//                 {
//                     "Heating and cooling": [
//                         "Air conditioning",
//                         "Heating"
//                     ]
//                 },
//                 {
//                     "Home safety": [
//                         "Fire extinguisher",
//                         "First aid kit",
//                         "Smoke alarm"
//                     ]
//                 },
//                 {
//                     "Internet and office": [
//                         "Wifi",
//                         "Dedicated workspace"
//                     ]
//                 },
//                 {
//                     "Kitchen and dining": [
//                         "Kitchen",
//                         "Refrigerator",
//                         "Cooking basics",
//                         "Dishes and silverware",
//                         "Stove"
//                     ]
//                 },
//                 {
//                     "Location features": [
//                         "Private entrance"
//                     ]
//                 },
//                 {
//                     "Outdoor": [
//                         "Patio or balcony",
//                     ]
//                 },
//                 {
//                     "Parking and facilities": [
//                         "Free parking on premises",
//                         "Pool",

//                     ]
//                 },
//                 {
//                     "Services": [
//                         "Pets allowed",
//                         "Long term stays allowed"
//                     ]
//                 },
//                 {
//                     "Not included": [
//                         "Security cameras",
//                         "Washer"
//                     ]
//                 }
//             ],
//             "host": {
//                 "_id": 126,
//                 "fullName": "idan gez",
//                 "imgUrl": 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg',
//             },
//             "loc": {
//                 "country": "Israel",
//                 "countryCode": "IL",
//                 "address": "Abirim",
//                 "lat": 33.038522896811884,
//                 "lng": 35.28736201820688
//             },
//             "reviews": [
//                 {
//                     "id": "c001",
//                     "txt": "No pictures can do justice to the serenity you feel at this place. Waking up and sleeping to the sounds of river, sunshine always peaking through the trees, birds and butterflies fluttering around- there was a whimsical quality to it all. It felt like a slice of paradise. this hospitality was humbling and she made me feel at home thousands of miles away from my own. I wish I could’ve stayed longer. It’s a home for all fellow wanderers and a place to heal/ for dreams and realities to become one.",
//                     "rate": 3.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c008",
//                     "txt": "This place looks nice but the experience is bad and not acceptable. I have to start by saying thank. The place clean looks very nice Excapt that we didn't really enjoy our time here. First it was the power generator, it took maybe more than one hour troubleshooting the generator and 7:30 the assistant brought another generator. (The first one which he brought was full of corrousions and very old) There was no water although the generator was ON. We spent the with no water, I informed the assistant but it was dark. He gave some instructions but no luck. I spent time just troubleshooting.",
//                     "rate": 2.5,
//                     "by": {
//                         "_id": 127,
//                         "fullName": "tal ekroni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png"
//                     }
//                 },
//                 {
//                     "id": "c004",
//                     "txt": "I could not picked a better place to stay , had a wonderful and amazing time . This was top of the list of best places/experiences ever .... Cozy amazing suite ,super clean, and comfortable , lovely authentic castle.... Location is awesome , available parking. Amazing Views from Castle , unique ,fairy tale experience type . a great host, very friendly, pays attention to every single detail to take care of guest, she exceeded my expectations .Traveling through Italy for 7 weeks .I have stayed in many places in Europe, Italy and around the world .I have never experience a place like this ! I recommend this place to everyone, Thank you for a wonderful experience.",
//                     "rate": 4.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c005",
//                     "txt": "Stunning view, the extra service wasnt so good, (I'm talking about the clean-up and the breakfast).",
//                     "rate": 4,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c006",
//                     "txt": "This is the second time we have stayed in the fantastic apartment in Tova! just a few wonderful days !! comfortable, clean, equipped with a magnificent view of the sea. Thanks!",
//                     "rate": 5,
//                     "by": {
//                         "_id": 124,
//                         "fullName": "koren aharon",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg"
//                     }
//                 }
//             ],
//             "likedByUsers": [
//                 "Mosh Ben Ari",
//                 "Moris Boris"
//             ]
//         }
//     )
//     await storageService.post(STORAGE_KEY,
//         {
//             "_id": "mongo003",
//             "name": "Sea of Galilee Panoramic View",
//             "type": "Cabin",
//             "type of place": "Hotel room",

//             "imgUrls": [
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877317/imgs/57e45f1a-c6af-45de-9ec1-435b03d041a8_unwkad.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877318/imgs/e2769c51-7cf1-44b9-bec8-3dcb74e15dbf_cv0ctp.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877317/imgs/b16e309a-4c93-4860-9caa-2960845d39de_ngdxqr.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877317/imgs/5f9fb0db-8286-4710-bc24-bfe25af205b3_zmoxpx.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642877316/imgs/8f0d1db7-d6ef-4998-93c5-1524d1763cda_crlsfh.jpg",
//             ],
//             "price": 365.0,
//             "summary": "Our Deluxe chalet is a studio chalet - The entire chalet is one open space (except for the bathroom of course…) The chalet has a Living space with T.V, a small basic kitchenette, indoor Jacuzzi and a bathroom with a shower and toilets. From the chalet's balcony you can look over a spectacular view of the Sea of Galilee in all its glory. The Chalet has 1 double bed and 3 sofa beds and fits best for 2 adults and 2 children. We don't recommend it for 2 couples or 5 adults.",
//             "host": {
//                 "_id": 124,
//                 "fullName": "koren aharon",
//                 "imgUrl": 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg',
//             },
//             "capacity": 5,
//             "amenities": [
//                 {
//                     "Bathroom": [
//                         "Hair dryer",
//                         "Shampoo",
//                         "Hot water"
//                     ]
//                 },
//                 {
//                     "Bedroom and laundry": [
//                         "Essentials",
//                         "Bed linens"
//                     ]
//                 },
//                 {
//                     "Entertainment": [
//                         "TV"
//                     ]
//                 },

//                 {
//                     "Heating and cooling": [
//                         "Air conditioning",
//                         "Heating"
//                     ]
//                 },
//                 {
//                     "Home safety": [
//                         "Smoke alarm",
//                         "First aid kit"
//                     ]
//                 },
//                 {
//                     "Internet and office": [
//                         "Wifi",
//                         "Dedicated workspace"
//                     ]
//                 },
//                 {
//                     "Kitchen and dining": [
//                         "Kitchen",
//                         "Refrigerator",
//                         "Dishes and silverware",
//                         "Coffee maker"
//                     ]
//                 },
//                 {
//                     "Location features": [
//                         "Private entrance"
//                     ]
//                 },
//                 {
//                     "Outdoor": [
//                         "Patio or balcony",
//                         "BBQ grill"
//                     ]
//                 },
//                 {
//                     "Parking and facilities": [
//                         "Free parking on premises",
//                         "Pool",

//                     ]
//                 },
//                 {
//                     "Services": [
//                         "Long term stays allowed"
//                     ]
//                 },
//                 {
//                     "Not included": [
//                         "Washer",
//                         "Security cameras",
//                         "Carbon monoxide alarm"
//                     ]
//                 }
//             ],
//             "loc": {
//                 "country": "Israel",
//                 "countryCode": "IL",
//                 "address": "Ramot",
//                 "lat": 32.85177736295406,
//                 "lng": 35.676106080178734
//             },
//             "reviews": [
//                 {
//                     "id": "c001",
//                     "txt": "No pictures can do justice to the serenity you feel at this place. Waking up and sleeping to the sounds of river, sunshine always peaking through the trees, birds and butterflies fluttering around- there was a whimsical quality to it all. It felt like a slice of paradise. this hospitality was humbling and she made me feel at home thousands of miles away from my own. I wish I could’ve stayed longer. It’s a home for all fellow wanderers and a place to heal/ for dreams and realities to become one.",
//                     "rate": 3.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c002",
//                     "txt": "A very special, historic and beautiful place to be! Our room was decorated so nicely and everything was lovely - the bed, pillows, shower, coffee and more. We very much enjoyed our stay.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c008",
//                     "txt": "This place looks nice but the experience is bad and not acceptable. I have to start by saying thank. The place clean looks very nice Excapt that we didn't really enjoy our time here. First it was the power generator, it took maybe more than one hour troubleshooting the generator and 7:30 the assistant brought another generator. (The first one which he brought was full of corrousions and very old) There was no water although the generator was ON. We spent the with no water, I informed the assistant but it was dark. He gave some instructions but no luck. I spent time just troubleshooting.",
//                     "rate": 2.5,
//                     "by": {
//                         "_id": 127,
//                         "fullName": "tal ekroni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png"
//                     }
//                 },
//                 {
//                     "id": "c003",
//                     "txt": "I cant even explain how amazing was the staying... the owner is very kind, the place is warm and clean.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c004",
//                     "txt": "I could not picked a better place to stay , had a wonderful and amazing time . This was top of the list of best places/experiences ever .... Cozy amazing suite ,super clean, and comfortable , lovely authentic castle.... Location is awesome , available parking. Amazing Views from Castle , unique ,fairy tale experience type . a great host, very friendly, pays attention to every single detail to take care of guest, she exceeded my expectations .Traveling through Italy for 7 weeks .I have stayed in many places in Europe, Italy and around the world .I have never experience a place like this ! I recommend this place to everyone, Thank you for a wonderful experience.",
//                     "rate": 4.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//             ],
//             "likedByUsers": [
//                 "Mosh Ben Ari",
//                 "Moris Boris"
//             ]
//         }
//     )
//     await storageService.post(STORAGE_KEY,
//         {
//             "_id": "mongo004",
//             "name": "Green Garden Cabin",
//             "type": "Cabin",
//             "type of place": "Entire place",
//             "imgUrls": [
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642875723/imgs/b2a2146b-bd69-4d27-86a8-dd52afc4ba47_hqekl9.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642875724/imgs/05675080-fb37-4ad6-abb1-57baf93b2276_snfopj.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642875722/imgs/4b194ca8-771d-4e51-927c-d01d84c4aed7_h2rwsu.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642875723/imgs/95d98018-d938-49dc-9f7d-bfd5f3a2a726_nsdn12.jpg",
//                 "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642875721/imgs/ec69ddca-eebc-41b1-88ec-2e35d30ae5ae_1_cahmx0.jpg",
//             ],
//             "price": 354.0,
//             "summary": "If you would like to experience traditional Israeli country life style, our place is ideal. Our place is located in a picturesque farming village which is rich in nature near Golan Heights, Jordan River and the Manara Cliffs. You can enjoy our seasonal citrus fruits and tasty pecan nuts.",
//             "host": {
//                 "_id": 124,
//                 "fullName": "koren aharon",
//                 "imgUrl": 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg',
//             },
//             "capacity": 7,
//             "amenities": [
//                 {
//                     "Bathroom": [
//                         "Shampoo"
//                     ]
//                 },
//                 {
//                     "Bedroom and laundry": [
//                         "Essentials",
//                         "Hangers"
//                     ]
//                 },
//                 {
//                     "Entertainment": [
//                         "TV"
//                     ]
//                 },
//                 {
//                     "Heating and cooling": [
//                         "Air conditioning",
//                         "Heating"
//                     ]
//                 },
//                 {
//                     "Home safety": [
//                         "Fire extinguisher",
//                         "Smoke alarm"
//                     ]
//                 },
//                 {
//                     "Internet and office": [
//                         "Wifi",
//                         "Dedicated workspace"
//                     ]
//                 },
//                 {
//                     "Kitchen and dining": [
//                         "Kitchen"
//                     ]
//                 },
//                 {
//                     "Location features": [
//                         "Private entrance"
//                     ]
//                 },
//                 {
//                     "Parking and facilities": [
//                         "Free parking on premises",
//                     ]
//                 },
//                 {
//                     "Services": [
//                         "Long term stays allowed"
//                     ]
//                 },
//                 {
//                     "Not included": [
//                         "Security cameras",
//                         "Washer",
//                         "Hair dryer",
//                         "Carbon monoxide alarm"
//                     ]
//                 }
//             ],
//             "loc": {
//                 "country": "Israel",
//                 "countryCode": "IL",
//                 "address": "Beit Hillel",
//                 "lat": 33.2149485868632446,
//                 "lng": 35.61179569215711
//             },
//             "reviews": [
//                 {
//                     "id": "c001",
//                     "txt": "No pictures can do justice to the serenity you feel at this place. Waking up and sleeping to the sounds of river, sunshine always peaking through the trees, birds and butterflies fluttering around- there was a whimsical quality to it all. It felt like a slice of paradise. this hospitality was humbling and she made me feel at home thousands of miles away from my own. I wish I could’ve stayed longer. It’s a home for all fellow wanderers and a place to heal/ for dreams and realities to become one.",
//                     "rate": 3.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//                 {
//                     "id": "c002",
//                     "txt": "A very special, historic and beautiful place to be! Our room was decorated so nicely and everything was lovely - the bed, pillows, shower, coffee and more. We very much enjoyed our stay.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c007",
//                     "txt": "This was the most beautiful, delightful apartment I have seen. The host was respectful and friendly, we ran into some issues before the checkin, so he waited for us without any problems. The place is better than the photos, very cleaned and has a great river view especially in the morning. I would totally recommend this place for everyone want to enjoy his staying.",
//                     "rate": 4.4,
//                     "by": {
//                         "_id": 127,
//                         "fullName": "tal ekroni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png"
//                     }
//                 },
//                 {
//                     "id": "c003",
//                     "txt": "I cant even explain how amazing was the staying... the owner is very kind, the place is warm and clean.",
//                     "rate": 5,
//                     "by": {
//                         "_id": 126,
//                         "fullName": "idan gez",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg"
//                     }
//                 },
//                 {
//                     "id": "c004",
//                     "txt": "I could not picked a better place to stay , had a wonderful and amazing time . This was top of the list of best places/experiences ever .... Cozy amazing suite ,super clean, and comfortable , lovely authentic castle.... Location is awesome , available parking. Amazing Views from Castle , unique ,fairy tale experience type . a great host, very friendly, pays attention to every single detail to take care of guest, she exceeded my expectations .Traveling through Italy for 7 weeks .I have stayed in many places in Europe, Italy and around the world .I have never experience a place like this ! I recommend this place to everyone, Thank you for a wonderful experience.",
//                     "rate": 4.5,
//                     "by": {
//                         "_id": 125,
//                         "fullName": "michael aharoni",
//                         "imgUrl": "https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg"
//                     }
//                 },
//             ],
//             "likedByUsers": []
//         }
//     )
// }





