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
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import jsonData from './ConvertedNew.json';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Tooltip from '@mui/material/Tooltip';
const baseUrl = "https://mern-autosearchbox-server.onrender.com/camera";


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const THEME = createTheme({
  typography: {
    "fontFamily": `"Segoe UI"`
  }
});


export default function App() {
  const [option, setAllOption] = useState([]);
  const [tableData, setAlltableData] = useState([]);
  const [dense, setDense] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [tableDataLoading, settableDataLoading] = useState(false);  
  const initialState = [];


  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };
  
  const handleInputChange = (e) => {
    // node API call for auto search option from database    
    setAllOption(initialState);
    if (e.target.value.trim() === "") {
      setAlltableData(initialState);
    }
    else {
      // this for progress
      try {
        (async () => {
          setLoading(true);          
          //await sleep(1000); // For demo purposes.         
          var resultData = await fetch(`${baseUrl}/search?text=${e.target.value}`).then(res => res.json());
          
          resultData?.forEach((element) => {

            element.Info?.forEach((subelement) => {

              if (subelement.length > 0) {
                var result = subelement.find(({ Name }) => Name === "capture_timestamp");
                if (result != null) {
                  element.capture_timestamp = result.Value;
                }
              }
            });

          });
          setAllOption(resultData);
          setLoading(false);          
        })();
      }
      catch (error) {
        // TypeError: Failed to fetch
        console.log('There was an error', error);
        setLoading(false);
      }
    }
  }

  const handleValueChange = (event, option) => {
    if (option != null) {
      try {
        (async () => {
          settableDataLoading(true);

          var url = `${baseUrl}/topic`;
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: option.EventTopic })
          };

          await fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
              setAlltableData(data);
            });

            settableDataLoading(false);
        })();
      }
      catch (error) {
        // TypeError: Failed to fetch
        console.log('There was an error', error);
        settableDataLoading(false);
      }
    }
    else {
      setAlltableData(initialState);
    }
  }

  const renderInput = (params) => {
    return (<TextField {...params} label="Camera Meta-Data"
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

      onChange={(e) => handleInputChange(e)} />)
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
          <Tooltip  title="Show more" placement="right" arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </Tooltip>
          </TableCell>

          <TableCell align="left">{row.SeqNo}</TableCell>
          <TableCell align="left">{row.Category}</TableCell>
          <TableCell align="left">{new Date(row.TimeStamp).toUTCString()}</TableCell>
          <TableCell align="left">{row.EventTopic}</TableCell>
          <TableCell align="left">{row.PropertyOperation}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography gutterBottom component="div">
                  <b>More Information</b>
                </Typography>
                <ul class="ulList">
                  {row.Info.map((InfoRow) =>
                  (
                    InfoRow.length > 0
                      ? InfoRow.map((subRowData) => (
                        <li key={row._id}> <b>{subRowData.Name + ": "}</b> {subRowData.Value}</li>))
                      : <li key={row._id}> <b>{InfoRow.Name + ": "}</b> {InfoRow.Value}</li>
                  ))}
                </ul>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const ScrollButton = () => {

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true)
      }
      else if (scrolled <= 300) {
        setVisible(false)
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
        /* you can also use 'auto' behaviour
            in place of 'smooth' */
      });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
      <Tooltip title="Scroll to top">        
      <ArrowCircleUpIcon        
        cursor="pointer"
        style={{
          fontSize: "48px",
          color: "gray",
          position: "fixed",
          bottom: 15,
          right: 15,
          display: visible ? "block" : "none"
        }}
        onClick={scrollToTop}>
      </ArrowCircleUpIcon>
      </Tooltip>
    );
  }

  return (
    <ThemeProvider theme={THEME}>
      <div className="App">
        <div className="divTitle">
          <div className='inline-block-child'>
            <img src="/favicon.ico" alt="Salient logo" style={{ width: '50x', height: "50px" }} />
          </div>

          <div className='inline-block-child'>
            <strong className='SalientText'>S A L I E N T</strong>
          </div>

          <div style={{ paddingTop: "10px", margin: "auto", width: "75%" }} >
            <p><b>Global Search PoC</b></p>
          </div>
        </div>

        <div style={{ margin: "20px" }} >
          <div className="inline-block-child-center">
            <Autocomplete
              disablePortal
              freeSolo
              id="combo-box-demo"
              options={option}
              filterOptions={(option) => option}
              getOptionLabel={(option) => option.EventTopic}
              loading={loading}
              popupIcon={<SearchIcon style={{ cursor: "pointer" }} />}
              onChange={(event, value) => handleValueChange(event, value)}
              renderOption={(props, option) => (
                <Card {...props} sx={{ minWidth: 275 }} key={`${option._id}`} style={{ padding: "0px", border: "none", boxShadow: "initial" }}>
                  <CardContent align="Left" style={{ padding: "10px", borderBottom: "2px" }}>
                    <div className="left">
                      <Typography variant="h8">
                        <span> {'Category :'} {option.Category}</span>
                      </Typography>
                    </div>

                    <div className="right">
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <span> {'Sequence No :'} {option.SeqNo}</span>
                      </Typography>
                    </div>

                    <Typography variant="body2" >
                      <span> {'Event Topic :'} {option.EventTopic}</span>
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      <span> {'Timestamp :'} {new Date(option.TimeStamp).toUTCString()}</span>
                    </Typography>
                    {option.capture_timestamp && (<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      <span> {'Capture Timestamp:'} {option.capture_timestamp}</span>
                    </Typography>)}
                  </CardContent>
                </Card>
              )}

              renderInput={(params) => renderInput(params)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  // Prevent's default 'Enter' behavior.
                  event.defaultMuiPrevented = true;
                }
              }}
            />
          </div>

          <FormControlLabel
            style={{ float: "right", fontSize: "" }}
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />                    
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table" size={dense ? 'small' : 'medium'} >
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left">Seq&nbsp;No</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Timestamp</TableCell>
                  <TableCell align="left">Event&nbsp;Topic</TableCell>
                  <TableCell align="left">Property&nbsp;Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <Row key={row._id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {tableDataLoading ? <LinearProgress /> : null}
        </div>
      </div>
      <ScrollButton />
    </ThemeProvider>
  );
}