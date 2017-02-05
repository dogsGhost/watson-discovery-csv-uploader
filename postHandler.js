const fs = require('fs')

const csv = require('csvtojson')
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1')
const rmdir = require('rimraf')

const title = 'CSV Uploader for Watson Discovery Service'

module.exports = (req, res, next) => {
  const b = req.body
  const jsonFilePaths = []

  const sendJSON = () => {
    // connect to discovery endpoint
    const discovery = new DiscoveryV1({
      username: b.username,
      password: b.password,
      version_date: DiscoveryV1.VERSION_DATE_2016_12_15
    })

    // loop over json files and add to collection
    jsonFilePaths.forEach((path, i, arr) => {
      const file = fs.createReadStream(path)
      discovery.addDocument({
        collection_id: b.collection_id,
        environment_id: b.environment_id,
        file,
      }, (err, response) => {
console.log(err ? err : response)
        // delete the uploaded file after it's been added
        if (!err) {
          rmdir(path, () => {})
        }
        // re-render homepage with errror or success message
        if (i + 1 === arr.length) {
          res.render('index', { title, err, response })
        }
      })
    })
  }

  // read csv file and convert csv rows into individual json files
  csv({ flatKeys: true })
    .fromFile(req.file.path)
    .on('json', (row, i) => {
      const jsonFilePath = `./tmp/json/${i}_${Date.now()}.json`
      jsonFilePaths.push(jsonFilePath)
      fs.appendFileSync(jsonFilePath, JSON.stringify(row))
    })
    .on('done', err => {
      if (!err) {
        // delete csv file and start adding json
        rmdir('tmp/uploads/*', () => sendJSON())
      } else {
console.log(err)
      }
    })
}
