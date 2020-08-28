export async function getAddressFromCoordinates(coordinates) {
  return '5441 Curie Street, Palanan, Makati City, Philippines 1630';
}
 
export async function getCoordinatesFromAddress(address) {
  return {
    lat: 14.562000,
    lng: 121.001080
  };
}

/*const GOOGLE_API_KEY = 'AIzaSyC3TNEs1OSTVvYy-2Kj7bYH0JvoykaipK4';

export async function getAddressFromCoordinates(coordinates) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${GOOGLE_API_KEY}`);

  if (!response.ok) {
    throw new Error('Failed to fetch address. Please try again.');
  }

  const data = await response.json();

  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;

  return address;
}

export async function getCoordinatesFromAddress(address) {
  const urlAddress = encodeURI(address);
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`);

  if (!response.ok) {
    throw new Error('Failed to fetch coordinates. Please try again.');
  }

  const data = await response.json();

  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}*/