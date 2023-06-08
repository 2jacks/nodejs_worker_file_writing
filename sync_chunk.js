const fs = require('node:fs')
const path = require('node:path')

const FILENAME = 'sample.txt'
let FILEPATH = path.join(__dirname, FILENAME)


const ROWS_NUM = 120_000_000
const MAX_CHUNK_SIZE = 500 * 10 ** 6 //1mb

let rowsWritten = 0
let chunk = []
let chunkSize = 0

let iterations = 0

while (rowsWritten < ROWS_NUM) {
  console.log('ROWS WRITTEN', rowsWritten)
  while (chunkSize < MAX_CHUNK_SIZE) {
    const value = Number((Math.random() * 10000).toFixed())
    const rowdata = `{index: ${rowsWritten}, value: ${value}}\n`
    if (chunkSize + rowdata.length < MAX_CHUNK_SIZE) {
      chunk.push(rowdata)
      rowsWritten++
    }
    chunkSize += rowdata.length
  }
  console.log('ATTEMPT TO WRITE', chunkSize)
  fs.appendFileSync(FILEPATH, chunk.join(''))
  chunk = []
  chunkSize = 0

  iterations++
}

console.log('ITERATIONS', iterations)
