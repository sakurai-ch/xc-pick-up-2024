import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FetchedPlayer, Player, PlayerPosition } from '../types/Player'
import PlayersStateTable from './PlayersStateTable'
import { Button, CircularProgress, Container, Dialog, Grid, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function InfoForPlayer() {
  const [players, setPlayers] = useState<Player[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 選手データ取得
  const fetchPlayers = () => {
    setIsLoading(true)
    axios.get(`${process.env.REACT_APP_API}` + "/players").then((response) => {
      let players: Player[] = []
      let playerPositions: PlayerPosition[] = []
      response.data.data.map((fetchedPlayer: FetchedPlayer) => {
          players.push({
            id : fetchedPlayer.id,
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
      setIsLoading(false)
    })
  }

  // QRコード表示
  const [isShowQR, setIsShowQR] = React.useState(false);

  const openQR = () => {
    setIsShowQR(true)
  }

  const closeQR = () => {
    setIsShowQR(false)
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
            sx={{ 
              bgcolor: 'tan', 
              color: 'black', 
              '&:hover':{backgroundColor: 'tan'},
            }}
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

      {
        isLoading
        ?
        (
          <CircularProgress 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )
        :
        null
      }

      {/* QRコード表示 */}
      <Button 
        variant="contained" 
        size="small"
        sx={{ 
          bgcolor: 'wheat', 
          color: 'black', 
          '&:hover':{backgroundColor: 'wheat'},
          mb: 4,
          mt: 4,
        }}
        onClick={openQR}
      >
        QRコード表示
      </Button>

      <Dialog
        fullScreen
        open={isShowQR}
        onClose={closeQR}
      >
        <IconButton
          onClick={closeQR}
          sx={{mt:2}}
          disableRipple={true}
        >
          <CloseIcon />
        </IconButton>
        <Grid 
          container 
          height="90%" 
          alignItems="center" 
          justifyContent="center"
        >
          <Grid item>
            <img 
              src='QR_player_url.png' 
              width="315" 
              height="315" 
            />
          </Grid>
        </Grid>
      </Dialog>
    </Container>
  )
}

export default InfoForPlayer