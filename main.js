const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const fs = require('fs-extra')
const got = require('got')

const castArray = v => (Array.isArray(v) ? v : v == null ? [] : [v])

const certsDir =
  '/data/caddy/certificates/acme-v02.api.letsencrypt.org-directory'

fs.ensureDirSync(certsDir)

/** @type {Record<string, string | string[]>} */
let notifyUrls = {}

try {
  Object.assign(notifyUrls, JSON.parse(process.env.NOTIFY_URL))
} catch (err) {
  Object.assign(notifyUrls, {
    '*': process.env.NOTIFY_URL,
  })
}

/** @type {Set<string>} */
const changeDomains = new Set()

const notify = debounce(async () => {
  const domains = [...changeDomains.values()]
  changeDomains.clear()
  for (const domain of domains) {
    const domainNotifyUrls = castArray(notifyUrls['*']).concat(
      castArray(notifyUrls[domain]),
    )
    for (const notifyUrl of domainNotifyUrls) {
      const domainFileName = domain.replace(/\*/g, 'wildcard_')
      const crt = await fs.readFile(
        `${certsDir}/${domainFileName}/${domainFileName}.crt`,
        'utf8',
      )
      const key = await fs.readFile(
        `${certsDir}/${domainFileName}/${domainFileName}.key`,
        'utf8',
      )
      try {
        await got.post(notifyUrl, {
          json: {
            domain: domain,
            crt: crt,
            key: key,
          },
          timeout: 10000,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}, 5000)

chokidar
  .watch(certsDir, {
    disableGlobbing: true,
  })
  .on('all', (event, path) => {
    if (event === 'add' || event === 'change') {
      const segments = path.split('/')
      changeDomains.add(
        segments[segments.length - 2].replace(/wildcard_/g, '*'),
      )
      notify()
    }
  })
