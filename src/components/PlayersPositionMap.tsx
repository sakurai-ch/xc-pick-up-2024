import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'
import { PlayerPosition } from '../types/Player';

const containerStyle = {
  width: "100%",
  height: "400px",
}

const defaultMapCenter: PlayerPosition = {
  playerName: "hanggliderTO",
  playerId: -1,
  position: {
    lat: 36.276837, 
    lng: 140.145816,
  }
}

function PlayersPositionMap(props: {positions: PlayerPosition[]}) {
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>()
  const [mapCenter, setMapCenter] = useState<PlayerPosition>()
  const [mapSize, setMapSize] = useState<number>()
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? ""
  })
  
  const setMapOption = () => {
    let maxLat: number | null = null
    let minLat: number | null = null
    let maxLng: number | null = null
    let minLng: number | null = null

    for (const playerPosition of (playerPositions ?? [])) {
      // max-min
      if( maxLat == null || playerPosition.position.lat > maxLat ){
        maxLat = playerPosition.position.lat
      }
      if( minLat == null || playerPosition.position.lat < minLat ){
        minLat = playerPosition.position.lat
      }
      if( maxLng == null || playerPosition.position.lng > maxLng ){
        maxLng = playerPosition.position.lng
      }
      if( minLng == null || playerPosition.position.lng < minLng ){
        minLng = playerPosition.position.lng
      }
    }

    if( !maxLat || !minLat || !maxLng || !minLng ){
      setMapCenter(defaultMapCenter)
      setMapSize(11)
    } else {
      // map center
      setMapCenter({
        playerName: "mapCenter",
        playerId: -1,
        position: {
          lat: ( maxLat + minLat ) / 2,
          lng: ( maxLng + minLng ) / 2,
        }
      })
      // map size
      const len =  Math.max( ( maxLat - minLat ) * 111 , 16 ) 
      setMapSize(15 - Math.log2(len))
    }
  }

  useEffect(() => {
    setPlayerPositions(props.positions)
    setMapOption()
  }, [props])

  return (
    <>
      {
        isLoaded
        ?  
        (
          <GoogleMap 
            center={mapCenter?.position} 
            zoom={mapSize}
            mapContainerStyle={containerStyle}
          >
            {
              playerPositions
              ?
              playerPositions.map(marker => {
                return (
                  <MarkerF 
                    position={marker.position}
                    label={marker.playerName}
                    key={marker.playerId}
                  />
                )
              })
              :
              ""
            }
          </GoogleMap>
        )
        :
        <></>
      }
    </>
  )
}

export default PlayersPositionMap