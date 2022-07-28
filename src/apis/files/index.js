import express from "express"
import multer from "multer"
import { extname } from "path"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import { createGzip } from "zlib"
import json2csv from "json2csv"

import { getBooks, getBooksReadableStream, saveUsersAvatars } from "../../lib/fs-tools.js"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // this searches in your process.env for something called CLOUDINARY_URL which contains your cloudinary api key and secret
    params: {
      folder: "jul22/books",
    },
  }),
  limits: { fileSize: 1024 * 1024 },
}).single("avatar")

const filesRouter = express.Router()

filesRouter.post("/single", multer({ limits: { fileSize: 1024 * 1024 } }).single("avatar"), async (req, res, next) => {
  // "avatar" needs to match precisely the name of the field appended in the FormData object coming from the FE. Otherwise multer is not going to find that file
  try {
    console.log("FILE: ", req.file)
    // find user by userId (3kg6a8l5s06609) in users.json

    // save the file as /public/img/users/3kg6a8l5s06609.gif
    // update that user by adding the path to the image, like "avatar": "/public/img/users/3kg6a8l5s06609.gif" to give the FE the possibility to display the image later on in an <img src="http://localhost:3001/public/img/users/3kg6a8l5s06609.gif" />
    const fileName = "3kg6a8l5s06609" + extname(req.file.originalname)
    await saveUsersAvatars(fileName, req.file.buffer)
    res.send("UPLOADED")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/multiple", multer().array("avatars"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("UPLOADED")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/cloudinary", cloudinaryUploader, async (req, res, next) => {
  try {
    console.log("REQ FILE: ", req.file)

    // 1. upload on Cloudinary happens automatically
    // 2. req.file contains the path which is the url where to find that picture
    // 3. update the resource by adding the path to it
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/booksJSON", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request, ...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader("Content-Disposition", "attachment; filename=books.json.gz") // This header tells the browser to open the "save file on disk" dialog
    const source = getBooksReadableStream()
    const destination = res
    const transform = createGzip()

    pipeline(source, transform, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/PDF", async (req, res, next) => {
  try {
    // SOURCE ( PDF Readable Stream) --> DESTINATION (http response)

    const books = await getBooks()

    res.setHeader("Content-Disposition", "attachment; filename=books.pdf")
    const source = getPDFReadableStream(books)
    const destination = res
    pipeline(source, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/CSV", (req, res, next) => {
  try {
    // SOURCE (books.json) --> TRANSFORM (json into csv) --> DESTINATION (response)
    res.setHeader("Content-Disposition", "attachment; filename=books.csv") // This header tells the browser to open the "save file on disk" dialog
    const source = getBooksReadableStream()
    const destination = res
    const transform = new json2csv.Transform({ fields: ["asin", "title", "category"] })

    pipeline(source, transform, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

export default filesRouter
