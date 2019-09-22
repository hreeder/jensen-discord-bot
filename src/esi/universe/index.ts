import {RestClient} from 'typed-rest-client/RestClient';

import {ESIClient} from '..';

import {PostUniverseIDsResponse} from './ids';

export class Universe {
  esi: ESIClient;
  client: RestClient;

  constructor(esi: ESIClient) {
    this.esi = esi;
    this.client = this.esi.client;
  }

  async IDs(names: string[]): Promise<PostUniverseIDsResponse> {
    const response = await this.client.create<PostUniverseIDsResponse>(
        'universe/ids', names);
    if (response.statusCode !== 200 || response.result === null) {
      throw new Error('Not Found');
    }
    return response.result;
  }
}
