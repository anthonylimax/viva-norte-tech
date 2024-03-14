import axios from "axios";

export class Maps {
  constructor() {}

  async getAdressWithLatLong(lat: string, long: string) {
    try {
      const query = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.KEY_MAPS}`
      );
      const result = await query.data?.results[0];
      console.log(query.request);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async getLatLongWithAddress(address: string) {
    try {
      const components = address.split(" ");
      let uri = "";
      components.forEach((element, index) => {
        uri += (index > 0 ? "%20" : "") + element;
      });
      const query = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${uri}&key=${process.env.KEY_MAPS}`
      );
      const result = await query.data.results[0].geometry.location;
      return result;
    } catch (e) {
      console.log(e);
      return {
        erro: e,
      };
    }
  }
}
