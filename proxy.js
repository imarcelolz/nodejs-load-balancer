const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  ws: false
})

proxy.on('open', function (proxySocket) {
  console.log('Client opened');
  // proxySocket.on('data', hybiParseAndLogMessage);
})

proxy.on('close', function (res, socket, head) {
  console.log('Client disconnected');
});

const proxyTargets = [
  { url: 'http://web1', connections: 0 },
  { url: 'http://web2', connections: 0 },
  { url: 'http://web3', connections: 0 },
  { url: 'http://web4', connections: 0 },
  { url: 'http://web5', connections: 0 },
]
let currentTarget = 0

const sessions = {}

function targetBySession(req) {
  const splitted = req.url.split('/')
  const sessionId = splitted[splitted.length - 1]

  console.debug('Sessions:', sessions, 'proxyTargets:', proxyTargets)

  let existingSession = sessions[sessionId]
  if (existingSession) {
    return existingSession
  }

  const result = proxyTargets[currentTarget]
  sessions[sessionId] = result.url
  result.connections += 1

  currentTarget += 1
  if (currentTarget === proxyTargets.length) {
    currentTarget = 0
  }

  return result.url
}

const server = http.createServer(function(req, res) {
  const target = targetBySession(req)
  console.debug('Target', target)

  proxy.web(req, res, { target })
})

console.log("listening on port 80")
server.listen(80);
