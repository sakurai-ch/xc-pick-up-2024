export type FetchedPlayer = {
  comp_id: number,
  direction: string,
  distance: number,
  driver: string,
  glider_type: string
  id: number,
  latitude: number,
  longitude: number,
  map: string,
  name: string,
  no: number,
  state: string,
}

export type Player = {
  no: number | undefined,
  trackerNo: number | undefined,
  playerName: string | undefined,
  gliderClass: string | undefined,
  pickUpState: string | undefined,
  position: string | undefined,
  mapUrl: string | undefined,
  driverName: string | undefined,
} | null | undefined


export type PlayerPosition = {
  playerId: number,
  playerName : string,
  position : {
    lat: number,
    lng: number,
  }
}