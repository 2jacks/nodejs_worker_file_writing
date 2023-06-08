const fs = require('node:fs')
const path = require('node:path')

const ROWS_NUM = 30_000_000
const FILENAME = 'sample.txt'
let FILEPATH = path.join(__dirname, FILENAME)

const writeStream = fs.createWriteStream(FILEPATH, { flags: 'w' })


let i = 0
const stupud = () => {
  const value = Number((Math.random() * 1000).toFixed())
  writeStream.write(`{index: ${i}, value: ${value}}\n`, () => {
    ++i
    if (i < ROWS_NUM) {
      stupud()
    }
  })
}
stupud()
