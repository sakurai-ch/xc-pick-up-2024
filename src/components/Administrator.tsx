import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Dialog, Grid, IconButton, TextField, MenuItem } from '@mui/material'
import axios from 'axios'
import { Competition, ReferencePoint } from '../types/Competition'
import { Link } from 'react-router-dom'
import { useCSVReader } from "react-papaparse"
import CloseIcon from '@mui/icons-material/Close'

function Adminisrtator() {
  // 大会情報登録
  const [competition, setCompetition] = useState<Competition>({
    name: "",
    groupId: "",
    token: "",
    referencePointId: "",
  })

  // 測定基準
  const [referencePoints, setReferencePoints] = useState<ReferencePoint[]>([])

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

  const setCompetitionReferencePointId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompetition(competition => ({
      ...competition!,
      referencePointId: (event.target as HTMLInputElement).value
    }))
  }

  const postCompetition = () => {
    axios.post(`${process.env.REACT_APP_API}` + "/competition", {
      name: competition!.name,
      groupId: Number(competition!.groupId),
      token: competition!.token,
      referencePointId: competition!.referencePointId,
    }).then((response) => {
      if(response){
        console.log(response.data.data)
        setCompetition(() => ({
          name: "", 
          groupId: "",
          token: "",
          referencePointId: "",
        }))
      }
    })
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  // 選手情報登録
  const { CSVReader } = useCSVReader();
  interface CsvRow {[key: string]: string | number | null;}
  const [jsonData, setJsonData] = useState<CsvRow[]>([]);
  const removeFileRef = useRef<HTMLInputElement>(null);

  const postPlayers = () => {
    axios.post(`${process.env.REACT_APP_API}` + "/players", 
      { players : jsonData }, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if(response){
        console.log(response.data.data)
        removeFileRef.current!.click()
      }
    })
  }

  // 選手位置情報リセット
  const resetPlaysersPositon = () => {
    if (!window.confirm("選手位置情報リセット")) {
      return;
    }
    axios.put(`${process.env.REACT_APP_API}` + "/playersPositon")
    .then((response) => {
      if(response){
        console.log(response.data.data)
      }
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


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}` + "/referencePoints")
      .then((response) => {
        setReferencePoints(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])


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
        {/* 大会情報登録 */}
        <Grid item>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            大会情報登録
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
            sx={{mt: 0}}
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
            sx={{mt: 0}}
            id="competitionToken"
            label="トークン"
            fullWidth
            variant="standard"
            value={competition ? competition.token : null}
            onChange={setCompetitionToken}
          ></TextField>

          {/* 測定基準点 */}
          <TextField
            margin="normal"
            sx={{mt: 0}}
            id="referencePoint"
            label="測定基準"
            fullWidth
            variant="standard"
            select
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { bgcolor: '#faf3e3' }
                }
              }
            }}
            value={competition?.referencePointId ?? ""}
            onChange={setCompetitionReferencePointId}
          >
            {referencePoints.map((rp) => (
              <MenuItem key={rp.id} value={String(rp.id)}>{rp.name}</MenuItem>
            ))}
          </TextField>
          
          {/* 登録ボタン */}
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
            <Button 
              onClick={postCompetition}
              disabled={!(competition.name && Number(competition.groupId) && competition.token)}
            >
              登録
            </Button>
          </Box>
        </Grid>
      </Container>

      {/* 選手情報登録 */}
      <Container disableGutters maxWidth="xs">
        <Grid item  sx={{mt: 4}}>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            選手情報登録
          </Box>

          {/* react-papaparse */}
          <CSVReader
            onUploadAccepted={(results: any) => {
              console.log(results.data)
              setJsonData(results.data)
            }}
            config={{
              encoding: "Shift-JIS",
              header: true,
              skipEmptyLines: true
            }}
            accept="text/csv"
          >
            {({
              getRootProps,
              acceptedFile,
              getRemoveFileProps,
            }: any) => (
              <>
                <Grid container spacing={2}>
                  {/* ファイル選択 */}
                  <Grid item xs={4}>
                    <Button 
                      type='button' 
                      {...getRootProps()} 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        bgcolor: 'wheat', 
                        color: 'black', 
                        '&:hover':{backgroundColor: 'wheat'},
                        mt: 2,
                      }}
                    >
                      CSVファイル選択
                    </Button>
                  </Grid>

                  {/* ファイル名     */}
                  <Grid item xs={8}>
                    <TextField
                      margin="normal"
                      sx={{ mt: 0, ml: 0 }}
                      id="csvFileName"
                      label=" "
                      fullWidth
                      variant="standard"
                      value={acceptedFile && acceptedFile.name || ""}
                    ></TextField>
                  </Grid>
                </Grid>

                {/* 選手情報登録 */}
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                  <Button 
                    onClick={postPlayers} 
                    disabled={jsonData.length === 0}
                  >
                    登録
                  </Button>
                  <input
                    hidden
                    ref={removeFileRef}
                    {...getRemoveFileProps()}
                  />
                </Box>
              </>
            )}
          </CSVReader>
        </Grid>
      </Container>


      {/* 選手位置情報リセット */}
      <Container disableGutters maxWidth="xs">
        <Grid item  sx={{mt: 4}}>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            選手位置情報リセット
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
            <Button onClick={resetPlaysersPositon} >
              リセット
            </Button>
          </Box>
        </Grid>
      </Container>

      {/* ドライバー情報登録 */}
      <Container disableGutters maxWidth="xs">
        <Grid item  sx={{mt: 4}}>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            ドライバー情報登録
          </Box>
          <span>※本部画面から登録</span><br/>

          <Link
            to="/headquarters"
            style={{textDecoration: "none"}}
          >
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                bgcolor: 'wheat', 
                color: 'black', 
                '&:hover':{backgroundColor: 'wheat'},
                mb: 4,
                mt: 2,
              }}
            >
                本部画面へ移動
            </Button>
          </Link>
        </Grid>
      </Container>

      {/* QRコード表示 */}
      <Container disableGutters maxWidth="xs">
        <Grid item  sx={{mt: 4}}>
          <Box sx={{fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
            選手用ページQRコード
          </Box>
          
          <Button 
            variant="contained" 
            size="small"
            sx={{ 
              bgcolor: 'wheat', 
              color: 'black', 
              '&:hover':{backgroundColor: 'wheat'},
              mb: 4,
              mt: 2,
            }}
            onClick={openQR}
          >
            表示
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
        </Grid>
      </Container>
    </>
  )
}

export default Adminisrtator