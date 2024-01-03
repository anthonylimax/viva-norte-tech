import multer from "multer";
import { Application, Response } from "express";
import {FileArrayRenamed, returnURI} from "./../Middlewares/functions_route"
import { AnnouncementDefault } from "../../externals/interfaces/IDatabaseAdapter";
import { DatabaseMySQL } from "../../externals/mysql";
import { HandlerUpload } from "../../externals/cloudnary.config";

const multerConfig = multer.memoryStorage();
const upload = multer({storage : multerConfig})

export default function HandlerRoutes(app : Application){

app.post("/invitingImage", upload.fields([{name: "file"}, {name: "content"}]), async (request : any, response : Response)=> {
    // try{
    //     if(request.files.file != undefined){
    //         const file = FileArrayRenamed(request.files.file);
    //         const dataURI = returnURI(file);
    //         const sql = new DatabaseMySQL();
    //         const uris : string[] = [];
    //             images.forEach(async (element : string, index : number)=>{
    //                 uris.push(await HandlerUpload(element, req[index]));
    //             })
    //         sql.AddNewImages(url, JSON.parse(request.body.content).id);
    //         response.json({complete: true, description: "recebido o request"});
    //     }
    //     else{
    //         response.sendStatus(404).json({error: 200, description: "não há imagem"});
    //     }
    // }
    // catch(e){
    //     console.log(e);
    //     response.sendStatus(404).json({error: 200, description: "não há imagem"});
    // }
})
app.get("/", (req, res) =>{
    res.send("askaospas");
})
app.post("/createNewAnnouncement", upload.fields([{ name: "file" }, { name: "content" }]), async (request: any, response: Response) => {
    try {
        const req = FileArrayRenamed(request.files.file);
        const content = JSON.parse(request.body.content);
        const images: string[] = [];
        
        req.forEach((element: any) => {
            images.push(returnURI(element));
        });

        const announcement: AnnouncementDefault = {
            adress: content.adress,
            agent: content.agent,
            owner: content.owner,
            price: content.price,
            images: images,
        };

        const sql = new DatabaseMySQL();
        const id = await sql.CreateNewAnnouncement(announcement);

        const uploadTasks = images.map(async (element: string, index: number) => {
            const url = await HandlerUpload(element, req[index]);
            return url;
        });

        const uris = await Promise.all(uploadTasks);

        if (id !== undefined) {
            const result = await sql.AddNewImages(uris, id);
            response.json({ complete: true, description: "Criado um novo anúncio!" });
            
        } else {
            console.log("Erro ao criar novo anúncio");
            response.status(500).json({ error: 500, description: "Erro ao criar novo anúncio" });
        }
    } catch (e) {
        console.error(e);
        response.status(500).json({ error: 500, description: "Erro interno no servidor" });
    }
});

}