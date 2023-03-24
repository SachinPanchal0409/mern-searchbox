import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import jsonData from './ConvertedNew.json';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const baseUrl = "https://mern-searchbox-server.onrender.com";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function App() {

  const [option, setAllOption] = useState([]);
  const [tableData, setAlltableData] = useState([]);
  const [dense, setDense] = React.useState(false);
  let loading = false;
  const initialState = [];

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleInputChange = (e) => {
    // node API call for auto search option from database    
    if (e.target.value.trim() === "") {
      setAllOption(initialState);
      setAlltableData(initialState);
    }
    else {
      // fetch(`${baseUrl}/emails/search?text=${e.target.value}`).then(res => res.json()).then(data => {
      //   setAllOption(data);
      // }); 
      // var t = jsonData.Events.filter((item) => {
      //   return item.EventTopic.toString().toLowerCase().includes(e.target.value.toLowerCase());     
      // });
      // setAllOption(t);

      // this for progress
    (async () => {
        loading = true;

        await sleep(200); // For demo purposes.
         
        var t = jsonData.Events.filter((item) => {
        return item.EventTopic.toString().toLowerCase().includes(e.target.value.toLowerCase());     
      });
      setAllOption(t);
      loading = false;       
      })();      
    }
  }

  const handleValueChange = (event, option) => {
    if (option != null) {
      // fetch(`${baseUrl}/emails/search?text=${option.email}`).then(res => res.json()).then(data => {
      //   setAlltableData(data);
      // });
      var t = jsonData.Events.filter((item) => {
        return item.EventTopic.toString().toLowerCase().includes(option.EventTopic.toString().toLowerCase());
      });
      setAlltableData(t);

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
        <div style={{ padding: "10px" }} >
          <p><b>Auto Searchbox &#40;PoC&#41; </b></p>
        </div>
      </div>

      <div style={{ margin: "20px 0px" }} >
        <Autocomplete
          disablePortal
          freeSolo
          id="combo-box-demo"          
          options={option}
          filterOptions={(option) => option}
          getOptionLabel={(option) => option.EventTopic}
          sx={{ width: 500 }}
          loading={loading}          
          popupIcon={<SearchIcon style={{ cursor: "pointer" }} />}
          onChange={(event, value) => handleValueChange(event, value)}
          renderOption={(props, option) => (
            <Card {...props} sx={{ minWidth: 275 }} style={{ padding: "0px", border: "none", boxShadow: "initial" }}>
              <CardContent align="Left" style={{ padding: "10px", borderBottom:"2px"}}>
                <div class="left">
                <Typography variant="h8">
                  <span> {'Category :'} {option.Category}</span>
                </Typography>
                </div>               

                <div class="right">
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <span> {'Sequence No :'} {option.SeqNo}</span>
                </Typography>
                </div>                              
                
                <Typography variant="body2" >
                  <span> {'Event Topic :'} {option.EventTopic}</span>
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                <span> {'TimeStamp :'} {option.TimeStamp}</span>
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
              ), 
              // this is for progress
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
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
      <FormControlLabel
      style={{float:"right",fontSize:"" }}
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'} aria-label="meta-data table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Seq&nbsp;No</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">TimeStamp</TableCell>
              <TableCell align="left">Event&nbsp;Topic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((element, row) => (
              <TableRow
                key={row.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left">{element.SeqNo}</TableCell>
                <TableCell align="left">{element.Category}</TableCell>
                <TableCell align="left">{element.TimeStamp}</TableCell>
                <TableCell align="left">{element.EventTopic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>      
    </div>
  );
}