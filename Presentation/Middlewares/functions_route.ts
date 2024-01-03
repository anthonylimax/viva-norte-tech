function FileArrayRenamed(files : any[]){
    const date = new Date();
    files.forEach((file)=>{
        file.originalname = `date:${date.getTime()}_file-name:${file.originalname}`;
    });
    return files;
}


function returnURI(file : any) : string{
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    return dataURI;
}

export {FileArrayRenamed, returnURI};