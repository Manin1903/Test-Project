// server.js
const { createServer } = require('https')
const { parse }        = require('url')
const next             = require('next')
const fs               = require('fs')
const path             = require('path')

const dev  = process.env.NODE_ENV !== 'production'
const app  = next({ dev })
const handle = app.getRequestHandler()

// Load your certificates
const httpsOptions = {
  key : fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })
  .listen(8485, '0.0.0.0', err => {
    if (err) throw err
    console.log('> HTTPS server running at https://localhost:8485')
  })
})
