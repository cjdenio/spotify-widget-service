
  const proxyquire = require("proxyquire")
  const fs = require('fs')
  const path = require('path')
  const files = {}
  const fileOverrides = {"file:///Users/calebdenio/spotify-widget-service/api/src/functions/graphql.ts":"import {\n  createGraphQLHandler,\n  makeMergedSchema,\n  makeServices,\n} from '@redwoodjs/api'\n\nimport schemas from 'src/graphql/**/*.{js,ts}'\nimport { db } from 'src/lib/db'\nimport { logger } from 'src/lib/logger'\nimport services from 'src/services/**/*.{js,ts}'\n\nexport const handler = createGraphQLHandler({\n  loggerConfig: { logger, options: {} },\n  schema: makeMergedSchema({\n    schemas,\n    services: makeServices({ services }),\n  }),\n  onException: () => {\n    // Disconnect from your database with an unhandled exception.\n    db.$disconnect()\n  },\n})\n"}
  const FILE_SCHEME = 'file://'

  function URL_file(f) {
    if (f.startsWith(FILE_SCHEME))
      f = f.substr(FILE_SCHEME.length)
    return new URL(FILE_SCHEME + path.normalize(f)).href
  }

  proxyquire('@redwoodjs/cli/dist', {
    fs: {
      mkdir() {},
      mkdirSync(...args) {},
      writeFile(a, b) {
        files[URL_file(a)] = b
      },
      writeFileSync(a, b) {
        files[URL_file(a)] = b
      },
      readFileSync(...args) {
        const f = URL_file(args[0])
        if (fileOverrides[f]) return fileOverrides[f]
        return fs.readFileSync.apply(fs, args)
      },
      '@global': true,
    },
  })

  process.on('exit', () => {
    console.log("---------===----===--------")
    console.log(JSON.stringify(files, null, 2))
  })
  