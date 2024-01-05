export interface IDatabaseAdapter{
    CreateNewAnnouncement(announcementDefault : AnnouncementDefault) : Promise<string | undefined> 
    CreateNewUser(credentials : CredentialsDefault) : Promise<boolean>
    AddNewImages(images: string[], id : string) : Promise<void>
    VerifyLogin(credentials : CredentialsForLogin) : Promise<any>
}

export type AnnouncementDefault = {
    adress: string,
    price: number,
    owner: string,
    agent: string,
    images: string[]    
}

export type CredentialsForLogin = {
    email: string,
    password: string
}

export type CredentialsDefault = {
    name: string,
    email: string,
    password: string,
    cpf: string, 
    phone: string,
}