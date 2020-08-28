import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordinatesFromAddress, getAddressFromCoordinates } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserButton = document.getElementById('locate-btn');

    this.shareButton = document.getElementById('share-btn');

    locateUserButton.addEventListener('click', this.locateUserHandler.bind(this));

    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));

    this.shareButton.addEventListener('click', this.sharePlaceHandler);
  }

  sharePlaceHandler() {
    const sharedLinkInputElement = document.getElementById('share-link');

    if (!navigator.clipboard) {
      sharedLinkInputElement.select();

      return;
    }

    navigator.clipboard.writeText(sharedLinkInputElement.value).then(() => {
      alert('Copied into clipboard.');
    }).catch(error => {
      console.log(error);

      sharedLinkInputElement.select();
    });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }

    this.shareButton.disabled = false;

    const sharedLinkInputElement = document.getElementById('share-link');

    sharedLinkInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
  }

  locateUserHandler() {
    if (!navigator.geolocation) {
      alert('Geolocation feature is not available in your browser. Please use a more modern browser or just enter the address manually.');

      return;
    }

    const modal = new Modal('loading-modal-content', 'Loading location, please wait...');

    modal.show();

    navigator.geolocation.getCurrentPosition(async position => {
      modal.hide();

      const coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const address = await getAddressFromCoordinates(coordinates);

      modal.hide();

      this.selectPlace(coordinates, address);
    }, error => {
      modal.hide();

      alert('Could not locate your address. Please enter an address manually.');
    });
  }

  async findAddressHandler(event) {
    event.preventDefault();

    const address = event.target.querySelector('input').value;

    if (!address || address.trim().length === 0) {
      alert('Invalid address entered, please try again...');

      return;
    }

    const modal = new Modal('loading-modal-content', 'Loading location, please wait...');

    modal.show();
    
    try {
      const coordinates = await getCoordinatesFromAddress(address);

      this.selectPlace(coordinates, address);
    } catch(error) {
      alert(error.message);
    }

    modal.hide();
  }
}

new PlaceFinder();