const fs = require('fs')
const moment = require('moment')
const randomWords = require('random-words')
const  AWS = require('aws-sdk')

const s3 = new AWS.S3()


const date = moment()


createMany(25000, () => {
  console.log('Done!')
})

function createMany (i, done) {
  createJson(i, date)
    .then(nextI => {
      i = nextI
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
    let document = ''
    for(let j=0; j<10; j++) {
      const id = `0000000${i}`.slice(-7)
      i++
      const lastUpdated = date.format('YYYY-MM-DD hh:mm:ss')

      const payload = {}
      for (let key=0; key<50; key++) {
        payload['key'+key] = randomWords({ min: 300, max: 1000 }).join(' ')
      }

      const data = {id, lastUpdated, payload: JSON.stringify(payload)}
      document += JSON.stringify(data) + '\n'
    }

    const filename = `spike3/trial_v1_${id}.json`
    const params = {Bucket: 'iph-pharma-api-spike', Key: filename, Body: document};
    s3.putObject(params, function(err, data) {
      if (err) return reject(err)
      console.log('Uploaded:', filename)
      resolve(i)
    })
  })
}
