import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Grid, Input, TextField } from '@mui/material'
import axios from 'axios'
import { Competition } from '../types/Competition'
import { Link } from 'react-router-dom'

function Adminisrtator() {
  // 大会情報
  const [competition, setCompetition] = useState<Competition>({
    name: "",
    groupId: "",
    token: "",
  })

  const setCompetitionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompetition(competition => ({
      ...competition!, 
      name: (event.target as HTMLInputElement).value
    }))
  }

  const setCompetitionGroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompetition(competition => ({
      ...competition!, 
      groupId: (event.target as HTMLInputElement).value
    }))
  }

  const setCompetitionToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompetition(competition => ({
      ...competition!, 
      token: (event.target as HTMLInputElement).value
    }))
  }

  const postCompetition = () => {
    axios.post(`${process.env.REACT_APP_API}` + "/competition", {
      name: competition!.name,
      groupId: Number(competition!.groupId),
      token: competition!.token,
    }).then((response) => {
      if(response){
        console.log(response.data.data)
        setCompetition(() => ({
          name: "", 
          groupId: "",
          token: "",
        }))
      }
    })
  }

  // useEffect(() => {
  //   setEditedDriver(props.selectedDriver!)
  // }, [props.isOpen])

  return (
    <>
      <Container disableGutters maxWidth="xl">
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
                mb: 4,
              }}
            >
                戻る
            </Button>
          </Link>
        </Grid>
      </Container>

      <Container disableGutters maxWidth="xs">
        {/* 大会情報 */}
        <Grid item>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            大会情報
          </Box>

          {/* 大会名 */}
          <TextField
            margin="normal"
            sx={{mt: 0}}
            id="competitionName"
            label="大会名"
            fullWidth
            variant="standard"
            value={competition ? competition.name : ""}
            onChange={setCompetitionName}
          ></TextField>

          {/* グループID */}
          <TextField
            margin="normal"
            id="competitionGroupId"
            label="グループID（半角数値）"
            fullWidth
            variant="standard"
            value={competition ? competition.groupId : ""}
            onChange={setCompetitionGroupId}
          ></TextField>

          {/* トークン */}
          <TextField
            margin="normal"
            id="competitionToken"
            label="トークン"
            fullWidth
            variant="standard"
            value={competition ? competition.token : null}
            onChange={setCompetitionToken}
          ></TextField>
          
          {/* 登録ボタン */}
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
            <Button 
              onClick={postCompetition}
              disabled={!(competition.name && Number(competition.groupId) && competition.token)}
            >
              大会情報登録
            </Button>
          </Box>
        </Grid>
      </Container>
    </>
  )
}

export default Adminisrtator