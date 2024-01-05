import { CredentialsForLogin } from "../externals/interfaces/IDatabaseAdapter";
import { IDatabaseAdapter } from "./../externals/interfaces/IDatabaseAdapter";

export class Login {
    db: IDatabaseAdapter;
    constructor(db: IDatabaseAdapter) {
        this.db = db;
    }

    async VerifyLogin(json: CredentialsForLogin) : Promise<any> {
                const credentials = {
                    email: json.email,
                    password: json.password
                }
                
                const result = await this.db.VerifyLogin(credentials)
                return result;
    }
}