interface PostUniverseIDsInnerResponse {
  id: number;
  name: string;
}

export interface PostUniverseIDsResponse {
  characters?: PostUniverseIDsInnerResponse[];
  alliances?: PostUniverseIDsInnerResponse[];
  corporations?: PostUniverseIDsInnerResponse[];
  systems?: PostUniverseIDsInnerResponse[];
}
