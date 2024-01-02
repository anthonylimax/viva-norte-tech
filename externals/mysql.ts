import mysql2 from 'mysql2';
import { AnnouncementDefault, CredentialsDefault, IDatabaseAdapter } from './interfaces/IDatabaseAdapter';
import crypto from 'crypto';


export class DatabaseMySQL implements IDatabaseAdapter {

    async CreateNewAnnouncement(announcementDefault: AnnouncementDefault) : Promise<string | undefined> {
        try {
            const uuid = crypto.randomUUID();
            if (process.env.DATABASE_URL) {
                const database = mysql2.createConnection(process.env.DATABASE_URL);
                database.execute("insert into Announcements(id, adress, owner, price) values (?, ?, ?, ?)", [uuid, announcementDefault.adress, announcementDefault.owner, announcementDefault.price], (error, result, fields) => {
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
        if (process.env.DATABASE_URL) {
            const database = mysql2.createConnection(process.env.DATABASE_URL);
            images.forEach((url) => {
                const uuid = crypto.randomUUID();
                database.execute("insert into Pictures values (?, ?, ?)", [uuid, id, url], (error, result, fields)=>{
                    console.log(error, result)
                });
            })
        }
    }

}
