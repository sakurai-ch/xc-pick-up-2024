import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import { Player } from '../types/Player'
import { Driver } from '../types/Driver'
import { Role } from '../types/Roles'


function PlayerEditDialog(props:{
  role: Role,
  isOpen:boolean, 
  selectedPlayer:Player | undefined,
  selectabledrivers: Driver[] | undefined,
  editFunc: any,
  closeFunc: any,
}) {
  const [editedPlayer, setEditedPlayer] = useState<Player>(null)
  
  const changePickUpState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPlayer(player => ({
      ...player!, 
      pickUpState: (event.target as HTMLInputElement).value
    }))
  }
  
  const changeMapUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPlayer(player => ({
      ...player!, 
      mapUrl: (event.target as HTMLInputElement).value
    }))
  }
  
  const changeDriverName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPlayer(player => ({
      ...player!, 
      driverName: (event.target as HTMLInputElement).value
    }))
  }

  useEffect(() => {
    setEditedPlayer(props.selectedPlayer!)
  }, [props.isOpen])

  const putEditPlayer = () => {
    props.editFunc(editedPlayer)
  }

  return (
    <>
      <Dialog 
        open={props.isOpen}  
        onClose={props.closeFunc} 
        fullWidth
      >
        {/* 選手名 */}
        <DialogTitle>
          {editedPlayer ? ("No"+editedPlayer.no+" / Tracker"+editedPlayer.trackerNo) : ""}<br></br>
          {editedPlayer ? (editedPlayer.playerName) : ""}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={4}>
            {/* 状態 */}
            <Grid item xs={12} md={4}>
              <RadioGroup 
                value={editedPlayer ? editedPlayer.pickUpState : ""}
                onChange={changePickUpState}
              >
                {
                  props.role=="headquarters"
                  ?
                  (
                    <>
                      <FormControlLabel value="---" control={<Radio />} label="---" />
                      <FormControlLabel value="未" control={<Radio />} label="未" />
                    </>
                  )
                  :
                  <></>
                }
                <FormControlLabel value="配車" control={<Radio />} label="配車済" />
                <FormControlLabel value="済" control={<Radio />} label="回収済" />
              </RadioGroup>
            </Grid>

            {/* ドライバー */}
            {
              props.role=="headquarters"
              ?
              (
                <Grid item xs={12} md={8}>
                  <RadioGroup 
                    value={editedPlayer ? editedPlayer.driverName : ""}
                    onChange={changeDriverName}
                  >
                    <FormControlLabel 
                      value="---" 
                      control={<Radio />} 
                      label="---" 
                    />
                    {
                      props.selectabledrivers ?
                      props.selectabledrivers.map(driver => { 
                        return (
                          <FormControlLabel 
                            value={driver?.driverName} 
                            control={<Radio />} 
                            label={driver?.driverName} 
                            key={driver?.no}
                          />
                        )}) : ""
                    }
                  </RadioGroup>
                </Grid>
              )
              :
              <></>
            }
          </Grid>

          {/* マップURL */}
          {
            props.role=="headquarters"
            ?
            (
              <TextField
                margin="dense"
                id="map"
                label="GoogleマップURL"
                fullWidth
                variant="standard"
                value={editedPlayer ? editedPlayer.mapUrl : ""}
                onChange={changeMapUrl}
              ></TextField>
            )
            :
            <></>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeFunc}>キャンセル</Button>
          <Button onClick={putEditPlayer}>決定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PlayerEditDialog