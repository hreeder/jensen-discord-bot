import * as rm from 'typed-rest-client/RestClient';

import {Alliance} from './alliance';
import {Character} from './character';
import {Corporation} from './corporation';
import {Universe} from './universe';

export class ESIClient {
  userAgent = 'jensen-discord-bot (IG: Sklullus Dromulus, GH: hreeder)';
  baseURL = 'https://esi.evetech.net/latest/';
  client: rm.RestClient;

  alliance: Alliance;
  character: Character;
  corporation: Corporation;
  universe: Universe;

  constructor() {
    this.client = new rm.RestClient(this.userAgent, this.baseURL);

    this.alliance = new Alliance(this);
    this.character = new Character(this);
    this.corporation = new Corporation(this);
    this.universe = new Universe(this);
  }
}
