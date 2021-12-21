import { PLACE_TYPES } from '../constants';

export function parseAddress(data){
	let address = data[0].address_components;
	let formattedAddress = {
		street: '',
		city: '',
		postcode: '',
		countryCode: 'GB',
		latitude: data[0].geometry.location.lat(),
		longitude: data[0].geometry.location.lng(),
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