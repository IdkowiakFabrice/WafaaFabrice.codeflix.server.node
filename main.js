const express = require('./my-express')
const app = express()
const url = require('url')
const http = require('http')

const args = process.argv.slice(2)
const port = parseInt(args[0])

const server = http.createServer(function(request, response) {
  const { pathname, query } = url.parse(request.url, true)
  if(pathname == "/render") {
    app.render('home', { name: 'home' }, (err, html) => {
      if(err == undefined) {
        response.write(html)
      } else {
        response.write(err)
      }
    })
  } else {
    switch (request.method) {
      case 'GET':
          response.write(app.get(query, pathname))
        break;
      case 'POST':
          response.write(app.post(request, pathname))
        break;
      case 'PUT':
          response.write(app.put(request, pathname))
        break;
      case 'DELETE':
          response.write(app.del(request, pathname))
        break;
      default:
          response.write('Nothing !')
        break;
    }
  }
  response.end()
})
app.listen(server, port)
console.log(`Server is listening on port ${port}`)