import mysql2, { Connection, ErrorPacketParams, FieldPacket, RowDataPacket } from 'mysql2';
import { AnnouncementDefault, CredentialsDefault, IDatabaseAdapter } from './interfaces/IDatabaseAdapter';
import crypto, { randomUUID } from 'crypto';


export class DatabaseMySQL implements IDatabaseAdapter {
    database : any;
    constructor(){
        if(process.env.DATABASE_URL){
            this.database = mysql2.createPool(process.env.DATABASE_URL).promise();
        }
    }
    
    async CreateNewAnnouncement(announcementDefault: AnnouncementDefault) : Promise<string | undefined> {
        try {
            const uuid = crypto.randomUUID();
                this.database.query("insert into Announcements(id, adress, owner, price) values (?, ?, ?, ?)", [uuid, announcementDefault.adress, announcementDefault.owner, announcementDefault.price]);
                return uuid;
        }
        catch (e) { 
            console.log(e);
        }
    }
    async CreateNewUser(credentials: CredentialsDefault): Promise<boolean> {
        try{
            const uuid = crypto.randomUUID();
            const analising = await this.ExistInDataBase(credentials.cpf, credentials.email);
            if(analising){
                const [rows] = await this.database.query("insert into user values (?, ?, ?, ?, ?, ?)", [uuid, credentials.name.toUpperCase(), credentials.password, credentials.cpf, credentials.email, credentials.phone]);
                console.log(rows);
                return true;
            }
            else{
                return false;
            }
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    
    async ExistInDataBase(cpf : string, email : string) : Promise<boolean> { 
        const [rows] = await this.database.query("select * from user where cpf = ? or email = ?", [cpf, email]);
        console.log(rows)
        if(rows[0]){
            return false;
        }
        else{
            return true;
        }
    }

    async VerifyLogin(credentials: CredentialsDefault) : Promise<any>{
        try{
            const [rows] = await this.database.query("select * from user where password = ? and email = ?", [credentials.password, credentials.email]);
            return rows;
        }
        catch(e){
            console.log(e);
        }
    }

    async AddNewImages(images: string[], id: string): Promise<void> {
            images.forEach((url) => {
                const uuid = crypto.randomUUID();
                this.database.query("insert into Pictures values (?, ?, ?)", [uuid, id, url]);
            })
    }

}
