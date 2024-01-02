export interface IDatabaseAdapter{
    CreateNewAnnouncement(announcementDefault : AnnouncementDefault) : Promise<string | undefined> 
    CreateNewUser(credentials : CredentialsDefault) : Promise<void>
    AddNewImages(images: string[], id : string) : Promise<void>
}

export type AnnouncementDefault = {
    adress: string,
    price: number,
    owner: string,
    agent: string,
    images: string[]
}

export type CredentialsDefault = {
    name: string,
    email: string,
    password: string,
}