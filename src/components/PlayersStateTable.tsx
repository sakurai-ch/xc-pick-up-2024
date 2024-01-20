import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Player } from '../types/Player';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import EditIcon from '@mui/icons-material/Edit';
import { Role } from '../types/Roles';

function PlayersStateTable(props: {
  role: Role,
  players: Player[], 
  selectFunc: any,
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table 
          size="small" 
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">トラッカー</TableCell>
              <TableCell align="center">名前</TableCell>
              <TableCell align="center">クラス</TableCell>
              <TableCell align="center">状態</TableCell>
              <TableCell align="center">距離</TableCell>
              <TableCell align="center">マップ</TableCell>
              <TableCell align="center">
                {
                  props.role!="player"
                  ?
                  ""
                  :
                  "ドライバー"
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
                  <TableCell align="center" component="th" scope="row">
                    {player!.no}
                  </TableCell>
                  <TableCell align="center">{player!.trackerNo}</TableCell>
                  <TableCell align="center">{player!.playerName}</TableCell>
                  <TableCell align="center">{player!.gliderClass}</TableCell>
                  <TableCell align="center">
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
                  <TableCell align="center">
                    {player!.position}
                  </TableCell>
                  <TableCell align="center">
                    {
                      player!.mapUrl
                      ?
                      (
                        <a 
                          href={player!.mapUrl} 
                          target="_blank"
                          style={{color:"gray"}}
                        >
                          <FmdGoodIcon></FmdGoodIcon>
                        </a>
                      )
                      :
                      ""
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                      props.role!="player"
                      ?
                      (
                        <EditIcon 
                          onClick={() => props.selectFunc(player)}
                          style={{cursor:"pointer", color:"gray"}}
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