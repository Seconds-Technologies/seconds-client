import { PLACE_TYPES } from '../constants';
import dayjs from 'dayjs';
import { jobRequestSchema } from '../schemas';

export function parseAddress(data, requiresGeoJSON = false) {
	console.log(data)
	let address = data[0].address_components;
	let formattedAddress = {
		street: '',
		city: '',
		postcode: '',
		countryCode: 'GB',
		latitude: data[0].geometry.location.lat(),
		longitude: data[0].geometry.location.lng(),
		...(requiresGeoJSON && { geolocation: { type: 'Point', coordinates: [data[0].geometry.location.lng(), data[0].geometry.location.lat()] } })
	};
	let components = address.filter(({ types }) => types.some(type => Object.values(PLACE_TYPES).includes(type)));
	components.forEach(({ long_name, types }) => {
		switch (types[0]) {
			case PLACE_TYPES.ESTABLISHMENT:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.STREET_NUMBER:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.STREET_ADDRESS:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.SUB_PREMISE:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.PREMISE:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.INTERSECTION:
				formattedAddress.street = formattedAddress.street + long_name + ' ';
				break;
			case PLACE_TYPES.CITY:
				formattedAddress.city = long_name;
				break;
			case PLACE_TYPES.POSTCODE:
				formattedAddress.postcode = long_name;
				break;
			case PLACE_TYPES.POSTCODE_PREFIX:
				// make postcode property empty since the real value is not a full postcode
				formattedAddress.postcode = long_name;
				break;
			default:
				return;
		}
	});
	console.log(formattedAddress);
	return formattedAddress;
}

export function validateAddress(pickup, dropoff) {
	const types = ['street address', 'city', 'postcode'];
	Object.values(pickup).forEach((item, index) => {
		if (!item) throw new Error(`Pickup address does not include a '${types[index]}'. Please add all parts of the address and try again`);
		else if (index === 2 && item.length < 6)
			throw new Error(`Your Pickup postcode,' ${item}', is not complete. Please include a full UK postcode in your address`);
	});
	Object.values(dropoff).forEach((item, index) => {
		if (!item) throw new Error(`Dropoff address does not include a '${types[index]}'. Please add all parts of the address and try again`);
		else if (index === 2 && item.length < 6)
			throw new Error(`Your Dropoff postcode '${item}', is not complete. Please include a full UK postcode in your address`);
	});
	return true;
}

export function dateFilter(data, interval) {
	switch (interval) {
		case 'day':
			return data.filter(({ createdAt }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(createdAt))).as('day');
				return duration < 1;
			});
		case 'week':
			return data.filter(({ createdAt }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(createdAt))).as('week');
				return duration < 1;
			});
		case 'month':
			return data.filter(({ createdAt }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(createdAt))).as('month');
				return duration < 1;
			});
		case 'year':
			return data.filter(({ createdAt }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(createdAt))).as('year');
				return duration < 1;
			});
		default:
			return data;
	}
}

export function analyticsFilterPrevious(data, interval) {
	switch (interval) {
		case 'day':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('day');
				return duration > 1 && duration < 2;
			});
		case 'week':
			return data.filter(({  jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('week');
				return duration > 1 && duration < 2;
			});
		case 'month':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('month');
				return duration > 1 && duration < 2;
			});
		case 'year':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('year');
				return duration > 1 && duration < 2;
			});
		default:
			return data;
	}
}

export function analyticsFilterCurrent(data, interval) {
	switch (interval) {
		case 'day':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('day');
				return duration < 1;
			});
		case 'week':
			return data.filter(({  jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('week');
				return duration < 1;
			});
		case 'month':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('month');
				return duration < 1;
			});
		case 'year':
			return data.filter(({ jobSpecification: { pickupStartTime } }) => {
				let duration = dayjs.duration(dayjs().diff(dayjs(pickupStartTime))).as('year');
				return duration < 1;
			});
		default:
			return data;
	}
}

export function capitalize(str) {
	let start = str[0].toUpperCase()
	const lower = str.slice(1).toLowerCase()
	return start.concat(lower);
}

export function assemblePayload({ jobSpecification, vehicleType }) {
	let payload = {
		...jobRequestSchema,
		pickupFirstName: jobSpecification.pickupLocation.firstName,
		pickupLastName: jobSpecification.pickupLocation.lastName,
		pickupBusinessName: jobSpecification.pickupLocation.businessName,
		pickupAddress: jobSpecification.pickupLocation.fullAddress,
		pickupAddressLine1: jobSpecification.pickupLocation.streetAddress,
		pickupCity: jobSpecification.pickupLocation.city,
		pickupPostcode: jobSpecification.pickupLocation.postcode,
		pickupLongitude: jobSpecification.pickupLocation.longitude,
		pickupLatitude: jobSpecification.pickupLocation.latitude,
		pickupEmailAddress: jobSpecification.pickupLocation.email,
		pickupPhoneNumber: jobSpecification.pickupLocation.phoneNumber,
		pickupInstructions: jobSpecification.pickupLocation.instructions,
		packagePickupStartTime: jobSpecification.pickupStartTime,
		...(jobSpecification.pickupEndTime && { packagePickupEndTime: jobSpecification.pickupStartTime }),
		drops: jobSpecification.deliveries.map(({ description, dropoffLocation, dropoffEndTime }) => ({
			dropoffFirstName: dropoffLocation.firstName,
			dropoffLastName: dropoffLocation.lastName,
			dropoffBusinessName: dropoffLocation.businessName,
			dropoffAddress: dropoffLocation.fullAddress,
			dropoffAddressLine1: dropoffLocation.streetAddress,
			dropoffCity: dropoffLocation.city,
			dropoffPostcode: dropoffLocation.postcode,
			dropoffLatitude: dropoffLocation.latitude,
			dropoffLongitude: dropoffLocation.longitude,
			dropoffEmailAddress: dropoffLocation.email,
			dropoffPhoneNumber: dropoffLocation.phoneNumber,
			dropoffInstructions: dropoffLocation.instructions,
			packageDropoffEndTime: dropoffEndTime,
			packageDescription: description
		})),
		packageDeliveryType: jobSpecification.deliveryType,
		vehicleType
	};
	console.log(payload);
	return payload;
}
