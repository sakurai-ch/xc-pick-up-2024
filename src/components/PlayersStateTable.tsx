import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Player } from '../types/Player';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import EditIcon from '@mui/icons-material/Edit';
import { Role } from '../types/Roles';
import axios from 'axios';

function PlayersStateTable(props: {
  role: Role,
  players: Player[], 
  selectFunc: any,
}) {
  // 現在地取得
  const getCurMap = (id:Number|undefined) => {
    axios.get(`${process.env.REACT_APP_API}` + "/curMap?compId=" + id).then((response) => {
      window.open(response.data, '_blank');
    })
  }

  return (
    <>
      <TableContainer 
        component={Paper} 
        sx={{bgcolor:"transparent"}}
      >
        <Table 
          size="small" 
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" padding="none">No</TableCell>
              {/* <TableCell align="center" padding="none">T-No</TableCell> */}
              <TableCell align="center" padding="none">名前</TableCell>
              <TableCell align="center" padding="none">クラス</TableCell>
              <TableCell align="center" padding="none">状態</TableCell>
              <TableCell align="center" padding="none">距離</TableCell>
              <TableCell align="center" padding="none">着地点</TableCell>
              {
                props.role!="player"
                ?
                (
                  <TableCell align="center" padding="none">
                    現在地
                  </TableCell>
                )
                :
                null
              }
              <TableCell align="center" padding="none">
                {
                  props.role!="player"
                  ?
                  ""
                  :
                  "担当"
                }
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              props.players.map((player) => (
                <TableRow
                  key={player!.no}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center" padding="none">{player!.no}</TableCell>
                  {/* <TableCell align="center" padding="none">{player!.trackerNo}</TableCell> */}
                  <TableCell align="center" padding="none">{player!.playerName!.replace(/\s+/g, "")}</TableCell>
                  <TableCell align="center" padding="none">{player!.gliderClass}</TableCell>
                  <TableCell align="center" padding="none">
                    {
                      player!.pickUpState=="未"
                      ?
                      <span style={{color:'red'}}>
                        {player!.pickUpState}
                      </span>
                      :
                      <span>
                        {player!.pickUpState}
                      </span>
                    }
                  </TableCell>
                  <TableCell align="center" padding="none">
                    {player!.position ? player!.position : ""}
                  </TableCell>
                  <TableCell align="center" padding="none">
                    {
                      player!.mapUrl
                      ?
                      (
                        props.role!="driver"
                        ?
                        (
                          <a 
                            href={player!.mapUrl} 
                            target="_blank"
                            style={{color:"tomato"}}
                          >
                            <FmdGoodIcon fontSize="small"></FmdGoodIcon>
                          </a>
                        )
                        :
                        (
                          <a 
                            href={player!.mapUrl} 
                            target="_blank"
                            style={{color:"tomato"}}
                          >
                            <FmdGoodIcon fontSize="large"></FmdGoodIcon>
                          </a>
                        )
                      )
                      :
                      ""
                    }
                  </TableCell>
                  {
                    props.role!="player"
                    ?
                    (
                      player!.mapUrl
                      ?
                      <TableCell align="center" padding="none">
                        <FmdGoodIcon 
                          onClick={() => getCurMap(player!.id)}
                          style={{cursor:"pointer", color:"orange"}}
                          fontSize="small"
                        ></FmdGoodIcon>
                      </TableCell>
                      :
                      <TableCell align="center" padding="none"></TableCell>
                    )
                    :
                    null
                  }
                  <TableCell align="center" padding="none">
                    {
                      props.role!="player"
                      ?
                      (
                        <EditIcon 
                          onClick={() => props.selectFunc(player)}
                          style={{cursor:"pointer", color:"cornflowerblue"}}
                          fontSize="small"
                        ></EditIcon>
                      )
                      :
                      (
                        <span>
                          {player?.driverName?.slice(0,2)}
                        </span>
                      )
                    }
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default PlayersStateTable