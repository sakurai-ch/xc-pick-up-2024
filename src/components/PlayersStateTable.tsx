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
              <TableCell align="center" padding="none">T-No</TableCell>
              <TableCell align="center" padding="none">名前</TableCell>
              <TableCell align="center" padding="none">クラス</TableCell>
              <TableCell align="center" padding="none">状態</TableCell>
              <TableCell align="center" padding="none">距離</TableCell>
              <TableCell align="center" padding="none">マップ</TableCell>
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
                  <TableCell align="center" padding="none">{player!.trackerNo}</TableCell>
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
                        <a 
                          href={player!.mapUrl} 
                          target="_blank"
                          style={{color:"gray"}}
                        >
                          <FmdGoodIcon fontSize="small"></FmdGoodIcon>
                        </a>
                      )
                      :
                      ""
                    }
                  </TableCell>
                  <TableCell align="center" padding="none">
                    {
                      props.role!="player"
                      ?
                      (
                        <EditIcon 
                          onClick={() => props.selectFunc(player)}
                          style={{cursor:"pointer", color:"gray"}}
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