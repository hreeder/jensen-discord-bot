import {RestClient} from 'typed-rest-client/RestClient';

import {ESIClient} from '..';

import {Alliance as IAlliance} from './alliance';

export class Alliance {
  esi: ESIClient;
  client: RestClient;

  constructor(esi: ESIClient) {
    this.esi = esi;
    this.client = this.esi.client;
  }

  async get(allianceID: number) {
    const response =
        await this.client.get<IAlliance>(`alliances/${allianceID}`);
    if (response.statusCode !== 200 || response.result === null) {
      throw new Error(`Alliance Request Failed (allianceID: ${allianceID}`);
    }
    return response.result;
  }
}