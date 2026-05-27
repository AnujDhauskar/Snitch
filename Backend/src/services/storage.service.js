import Imagekit from "@imagekit/nodejs";
import {config} from "../config/config.js"

const client = new Imagekit({
    privateKey:config.IMAGEKIT_PRIVATE_KEY,
    
});

export async function uploadFile({buffer,fileName,folder = "snitch"}){
  const result = await client.files.upload({
      file: await Imagekit.toFile(buffer),
      fileName,
      folder
  })

  return result;
}