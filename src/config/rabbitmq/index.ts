import { Env } from 'common-panel';

import { ExchangeEnum } from './../../modules/rabbit-mq/enums';

const url = Env.getString('RABBIT_URL');
const user = Env.getString('RABBIT_USER');
const pass = Env.getString('RABBIT_PASS');
const port = Env.getString('RABBIT_PORT');
const host = Env.getString('RABBIT_HOST');

const uri = `${url}${user}:${pass}@${host}:${port}`;
export const rabbitConfig = {
  uri,
  panelExchanges: [
    {
      name: ExchangeEnum.USER_EXCHANGE,
      type: 'topic',
    },
  ],
  Options: { wait: false, reject: true, timeout: 5000 },
};
