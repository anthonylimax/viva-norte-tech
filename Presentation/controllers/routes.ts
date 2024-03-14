import multer from "multer";
import { validate } from "cpf-check";
import { Application, Response } from "express";
import { FileArrayRenamed, returnURI } from "../util/functions_route";
import { AnnouncementDefault } from "../../externals/interfaces/IDatabaseAdapter";
import { DatabaseMySQL } from "../../externals/mysql";
import { HandlerUpload } from "../../externals/cloudnary.config";
import { Login } from "../../useCases/verifyLogin";
import { Maps } from "../../externals/maps";

const multerConfig = multer.memoryStorage();
const upload = multer({ storage: multerConfig });

export default function HandlerRoutes(app: Application) {
  const sql = new DatabaseMySQL();
  const maps = new Maps();
  app.post("/getLocalization", async (req, res) => {
    try {
      const query = await maps.getAdressWithLatLong(
        req.body.lat,
        req.body.long
      );
      console.log(query);
      res.json(query);
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/getCoords", async (req, res) => {
    try {
      const data = req.body.address;
      const result = await maps.getLatLongWithAddress(data);
      res.json(result);
    } catch (e) {}
  });

  app.get("/getAll", async (req, res) => {
    try {
      const request = await sql.GetAllAnnouncements();
      res.json(request);
    } catch (e) {}
  });

  app.post("/createNewUser", async (req, res) => {
    try {
      const newCredentials = {
        email: req.body.email,
        password: req.body.password,
        cpf: req.body.cpf,
        phone: req.body.phone,
        name: req.body.name,
      };
      if (validate(newCredentials.cpf)) {
        const result = await sql.CreateNewUser(newCredentials);
        result
          ? res.json({
              status: "completed",
              operation: "making an account!",
            })
          : res.json({
              status: "uncompleted, one error!",
              operation: "making an account!",
            });
      }
    } catch (e) {}
  });

  app.post("/announcement/id", async (req, res) => {
    const data = req.body;
    console.log(data);
    const result = await sql.GetSingleAnnouncement(data.id);
    res.send(result);
  });
  app.post("/loginVerification", async (request, response) => {
    const loginCase = new Login(sql);
    const result = await loginCase.VerifyLogin(request.body);
    if (result !== undefined) {
      response.json(result);
    } else {
      response.json({ error: "something wrong", operation: "login" });
    }
  });
  app.post(
    "/createNewAnnouncement",
    upload.fields([{ name: "file" }, { name: "content" }]),
    async (request: any, response: Response) => {
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

        const id = await sql.CreateNewAnnouncement(announcement);

        const uploadTasks = images.map(
          async (element: string, index: number) => {
            const url = await HandlerUpload(element, req[index]);
            return url;
          }
        );

        const uris = await Promise.all(uploadTasks);

        if (id !== undefined) {
          const result = await sql.AddNewImages(uris, id);
          response.json({
            complete: true,
            description: "Criado um novo anúncio!",
          });
        } else {
          console.log("Erro ao criar novo anúncio");
          response
            .status(500)
            .json({ error: 500, description: "Erro ao criar novo anúncio" });
        }
      } catch (e) {
        console.error(e);
        response
          .status(500)
          .json({ error: 500, description: "Erro interno no servidor" });
      }
    }
  );
}
