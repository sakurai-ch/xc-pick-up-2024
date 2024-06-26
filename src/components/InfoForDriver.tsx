import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FetchedPlayer, Player, PlayerPosition } from '../types/Player'
import { Driver, FetchedDriver } from '../types/Driver'
import PlayersStateTable from './PlayersStateTable'
import PlayersPositionMap from './PlayersPositionMap'
import PlayerEditDialog from './PlayerEditDialog'
import { Button, CircularProgress, Container, Grid } from '@mui/material'

type params = {
  id: string
}

function InfoForDriver() {
  const params = useParams<params>()
  const id = params.id
  let curtDriver: Driver

  const [driver, setDriver] = useState<Driver>()
  const [players, setPlayers] = useState<Player[]>()
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>()
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [editedPlayer, setEditedPlayer] = useState<Player>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // 編集ダイアログを開く
  const openEditPlayerDialog = (editedPlayer:Player) => {
    setEditedPlayer(editedPlayer)
    setIsOpenDialog(true)
  }

  // 編集ダイアログを閉じる
  const closeEditPlayerDialog = () => {
    setIsOpenDialog(false)
    setEditedPlayer(null)
    fetchData()
  }

  // ドライバーデータ取得
  const fetchDrivers = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/drivers").then((response) => {
      response.data.data.map((fetchedDriver: FetchedDriver) => {
        if(fetchedDriver.id==Number(id)){
          setDriver({
            no : fetchedDriver.id,
            trackerNo: 100,
            driverName: fetchedDriver.name,
            capacity: fetchedDriver.capacity,
          })
          curtDriver = {
            no : fetchedDriver.id,
            trackerNo: 100,
            driverName: fetchedDriver.name,
            capacity: fetchedDriver.capacity,
          }
        }
      })
    })
  }

  // 選手データ取得
  const fetchPlayers = async() => {
    setIsLoading(true)
    let players: Player[] = []
    let playerPositions: PlayerPosition[] = []
    await axios.get(`${process.env.REACT_APP_API}` + "/players").then((response) => {
      response.data.data.map((fetchedPlayer: FetchedPlayer) => {
        if(fetchedPlayer?.driver==curtDriver?.driverName && fetchedPlayer?.state!="未"){
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
        }
      })
    })
    setPlayers(players)
    setPlayerPositions(playerPositions)
    setIsLoading(false)
  }

  // データ取得
  const fetchData = () => {
    fetchDrivers()
    fetchPlayers()
  }

  // 更新
  useEffect(() => {
    fetchData()
  }, [])
  
  return (
    <Container disableGutters maxWidth="xl">
      <Grid justifyContent="space-between" container>
        {/* ホームボタン */}
        <Grid item>
          <Link 
            to="/"
            style={{textDecoration: "none"}}
          >
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                bgcolor: 'tan', 
                color: 'black', 
                '&:hover':{backgroundColor: 'tan'},
              }}
            >
                戻る
            </Button>
          </Link>
        </Grid>

        {/* 更新ボタン */}
        <Grid item>
          <Button 
            variant="contained" 
            size="small"
            onClick={fetchData}
            sx={{ 
              bgcolor: 'orangered', 
              color: 'white', 
              '&:hover':{backgroundColor: 'orangered'},
            }}
          >
              更新
          </Button>
        </Grid>
      </Grid>


      <Grid container spacing={4}>
        <Grid item xs={12}>
          {/* ドライバー情報 */}
          <p>■{driver ? driver.driverName : ""}</p>

          {/* 選手データ */}
          <PlayersStateTable 
            role="driver"
            players={players ? players : []}
            selectFunc={openEditPlayerDialog}
          ></PlayersStateTable>
        </Grid>

        <Grid item xs={12}>
          {/* マップ */}
          <PlayersPositionMap
            positions={playerPositions ? playerPositions : []}
          ></PlayersPositionMap>
        </Grid>

        {/* 選手データ編集ダイアログ */}
        <PlayerEditDialog 
          role="driver"
          isOpen={isOpenDialog} 
          selectedPlayerId={editedPlayer?.id}
          selectabledrivers={[driver!]}
          closeFunc={closeEditPlayerDialog}
        ></PlayerEditDialog>
      </Grid>

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
    </Container>
  )
}

export default InfoForDriver