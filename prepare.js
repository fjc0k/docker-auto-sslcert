const fs = require('fs')

const domains = (process.env.DOMAIN_LIST || '')
  .split(',')
  .map(domain => domain.trim())
  .join(', ')
const Caddyfile = `${domains} {\n  import dnspod\n  respond "success"\n}`

fs.writeFileSync('/etc/caddy/Caddyfile', Caddyfile, { encoding: 'utf-8' })
