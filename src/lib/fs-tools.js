import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
console.log(dataFolderPath)
const usersJSONPath = join(dataFolderPath, "users.json")
const booksJSONPath = join(dataFolderPath, "books.json")
const usersPublicFolderPath = join(process.cwd(), "./public/img/users")

export const getUsers = () => readJSON(usersJSONPath)
export const writeUsers = usersArray => writeJSON(usersJSONPath, usersArray)
export const getBooks = () => readJSON(booksJSONPath)
export const writeBooks = booksArray => writeJSON(booksJSONPath, booksArray)

export const saveUsersAvatars = (fileName, contentAsABuffer) => writeFile(join(usersPublicFolderPath, fileName), contentAsABuffer)

export const getBooksReadableStream = () => createReadStream(booksJSONPath)

export const pdfWritableStream = filename => createWriteStream(join(dataFolderPath, filename))
