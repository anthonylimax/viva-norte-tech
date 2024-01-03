import mysql2, { Connection, ErrorPacketParams, FieldPacket, RowDataPacket } from 'mysql2';
import { AnnouncementDefault, CredentialsDefault, IDatabaseAdapter } from './interfaces/IDatabaseAdapter';
import crypto from 'crypto';


export class DatabaseMySQL implements IDatabaseAdapter {
    database : any;
    constructor(){
        if(process.env.DATABASE_URL){
            this.database = mysql2.createPool(process.env.DATABASE_URL);
        }
    }
    
    async CreateNewAnnouncement(announcementDefault: AnnouncementDefault) : Promise<string | undefined> {
        try {
            const uuid = crypto.randomUUID();
            if (process.env.DATABASE_URL) {
                this.database.execute("insert into Announcements(id, adress, owner, price) values (?, ?, ?, ?)", [uuid, announcementDefault.adress, announcementDefault.owner, announcementDefault.price], (error: ErrorPacketParams, result: RowDataPacket, fields: FieldPacket) => {
                });
                return uuid;
            }
        }
        catch (e) { 
            console.log(e);
        }
    }
    async CreateNewUser(credentials: CredentialsDefault): Promise<void> {

    }
    async AddNewImages(images: string[], id: string): Promise<void> {
            images.forEach((url) => {
                const uuid = crypto.randomUUID();
                this.database.execute("insert into Pictures values (?, ?, ?)", [uuid, id, url], (error: ErrorPacketParams, result: RowDataPacket, fields: FieldPacket)=>{
                    console.log(error, result)
                });
            })
    }

}
