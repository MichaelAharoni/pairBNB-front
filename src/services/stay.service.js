
import { userService } from './user.service.js'
import { httpService } from './http.service'

export const stayService = {
    query,
    getById,
    save,
    remove,
    update,
    sortStays,
    getStaysByHostId
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
}

async function update(stay) {
    const updatedStay = await httpService.put(`stay/`, stay)
    return updatedStay
}


async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
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
                break;
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
