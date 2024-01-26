import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Container, Grid, Stack } from '@mui/material';
import { FetchedPlayer, Player } from '../types/Player';
import { Driver, FetchedDriver } from '../types/Driver';
import PlayersStateTable from './PlayersStateTable'
import PlayerEditDialog from './PlayerEditDialog';
import { Link } from 'react-router-dom';
import DriverEditDialog from './DriverEditDialog';
import EditIcon from '@mui/icons-material/Edit';


function InfoForHeadquarters() {
  const [players, setPlayers] = useState<Player[]>()
  const [drivers, setDrivers] = useState<Driver[]>()
  const [driverNames, setDriverNames] = useState<string[]>()
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [editedPlayer, setEditedPlayer] = useState<Player>()
  const [isOpenDriverEditDialog, setIsOpenDriverEditDialog] = useState<boolean>(false)
  const [editedDriver, setEditedDriver] = useState<Driver>()

  // 編集ダイアログを開く
  const openEditPlayerDialog = (editedPlayer:Player) => {
    fetchPlayers()
    setEditedPlayer(editedPlayer)
    setIsOpenDialog(true)
  }

  // 編集ダイアログを閉じる
  const closeEditPlayerDialog = () => {
    setIsOpenDialog(false)
    setEditedPlayer(null)
    fetchPlayers()
  }

  // 選手編集データ送信
  const putEditPlayer = (editedPlayer: Player) => {
    axios.put(`${process.env.REACT_APP_API}` + "/players", {
      driver: editedPlayer!.driverName,
      id: editedPlayer!.no,
      map: editedPlayer!.mapUrl,
      order: null,
      state: editedPlayer!.pickUpState,
    }).then((response) => {
      if(response){
        closeEditPlayerDialog()
      }
    })
  }

  const openEditDriverDialog = (editedDriver:Driver) => {
    setEditedDriver(editedDriver)
    setIsOpenDriverEditDialog(true)
  }

  const closeEditDriverDialog = () => {
    setIsOpenDriverEditDialog(false)
    setEditedDriver(null)
    fetchDrivers()
  }

  // 選手データ取得
  const fetchPlayers = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/players").then((response) => {
      let players: Player[] = []
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
      })
      setPlayers(players)
    })
  }

  // ドライバーデータ取得
  const fetchDrivers = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/drivers").then((response) => {
      let drivers: Driver[] = []
      let driverNames: string[] = []
      response.data.data.map((fetchedDriver: FetchedDriver) => {
        drivers.push({
          no : fetchedDriver.id,
          trackerNo: 100,
          driverName: fetchedDriver.name,
          capacity: fetchedDriver.capacity,
        })
        driverNames.push(fetchedDriver.name)
      })
      setDrivers(drivers)
      setDriverNames(driverNames)
    })
  }

  // データ更新
  useEffect(() => {
    fetchPlayers()
    fetchDrivers()
  }, [])

  return (
    <Container disableGutters maxWidth="xl">
      <Grid justifyContent="space-between" container>
        {/* ホームボタン */}
        <Grid item>
          <Link to="/">
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


      <Grid container spacing={4}>
        {/* 配車前 */} 
        <Grid item xs={12} md={6}>
          <p>■未手配</p>
          <PlayersStateTable
            role="headquarters"
            players={
              players 
              ? 
              players.filter((player) => {
                return !( driverNames?.includes(player?.driverName!) )
              }) 
              : 
              []
            }
            selectFunc={openEditPlayerDialog}
          ></PlayersStateTable>
        </Grid>

        {/* 配車済み */}
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            {
              drivers 
              ? 
              drivers.map((driver) => {
                return(
                  <div key={driver?.no}>
                    <p>
                      <span>
                        ■{driver?.driverName}
                      </span>
                      <EditIcon
                        sx={{ml:2}}
                        onClick={() => openEditDriverDialog(driver)}
                        style={{cursor:"pointer", color:"gray"}}
                      ></EditIcon>
                    </p>
                    <PlayersStateTable 
                      role="headquarters"
                      players={
                        players 
                        ? 
                        players.filter((player) => player!.driverName==driver?.driverName) : []
                      }
                      selectFunc={openEditPlayerDialog}
                    ></PlayersStateTable>
                  </div>
                )
              }) 
              : 
              null
            }
          </Stack>

          <br />
          <Grid justifyContent="end" container>
            {/* ドライバー作成ボタン */}
            <Grid item>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => openEditDriverDialog(null)}
                sx={{ 
                  bgcolor: 'tan', 
                  color: 'black', 
                  '&:hover':{backgroundColor: 'tan'},
                }}
              >
                  ドライバー作成
              </Button>
            </Grid>
          </Grid>
          <br />
        </Grid>
      </Grid>


      {/* 選手データ編集ダイアログ */}
      <PlayerEditDialog 
        role="headquarters"
        isOpen={isOpenDialog} 
        selectedPlayer={editedPlayer}
        selectabledrivers={drivers}
        editFunc={putEditPlayer}
        closeFunc={closeEditPlayerDialog}
      ></PlayerEditDialog>

      {/* ドライバー編集ダイアログ */}
      <DriverEditDialog 
        isOpen={isOpenDriverEditDialog} 
        selectedDriver={editedDriver}
        closeFunc={closeEditDriverDialog}
      ></DriverEditDialog>
    </Container>
  )
}

export default InfoForHeadquarters