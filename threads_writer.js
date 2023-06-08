const fs = require('node:fs')
const path = require('node:path')
const { workerData, parentPort } = require('worker_threads')

const FILENAME = 'sample.txt'
let FILEPATH = path.join(__dirname, FILENAME)

const CHUNK_SIZE = workerData.MB_PER_CHUNK * 10 ** 6

const AVG_ROW_SIZE = 64

const ROWS_NUM = workerData.TARGET_ROWS / workerData.WORKERS_COUNT
const ROWS_IN_CHUNK = CHUNK_SIZE / AVG_ROW_SIZE
const ITERATIONS = ROWS_NUM / ROWS_IN_CHUNK

//const writeStream = fs.createWriteStream(FILEPATH, { flags: 'w' })

let offset = 0
for (let i = 0; i < ITERATIONS; i++) {
  let startPos = offset * i
  const chunk = []
  for (let j = startPos; j < startPos + ROWS_IN_CHUNK; j++) {
    const value = Number((Math.random() * 10000).toFixed())
    const rowdata = `{index: ${j}, value: ${value}}\n`
    chunk.push(rowdata)
  }
  fs.appendFileSync(FILEPATH, chunk.join(''))
}

parentPort.postMessage('done')
