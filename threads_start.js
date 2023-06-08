const { Worker } = require('node:worker_threads')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

const FILENAME = 'sample.txt'
let FILEPATH = path.join(__dirname, FILENAME)

const TARGET_ROWS = 360_000_000

const WORKERS_COUNT = os.cpus().length // Забиваем все потоки
//const WORKERS_COUNT = 6
const TOTALMEM_USAGE_PERCENT = 0.3 // <--- стараемся занять половину доступной RAM

const _CORRECTION_FACTOR = 0.3
const _ALL_MEM_MB_PER_CHUNK = os.totalmem() / WORKERS_COUNT / 10 ** 6 // Сколько каждому потоку можно выделить памяти от общего количества
const MB_PER_CHUNK = parseInt(
  _ALL_MEM_MB_PER_CHUNK * TOTALMEM_USAGE_PERCENT * _CORRECTION_FACTOR
) // Целевое потребление памяти потоком
// const MB_PER_CHUNK = 50

console.log('MB_PRE_CHUNK', MB_PER_CHUNK)

let doneCount = 0

const start = Date.now()

const fd = fs.openSync(FILEPATH, 'w')

const workers = []
for (let i = 0; i < WORKERS_COUNT; i++) {
  const w = new Worker('./threads_writer.js', {
    workerData: {
      TARGET_ROWS: TARGET_ROWS,
      WORKERS_COUNT: WORKERS_COUNT,
      MB_PER_CHUNK: MB_PER_CHUNK
    }
  })
  w.on('message', message => {
    doneCount += 1
    if (doneCount === WORKERS_COUNT) {
      fs.closeSync(fd)
      const end = Date.now()
      console.log('EXECUION TIME, MIN', (end - start) / 60000)
    }
  })
  workers.push(w)
}
