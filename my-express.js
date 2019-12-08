const http = require('http')
const url = require('url')
const fs = require('fs')

const Local_DataBase = "students.json";

function express() {


  //----------GET
  const get = function () {
    if (fs.existsSync(`./${Local_DataBase}`)) {
      var json = fs.readFileSync(`./${Local_DataBase}`)
      return (json)
    } else {
      return (`<h1> Nothing to GET ! </h1>`)
    }
  }


  //----------POST
  const post = function (req, pathname) {
    if (pathname === '/students') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString()
      });
      req.on('end', () => {
        const user = JSON.parse(body)
        if (!fs.existsSync(Local_DataBase)) {
          user.id = 1
          data = [user]
        } else {
          const json = require(`./${Local_DataBase}`)
          user.id = json.length + 1
          json.push(user)
          data = json
        }
        fs.writeFileSync(Local_DataBase, JSON.stringify(data, null, 4))
      });
    }
    return (`<h1> Post Work ! </h1>`)
  }


  //----------PUT
  const put = function (req, pathname) {
    let splitPathname = pathname.split('/')
    let putId = splitPathname[2]
    let matchPut = []
    let json = ""
    let data = ''
    req.on('data', chunk => {
      data += chunk.toString()
    })
    req.on('end', () => {
      let putData = JSON.parse(data)
      let putName = putData.name
      let putSchool = putData.school
      let isExist = false
      matchPut = putId.match(/(^[0-9]+$)/g)
      if (matchPut != null) {
        putId = parseInt(matchPut[0])
        if (fs.existsSync(Local_DataBase)) {
          json = require(`./${Local_DataBase}`)
          for (const k in json) {
            if (json[k].id == putId) {
              isExist = true
            }
          }
          if (isExist == true) {
            for (const key in json) {
              if (json[key].id == putId) {
                if (putName != undefined) {
                  json[key].name = putName
                }
                if (putSchool != undefined) {
                  json[key].school = putSchool
                }
                fs.writeFileSync(Local_DataBase, JSON.stringify(json, null, 4))
              }
            }
          }
        }
      }
    })
    return (`<h1> Put Work ! </h1>`)
  }


  //----------DELETE
  const del = function () {
    if (fs.existsSync(Local_DataBase)) {
      fs.writeFileSync(Local_DataBase, JSON.stringify([], null, 4))
      return (`<h1>Delete Work ! </h1>`)
    } else {
      return (`<h1>Delete dont Work ! </h1>`)
    }
  }


  //----------LISTEN
  const listen = function (server, port) {
    server.listen(port)
  }


  //----------RENDER
 const render = function(file, callback, object) {
    let regex = /({{[\w]+}})/g;
    let regexTwo = /({{[\w]+[\W]+..........}})/gm;
    let filename = file + '.mustache'
    let content = ''
    let error = undefined
    object.weight = object.weight.toFixed(2)
    if (!fs.existsSync(filename)) {
      error = `The file ${filename} does not exist.`;
    } else {
      content = '' + fs.readFileSync(`./${filename}`)
      content = content.replace(regex, object.name)
      content = content.replace(regexTwo, object.weight)

    }

    callback(error, content)
  }

  return { get, post, put, listen, del, render }
}

module.exports = express