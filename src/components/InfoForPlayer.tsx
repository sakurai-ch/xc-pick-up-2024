import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FetchedPlayer, Player, PlayerPosition } from '../types/Player'
import PlayersStateTable from './PlayersStateTable'
import { Button, Container, Grid } from '@mui/material'

function InfoForPlayer() {
  const [players, setPlayers] = useState<Player[]>()

  // 選手データ取得
  const fetchPlayers = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/players").then((response) => {
      let players: Player[] = []
      let playerPositions: PlayerPosition[] = []
      response.data.data.map((fetchedPlayer: FetchedPlayer) => {
          players.push({
            no : fetchedPlayer.no,
            trackerNo: fetchedPlayer.comp_id,
            playerName: fetchedPlayer.name,
            gliderClass: fetchedPlayer.glider_type,
            pickUpState: fetchedPlayer.state,
            position: fetchedPlayer.direction + fetchedPlayer.distance,
            mapUrl: fetchedPlayer.map,
            driverName: fetchedPlayer.driver,
          })
          playerPositions.push({
            playerId: fetchedPlayer.id,
            playerName: fetchedPlayer.name,
            position: {
              lat: Number(fetchedPlayer.latitude),
              lng: Number(fetchedPlayer.longitude),
            }
          })
      })
      setPlayers(players)
    })
  }

  // データ取得
  useEffect(() => {
    fetchPlayers()
  }, [])
  
  return (
    <Container disableGutters maxWidth="xl">
      <Grid justifyContent="end" container>
        {/* 更新ボタン */}
        <Grid item>
          <Button
            variant="contained" 
            size="small"
            onClick={fetchPlayers}
          >
              更新
          </Button>
        </Grid>
      </Grid>
    
      <br />
      <PlayersStateTable 
        role="player"
        players={players ? players : []}
        selectFunc={""}
      ></PlayersStateTable>
    </Container>
  )
}

export default InfoForPlayer