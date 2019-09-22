import {RestClient} from 'typed-rest-client/RestClient';

import {ESIClient} from '..';

import {Corporation as ICorporation} from './corporation';

export class Corporation {
  esi: ESIClient;
  client: RestClient;

  constructor(esi: ESIClient) {
    this.esi = esi;
    this.client = this.esi.client;
  }

  async get(corpID: number) {
    const response =
        await this.client.get<ICorporation>(`corporations/${corpID}`);
    if (response.statusCode !== 200 || response.result === null) {
      throw new Error(`Corporation Request Failed (CorpID: ${corpID}`);
    }
    return response.result;
  }
}
