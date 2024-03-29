import React, { useEffect, useState } from 'react'
import { Driver } from '../types/Driver'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import axios from 'axios'

function DriverEditDialog(props:{
  isOpen:boolean, 
  selectedDriver:Driver | undefined,
  closeFunc: any,
}) {
  const [editedDriver, setEditedDriver] = useState<Driver>()

  const changeDriverName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDriver(driver => ({
      ...driver!, 
      driverName: (event.target as HTMLInputElement).value
    }))
  }

  const changeDriverCapacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDriver(driver => ({
      ...driver!, 
      capacity: Number((event.target as HTMLInputElement).value)
    }))
  }

  const postEditDriver = () => {
    axios.post(`${process.env.REACT_APP_API}` + "/drivers", {
      name: editedDriver!.driverName,
      capacity: editedDriver?.capacity,
    }).then((response) => {
      if(response){
        props.closeFunc()
      }
    })
  }

  const putEditDriver = () => {
    axios.put(`${process.env.REACT_APP_API}` + "/drivers", {
      id: editedDriver?.no,
      name: editedDriver!.driverName,
      capacity: editedDriver?.capacity,
    }).then((response) => {
      if(response){
        props.closeFunc()
      }
    })
  }

  useEffect(() => {
    setEditedDriver(props.selectedDriver!)
  }, [props.isOpen])

  return (
    <>
      <Dialog 
        open={props.isOpen}  
        onClose={props.closeFunc} 
        fullWidth
      >
        <DialogTitle>
          ドライバー編集
        </DialogTitle>

        <DialogContent>
          <p>
            ★選手画面には入力した名前の先頭2文字が表示されます<br />
            ★選手を配車した状態でドライバー名を変更しないこと
          </p>
          {/* 名前 */}
          <TextField
            margin="normal"
            id="ID"
            label="ID（編集不可）"
            fullWidth
            variant="standard"
            value={editedDriver ? editedDriver.no : ""}
            disabled
          ></TextField>

          {/* 名前 */}
          <TextField
            margin="normal"
            id="name"
            label="名前"
            fullWidth
            variant="standard"
            value={editedDriver ? editedDriver.driverName : ""}
            onChange={changeDriverName}
          ></TextField>

          {/* 定員 */}
          <TextField
            margin="normal"
            id="name"
            label="定員（数値のみ入力可）"
            fullWidth
            variant="standard"
            value={editedDriver ? editedDriver.capacity : null}
            onChange={changeDriverCapacity}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeFunc}>キャンセル</Button>
          {
            editedDriver?.no
            ?
            <Button onClick={putEditDriver}>決定</Button>
            :
            <Button onClick={postEditDriver}>決定</Button>
          }
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DriverEditDialog