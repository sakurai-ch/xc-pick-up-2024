import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Toolbar } from '@mui/material'

function TitleToolbar() {
  const [competitionName, setCompetitionName] = useState<string>()

  // 大会名データ取得
  const fetchData = () => {
    axios.get(`${process.env.REACT_APP_API}` + "/competition").then((response) => {
      setCompetitionName(response.data.data)
    })
  }

  // 更新
  useEffect(() => {
    fetchData()
  }, [])
  
  return (
    <Toolbar>
      <h2>{competitionName}</h2>
    </Toolbar>
  )
}

export default TitleToolbar