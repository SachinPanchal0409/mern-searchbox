import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./styles.css";
//for table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { color } from "@mui/system";

const baseUrl = "https://mern-searchbox-server.onrender.com";


export default function App() {

  const [option, setAllOption] = useState([]);
  const [tableData, setAlltableData] = useState([]);
  const initialState = [];

  const handleInputChange = (e) => {
    // node API call for auto search option from database    
    if (e.target.value.trim() == "") {
      setAllOption(initialState);
      setAlltableData(initialState);
    }
    else {
      console.log("Calling api")
      fetch(`${baseUrl}/emails/search?text=${e.target.value}`).then(res => res.json()).then(data => {
        setAllOption(data);
      });
    }
  }

  const handleValueChange = (event, option) => {
    if (option != null) {
      fetch(`${baseUrl}/emails/search?text=${option.email}`).then(res => res.json()).then(data => {
        setAlltableData(data);
      });
    }
    else {
      setAlltableData(initialState);
    }
  }

  return (
    <div className="App">
      <div className="divTitle">
        <div class='inline-block-child'>
          <img src="/favicon.ico" alt="Salient logo" style={{ width: '50x', height: "50px" }} />
        </div>
        
        <div class='inline-block-child'>
        <strong class='SalientText'>S A L I E N T</strong> 
        </div>
        <div style={{padding:"10px"}} >
        <p><b>PoC Auto Searchbox - Camera Meta Data</b></p> 
        </div>        
      </div>
      
      <div style={{ margin: "20px 0px" }} >
        <Autocomplete
          disablePortal
          freeSolo
          id="combo-box-demo"
          options={option}
          filterOptions={(option) => option}
          getOptionLabel={(option) => option.email}
          sx={{ width: 800 }}
          popupIcon={<SearchIcon  style={{ cursor: "pointer"}} />}
          onChange={(event, value) => handleValueChange(event, value)}
          renderOption={(props, option) => (
            <Card {...props} sx={{ minWidth: 275 }} style={{ border: "none", boxShadow: "initial" }}>
              <CardContent align="Left">
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {option.name}
                </Typography>
                <Typography variant="h5" component="div" >
                  {option.email}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <span> {'Identification No. ='} {option.id}</span>
                </Typography>
                <Typography variant="body2">
                  {option.body}
                </Typography>
              </CardContent>
            </Card>
          )}

          renderInput={(params) => <TextField {...params} label="Camera Meta-Data"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start"><SearchIcon style={{ cursor: "pointer" }} />
                </InputAdornment>
              )
            }}

            onChange={(e) => handleInputChange(e)} />}

          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Prevent's default 'Enter' behavior.
              event.defaultMuiPrevented = true;
            }
          }}
        />
      </div>
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Post&nbsp;ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Body</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((element, row) => (
              <TableRow
                key={row.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left">{element.postId}</TableCell>
                <TableCell align="left">{element.name}</TableCell>
                <TableCell align="left">{element.email}</TableCell>
                <TableCell align="left">{element.body}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}