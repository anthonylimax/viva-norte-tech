class Announcement{
    public adress: string;
    public cep : string;
    public number: number;
    public reference: string | undefined;   

    constructor(
        adress : string,
        cep : string,
        number : number,
        reference : string
    ){
        this.adress = adress;
        this.cep = cep;
        this.number = number;
        this.reference = reference;
    }
}