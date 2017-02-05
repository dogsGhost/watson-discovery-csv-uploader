const fs = require('fs')

const DiscoveryV1 = require('watson-developer-cloud/discovery/v1')
const rmdir = require('rimraf')

const title = 'CSV Uploader for Watson Discovery Service'

module.exports = (req, res, next) => {
  const b = req.body
  const file = fs.createReadStream(req.file.path)
  // connect to discovery endpoint
  const discovery = new DiscoveryV1({
    username: b.username,
    password: b.password,
    version_date: DiscoveryV1.VERSION_DATE_2016_12_15
  })

  discovery.addDocument({
    collection_id: b.collection_id,
    environment_id: b.environment_id,
    file,
  }, (err, response) => {
console.log(err)
console.log(response)
    // delete the uploaded file after it's been added
    if (!err) rmdir('files/*')
    // re-render homepage with errror or success message
    res.render('index', { title, err, response })
  })
}
