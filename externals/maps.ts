import axios from "axios";


export class Maps{
    constructor(){}


    async getAdressWithLatLong(lat: string, long: string){
       try{
        const query = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.KEY_MAPS}`));
        const result = await query.data?.results[0];
        console.log(query.request)
        return result;
       }
       catch(e){
        console.log(e)
       }
    }

}
