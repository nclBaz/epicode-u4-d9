import PdfPrinter from "pdfmake"
import { pipeline } from "stream"
import { promisify } from "util"
import fs from "fs"
import { pdfWritableStream } from "./fs-tools.js"
// Define font files

export const getPDFReadableStream = booksArray => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  const printer = new PdfPrinter(fonts)

  const tableContent = [
    ["TITLE", "CATEGORY"],
    ...booksArray.map(book => {
      return [book.title, book.category]
    }),
  ]

  const docDefinition = {
    // content: booksArray.map(book => {
    //   return {
    //     text: `${book.title} - ${book.category}`,
    //     style: "header",
    //   }
    // }),
    content: [
      {
        style: "tableExample",
        table: {
          body: tableContent,
        },
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}

export const generatePDFAsync = async booksArray => {
  const source = getPDFReadableStream(booksArray)
  const destination = pdfWritableStream("test.pdf")

  // normally pipeline works with callbacks to determine when the stream is completed, we shall avoid mixing callbacks with Promises (and Async/Await). In order to fix this we should convert the normal callback pipeline into a Promise Based Pipeline
  /*
    BAD (CALLBACK BASED PIPELINE)
    pipeline(source, transform, destination, err => {
        if (err) console.log(err)
      })
    
    GOOD (PROMISE BASED PIPELINE)
    await pipeline(source, transform, destination)

  */

  const promisePipeline = promisify(pipeline) // promisify is an amazing utility from 'util' core module, which turns an error-first callback based function into a promise based function (and so Async/Await). Pipeline is a function which works with error-first callbacks --> I can promisify a pipeline, obtaining a "Promise Based Pipeline"
  await promisePipeline(source, destination)
}

// const promiseReadFile = promisify(fs.readFile)

// const buffer = await promiseReadFile()
