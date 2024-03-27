import mysql2, {
  Connection,
  ErrorPacketParams,
  FieldPacket,
  RowDataPacket,
} from "mysql2";
import {
  AnnouncementDefault,
  CredentialsDefault,
  IDatabaseAdapter,
} from "./interfaces/IDatabaseAdapter";
import crypto, { randomUUID } from "crypto";
import { AnnouncementDTO } from "../Presentation/util/AnnouncementDTO";

export class DatabaseMySQL implements IDatabaseAdapter {
  database: any;
  constructor() {
    if (process.env.DATABASE_URL) {
      this.database = mysql2.createPool(process.env.DATABASE_URL).promise();
    }
  }
  async SingleConsult(consult: any): Promise<any[]> {
    try {
      const keys = Object.keys(consult);
      let query = `select * from Announcements as a join filters as f on f.id_announcement = a.id ${
        keys.length > 0 ? "where " : ""
      }`;
      keys.forEach((element, index) => {
        query += `f.${element} = ${consult[element]} ${
          keys.length > index + 1 ? "and " : ""
        }`;
      });
      const [announcement] = await this.database.query(query);
      const [pictures]: any[] = await this.database.query(
        "select url, id, id_announcements from Pictures"
      );

      const content: any[] = [];
      announcement.forEach((element: any) => {
        const pics = pictures.filter(
          (x: any) => x.id_announcements == element.id_announcement
        );
        content.push(AnnouncementDTO(element, pics));
      });
      return content;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  async GetAllAnnouncements(): Promise<any> {
    try {
      const [announcement]: any[] = await this.database.query(
        "select * from Announcements as a join filters as f on f.id_announcement = a.id"
      );
      const [pictures]: any[] = await this.database.query(
        "select url, id, id_announcements from Pictures"
      );
      const content: any[] = [];
      console.log(announcement);
      announcement.forEach((element: any) => {
        const pics = pictures.filter(
          (x: any) => x.id_announcements == element.id_announcement
        );
        content.push(AnnouncementDTO(element, pics));
      });
      return content;
    } catch (e) {
      console.log(e);
    }
  }

  async GetSingleAnnouncement(id: string): Promise<any> {
    try {
      const [announcement] = await this.database.query(
        "select * from Announcements as a join filters as f on f.id_announcement = a.id where a.id = ?",
        [id]
      );
      const [pictures] = await this.database.query(
        "select url, id from Pictures where id_announcements = ?",
        [id]
      );
      const announcementResponse = AnnouncementDTO(announcement[0], pictures);
      console.log(announcementResponse);
      return announcementResponse;
    } catch (e) {}
  }

  async CreateNewAnnouncement(
    announcementDefault: AnnouncementDefault
  ): Promise<string | undefined> {
    try {
      const uuid = crypto.randomUUID();
      this.database.query(
        "insert into Announcements(id, adress, owner, price) values (?, ?, ?, ?)",
        [
          uuid,
          announcementDefault.adress,
          announcementDefault.owner,
          announcementDefault.price,
        ]
      );
      return uuid;
    } catch (e) {
      console.log(e);
    }
  }
  async CreateNewUser(credentials: CredentialsDefault): Promise<boolean> {
    try {
      const uuid = crypto.randomUUID();
      const analising = await this.ExistInDataBase(
        credentials.cpf,
        credentials.email
      );
      if (analising) {
        const [rows] = await this.database.query(
          "insert into user values (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            uuid,
            credentials.name.toUpperCase(),
            credentials.password,
            credentials.cpf,
            credentials.email,
            credentials.phone,
            "",
            credentials.date,
          ]
        );
        console.log(rows);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async ExistInDataBase(cpf: string, email: string): Promise<boolean> {
    const [rows] = await this.database.query(
      "select * from user where cpf = ? or email = ?",
      [cpf, email]
    );
    console.log(rows);
    if (rows[0]) {
      return false;
    } else {
      return true;
    }
  }

  async VerifyLogin(credentials: CredentialsDefault): Promise<any> {
    try {
      const [rows] = await this.database.query(
        "select * from user where password = ? and email = ?",
        [credentials.password, credentials.email]
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async GetAllFavorites(id: string) {
    const [rows] = await this.database.query(
      "select ID_ANNOUNCEMENT FROM FAVORITES WHERE ID_USER = ?",
      [id]
    );
    return rows;
  }
  async RemoveFavorite(id_announcement: string, id_user: string) {
    const [rows] = await this.database.query(
      "delete from FAVORITES where ID_USER= ? and ID_ANNOUNCEMENT= ?",
      [id_user, id_announcement]
    );
    return rows[0];
  }
  async InsertFavorite(id_announcement: string, id_user: string) {
    const [rows] = await this.database.query(
      "insert into FAVORITES(ID_ANNOUNCEMENT, ID_USER) values (?, ?)",
      [id_announcement, id_user]
    );
    return rows[0];
  }

  async AddNewImages(images: string[], id: string): Promise<void> {
    images.forEach((url) => {
      const uuid = crypto.randomUUID();
      this.database.query("insert into Pictures values (?, ?, ?)", [
        uuid,
        id,
        url,
      ]);
    });
  }
}
