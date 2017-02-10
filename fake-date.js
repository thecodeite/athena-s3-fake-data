const fs = require('fs')
const moment = require('moment')
const randomWords = require('random-words')
const  AWS = require('aws-sdk')

const s3 = new AWS.S3()


const date = moment()


createMany(250000, () => {
  console.log('Done!')
})

function createMany (i, done) {
  createJson(i, date)
    .then(() => {
      i--
      date.add(-1, 'hours')

      // if (i > 249990) {
      if (i > 0) {
        setTimeout(() => createMany(i, done), 0)
      } else {
        done()
      }

    })
    .catch(err => console.log(err))
}



function createJson(i, date) {
  return new Promise((resolve, reject) => {
    const id = `0000000${i}`.slice(-7)
    const lastUpdated = date.format('YYYY-MM-DD hh:mm:ss')

    const payload = {}
    for (let key=0; key<50; key++) {
      payload['key'+key] = randomWords({ min: 300, max: 1000 }).join(' ')
    }

    const data = {id, lastUpdated, payload: JSON.stringify(payload)}

    const filename = `spike2/trial_v1_${id}.json`
    const params = {Bucket: 'iph-pharma-api-spike', Key: filename, Body: JSON.stringify(data)};
    s3.putObject(params, function(err, data) {
      if (err) return reject(err)
      console.log('Uploaded:', filename)
      resolve()
    })
  })
}
