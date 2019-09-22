import {RestClient} from 'typed-rest-client/RestClient';

import {ESIClient} from '..';

import {Character as ICharacter} from './character';

export class Character {
  esi: ESIClient;
  client: RestClient;

  constructor(esi: ESIClient) {
    this.esi = esi;
    this.client = this.esi.client;
  }

  async get(characterID: number) {
    const response =
        await this.client.get<ICharacter>(`characters/${characterID}`);
    if (response.statusCode !== 200 || response.result === null) {
      throw new Error(`Character Request Failed (CharacterID: ${characterID}`);
    }
    return response.result;
  }
}
