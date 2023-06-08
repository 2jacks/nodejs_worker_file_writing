const fs = require('node:fs')
const path = require('node:path')

const ROWS_NUM = 120_000_000
const ITERATIONS = 12
const ROWS_CHUNK_LEN = ROWS_NUM / ITERATIONS
const FILENAME = 'sample.txt'
let FILEPATH = path.join(__dirname, FILENAME)

const writeStream = fs.createWriteStream(FILEPATH, { flags: 'w' })

for (let i = 0; i < ITERATIONS - 1; i++) {
  let startPos = ROWS_CHUNK_LEN * i
  const chunk = []
  for (let j = startPos; j < startPos + ROWS_CHUNK_LEN; j++) {
    const value = Number((Math.random() * 10000).toFixed())
    const rowdata = `{index: ${j}, value: ${value}}\n`
    chunk.push(rowdata)
  }
  writeStream.write(chunk.join(''))
}
