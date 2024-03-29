export const jobRequestSchema = {
	pickupFirstName: '',
	pickupLastName: '',
	pickupBusinessName: '',
	pickupAddressLine1: '',
	pickupAddressLine2: '',
	pickupCity: '',
	pickupPostcode: '',
	pickupEmailAddress: '',
	pickupPhoneNumber: '',
	pickupInstructions: '',
	packagePickupStartTime: '',
	drops: [
		{
			dropoffFirstName: '',
			dropoffLastName: '',
			dropoffBusinessName: '',
			dropoffAddressLine1: '',
			dropoffAddressLine2: '',
			dropoffCity: '',
			dropoffPostcode: '',
			dropoffEmailAddress: '',
			dropoffPhoneNumber: '',
			dropoffInstructions: '',
			packageDropoffEndTime: '',
			packageDescription: '',
		},
	],
	packageDeliveryType: '',
	itemsCount: null,
	vehicleType: '',
};