import config from 'config';

import BittrexApp from './app';

const app = new BittrexApp(config);

app.run();
