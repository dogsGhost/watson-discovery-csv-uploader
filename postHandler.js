const fs = require('fs')

const csv = require('csvtojson')
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1')
const rmdir = require('rimraf')

const title = 'CSV Uploader for Watson Discovery Service'


var interval = 0.1 * 1000; // 0.1 second;

module.exports = (req, res, next) => {
  const b = req.body
  const jsonFilePaths = []
  // connect to discovery endpoint
  const discovery = new DiscoveryV1({
    username: b.username,
    password: b.password,
    version_date: DiscoveryV1.VERSION_DATE_2016_12_15
  })

  // add a file to discovery collection
  // `i` is only passed when sendFile is called in a loop,
  // we have a default value so the check the callback evaluates to true
  const sendFile = (path, i = -1) => {
  // add 0.1 second delay per loop iteration to prevent timeout of discovery
     setTimeout( function (i) {
    const file = fs.createReadStream(path)
    discovery.addDocument({
      collection_id: b.collection_id,
      environment_id: b.environment_id,
      file,
    }, (err, response) => {
      // delete the uploaded file after it's been added
      if (!err) {
        rmdir(path, () => {})
      }
      // re-render homepage with errror or success message
      if (i + 1 === jsonFilePaths.length) {
        res.render('index', { title, err, response })
      }
    })
    }, interval * i, i);
  }

  // read csv file and convert csv rows into individual json files
  const processCSV = () => {
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
          rmdir('tmp/uploads/*', () => {
            jsonFilePaths.forEach((path, i) => sendFile(path, i))
          })
        } else {
          // TODO: handle error
        }
      })
  }

  if (req.file) {
    if (req.file.mimetype === 'text/csv') {
      processCSV()
    } else {
      sendFile(req.file.path)
    }
  } else {
    // TODO: handle upload of invalid file type
  }
}
