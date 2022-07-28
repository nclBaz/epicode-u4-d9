import request from "request"
import { pipeline } from "stream" // CORE MODULE
import fs from "fs-extra"
import { join } from "path" // CORE MODULE

const url = "https://skimdb.npmjs.com/registry/_changes?include_docs=true"

// ***************************************** TRADITIONAL APPROACH ****************************************************

// request.get(url, (err, data) => {
//   if (err) console.log(err)
//   else console.log(data)
// })

// ***************************************** STREAM APPROACH *********************************************************

// SOURCE (http request on npm registry) --> DESTINATION (terminal)

// const source = request.get(url) // READABLE STREAM (http request on npm registry)
// const destination = process.stdout // WRITABLE STREAM (terminal)

// *******************************************************************************************************************

// SOURCE (data.json file) --> DESTINATION (terminal)

// const source = fs.createReadStream(join(process.cwd(), "./stream-examples/data.json"))
// const destination = process.stdout // WRITABLE STREAM (terminal)

// *******************************************************************************************************************

// SOURCE (data.json file) --> DESTINATION (anotherfile.json)

// const source = fs.createReadStream(join(process.cwd(), "./stream-examples/data.json"))
// const destination = fs.createWriteStream(join(process.cwd(), "./stream-examples/anotherfile.json")) // WRITABLE STREAM (terminal)

// *******************************************************************************************************************

// SOURCE (http request on npm registry) --> DESTINATION (npm.json)

// const source = request.get(url)
// const destination = fs.createWriteStream(join(process.cwd(), "./stream-examples/npm.json")) // WRITABLE STREAM (terminal)

// pipeline(source, destination, err => {
//   if (err) console.log(err)
//   else console.log("STREAM ENDED SUCCESSFULLY!")
// })

// *******************************************************************************************************************

// SOURCE (data.json file) --> TRANSFORM (compression) --> DESTINATION (data.json.gz file)

// import { createGzip } from "zlib" // CORE MODULE

// const source = fs.createReadStream(join(process.cwd(), "./stream-examples/data.json")) // READABLE STREAM (file on disk)
// const destination = fs.createWriteStream(join(process.cwd(), "./stream-examples/data.json.gz")) // WRITABLE STREAM (terminal)
// const transform = createGzip()

// pipeline(source, transform, destination, err => {
//   if (err) console.log(err)
//   else console.log("STREAM ENDED SUCCESSFULLY!")
// })

// ***********************************************************************************************************************

const source = request.get("http://parrot.live") // READABLE STREAM (http request on npm registry)
const destination = process.stdout // WRITABLE STREAM (terminal)

pipeline(source, destination, err => {
  if (err) console.log(err)
  else console.log("STREAM ENDED SUCCESSFULLY!")
})
