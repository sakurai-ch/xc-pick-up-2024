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
    axios.post(`${process.env.REACT_APP_API}` + "/driver", {
      name: editedDriver!.driverName,
      capacity: editedDriver?.capacity,
    }).then((response) => {
      if(response){
        props.closeFunc()
      }
    })
  }

  const putEditDriver = () => {
    axios.put(`${process.env.REACT_APP_API}` + "/driver", {
      id: editedDriver?.no,
      name: editedDriver!.driverName,
      capacity: editedDriver?.capacity,
    }).then((response) => {
      if(response){
        props.closeFunc()
      }
    })
  }

  const deleteEditDriver = () => {
    if( !window.confirm('このドライバーを削除しますか？') ) {
      return
    }
    axios.delete(`${process.env.REACT_APP_API}` + "/driver", { 
      params:{ 
        id: editedDriver?.no
      }
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
            id="capacity"
            label="定員（半角数値のみ入力可）"
            fullWidth
            variant="standard"
            value={editedDriver ? editedDriver.capacity : null}
            onChange={changeDriverCapacity}
          ></TextField>
        </DialogContent>
          {
          editedDriver?.no
          ?
            <DialogActions sx={{justifyContent: 'space-between', mb: 1}}>
              <div>
                <Button 
                  onClick={deleteEditDriver} 
                  sx={{color: "black", background: "lightgray", ml: 2}}
                >ドライバー削除</Button>
              </div>
              <div>
                <Button onClick={props.closeFunc}>キャンセル</Button>
                <Button onClick={putEditDriver} sx={{ml: 1}}>決定</Button>
              </div>
            </DialogActions>
            :
            <DialogActions sx={{mb: 1}}>
              <Button onClick={props.closeFunc}>キャンセル</Button>
              <Button onClick={postEditDriver}>決定</Button>
            </DialogActions>
          }
      </Dialog>
    </>
  )
}

export default DriverEditDialog