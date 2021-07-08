import { Command, flags } from '@oclif/command';

import { createServer } from 'http';
import { URL } from 'url';

export default class MockServer extends Command {
  static description = 'Run a mock Celo Payments Protocol compatible server';

  static examples = [
    `$ payments mock-server
Mock server running on localhost:8080...
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [];

  async run() {
    const server = createServer((req, res) => {
      const url = new URL(req.url);
      const [part0, referenceId] = url.pathname.split('/');

      function abort() {
        res.writeHead(404);
        res.end();
      }

      if (part0 !== 'payments') {
        return abort();
      }

      if (!referenceId) {
        return abort();
      }

      if (req.method === 'GET') {
        if (url.pathname.endsWith('/confirmation')) {
          res.writeHead(204);
          res.end();
          return;
        }

        // TODO: handle
      }

      if (req.method === 'POST') {
        res.writeHead(204);
        res.end();
        return;
      }

      return abort();
    });

    const port = 4000;
    server.listen(port);

    this.log('Mock server listening on port', port);
  }
}
