import mysql2, { Connection, ErrorPacketParams, FieldPacket, RowDataPacket } from 'mysql2';
import { AnnouncementDefault, CredentialsDefault, IDatabaseAdapter } from './interfaces/IDatabaseAdapter';
import crypto, { randomUUID } from 'crypto';


export class DatabaseMySQL implements IDatabaseAdapter {
    database: any;
    constructor() {
        if (process.env.DATABASE_URL) {
            this.database = mysql2.createPool(process.env.DATABASE_URL).promise();
        }
    }
    async GetSingleAnnouncement(id: string): Promise<any> {
        try{
            const announcement = await this.database.query("select * from Announcements as a join filters as f on f.id_announcement = a.id where a.id = ?", [id])

        const pictures = await this.database.query("select url, id from Pictures where id_announcements = ?", [id]);
        const announcementResponse = {
            announcement: {
                adress: announcement[0][0]["adress"],
                owner: announcement[0][0]["owner"],
                price: announcement[0][0]["price"],
                status: announcement[0][0]["status"],
                id_announcement: announcement[0][0]["id_announcement"],
                num_banheiros: announcement[0][0]["num_banheiros"],
                num_garage_space: announcement[0][0]["num_garage_space"],
                num_rooms: announcement[0][0]["num_rooms"],
                area: announcement[0][0]["area"],
            },
            details: {
                box_blindex: announcement[0][0]["box_blindex"],
                closet: announcement[0][0]["closet"],
                american_kitchen: announcement[0][0]["american_kitchen"],
                intercom: announcement[0][0]["intercom"],
                furnished: announcement[0][0]["furnished"],
                gourmet_balcony: announcement[0][0]["gourmet_balcony"],
                balcony: announcement[0][0]["balcony"],
                games_room: announcement[0][0]["games_room"],
                pcd_access: announcement[0][0]["pcd_access"],
                bicycle_rack: announcement[0][0]["bicycle_rack"],
                coworker: announcement[0][0]["coworker"],
                elevator: announcement[0][0]["elevator"],
                laundry: announcement[0][0]["laundry"],
                reception: announcement[0][0]["reception"],
                turkish_bath: announcement[0][0]["turkish_bath"],
                in_plan: announcement[0][0]["in_plan"],
                in_built: announcement[0][0]["in_built"],
                done: announcement[0][0]["done"],
                accept_animals: announcement[0][0]["accept_animals"],
                service_room: announcement[0][0]["service_room"],
                closet_in_bedroom: announcement[0][0]["closet_in_bedroom"],
                cabinet_in_bathroom: announcement[0][0]["cabinet_in_bathroom"],
                cabinet_in_kitchen: announcement[0][0]["cabinet_in_kitchen"],
                gym: announcement[0][0]["gym"],
                grill: announcement[0][0]["grill"],
                gourmet_space: announcement[0][0]["gourmet_space"],
                green_space: announcement[0][0]["green_space"],
                garden: announcement[0][0]["garden"],
                pool: announcement[0][0]["pool"],
                playground: announcement[0][0]["playground"],
                multisports_court: announcement[0][0]["multisports_court"],
                party_room: announcement[0][0]["party_room"],
                big_windows: announcement[0][0]["big_windows"],
                tv: announcement[0][0]["tv"]
            },
            pictures: pictures[0]
        }
        console.log(announcementResponse)
        return announcementResponse;
        }
        catch(e){
            
        }
    }

    async CreateNewAnnouncement(announcementDefault: AnnouncementDefault): Promise<string | undefined> {
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
        try {
            const uuid = crypto.randomUUID();
            const analising = await this.ExistInDataBase(credentials.cpf, credentials.email);
            if (analising) {
                const [rows] = await this.database.query("insert into user values (?, ?, ?, ?, ?, ?)", [uuid, credentials.name.toUpperCase(), credentials.password, credentials.cpf, credentials.email, credentials.phone]);
                console.log(rows);
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async ExistInDataBase(cpf: string, email: string): Promise<boolean> {
        const [rows] = await this.database.query("select * from user where cpf = ? or email = ?", [cpf, email]);
        console.log(rows)
        if (rows[0]) {
            return false;
        }
        else {
            return true;
        }
    }

    async VerifyLogin(credentials: CredentialsDefault): Promise<any> {
        try {
            const [rows] = await this.database.query("select * from user where password = ? and email = ?", [credentials.password, credentials.email]);
            return rows;
        }
        catch (e) {
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
