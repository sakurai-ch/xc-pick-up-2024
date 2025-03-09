import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Container, Stack } from '@mui/material'
import axios from 'axios'
import { FetchedDriver } from '../types/Driver'


function Home() {
  const [fecthedDrivers, setFetchedDrivers] = useState<FetchedDriver[]>()

  // ドライバーデータ取得
  const FetchDrivers = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/drivers").then((response) => {
      setFetchedDrivers(response.data.data)
    })
  }

  // データ更新
  useEffect(() => {
    FetchDrivers()
  }, [])

  return (
    <Container disableGutters maxWidth="xs">
      <Stack 
        spacing={2}
        sx={{ py: 4 }} 
      >
        {/* 本部 */}
        <Link 
          to="/headquarters" 
          style={{textDecoration: "none"}}
        >
          <Card 
            sx={{ textAlign: 'center', py: 4, backgroundColor: "#FFCCFF" }} 
            variant="outlined"
          >
            本部
          </Card>
        </Link>
        
        {/* ドライバー用 */}
        {
          fecthedDrivers
          ?
          fecthedDrivers.map((driver) => {
            return(
              <Link 
                to={"/driver/" + driver.id}
                style={{textDecoration: "none"}}
                key={driver.id}
              >
                <Card
                  sx={{ textAlign: 'center', py: 4, backgroundColor: "#DDDDDD" }} 
                  variant="outlined"
                >
                  {driver.name}
                </Card>
              </Link>
            )
          })
          :
          <></>
        }

        {/* 選手用 */}
        <Link 
          to="/player" 
          style={{textDecoration: "none"}}
        >
          <Card 
            sx={{ textAlign: 'center', py: 4, backgroundColor: "#CCFFFF" }} 
            variant="outlined"
          >
            選手用
          </Card>
        </Link>

        {/* 管理用 */}
        <Link 
          to="/admin" 
          style={{textDecoration: "none"}}
        >
          <Card 
            sx={{ textAlign: 'center', py: 1,  ml: 'auto', width: 1/4, backgroundColor: "#666666" }} 
            variant="outlined"
          >
            管理用
          </Card>
        </Link>
      </Stack>
    </Container>
  )
}

export default Home