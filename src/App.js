import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import "./styles.css";

//for table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// For Dropdow
// const OPTION = [
//   { Id:"1", name: "Camera 1 - Sony Cybershot", VideoDevice:"172.15.16.1" },
//   { Id:"2", name: "Camera 2 - Axis TS", VideoDevice:"172.15.16.2" },
//   { Id:"3", name: "Camera 3 - Sony", VideoDevice:"172.15.16.13"  },
//   { Id:"4", name: "Camera 4 - Hik Vison", VideoDevice:"192.15.16.1" },
//   { Id:"5", name: "Camera 5 - Axis", VideoDevice:"250.15.16.1" },
//   { Id:"6", name: "Camera 6 - Samsung", VideoDevice:"36.15.16.1" }
// ];

const OPTION = [];
fetch("https://jsonplaceholder.typicode.com/comments").then(res => res.json()).then(data => {
  data.forEach(dataItem => {
    OPTION.push(dataItem)
  })
});

// const OPTION = [
//   { label: 'The Shawshank Redemption', year: 1994 },
//   { label: 'The Godfather', year: 1972 },
//   { label: 'The Godfather: Part II', year: 1974 },
//   { label: 'The Dark Knight', year: 2008 },
//   { label: '12 Angry Men', year: 1957 },
//   { label: "Schindler's List", year: 1993 },
//   { label: 'Pulp Fiction', year: 1994 },
//   {
//     label: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   }];

export default function App() {

  //const [OPTION, setAllOption] = useState(options || []);




  const handleInputChange = (e) => {
    // node API call for auto search option from database
    console.log(e.target.value)
  }
  const handleValueChange = (event, value) => {
    // node API call for Selected item as option from database    
    console.log(value)
  }

  return (
    <div className="App">
      <p><b>PoC Auto Searchbox - Camera Meta Data</b></p>
      <div style={{ margin: "10px", padding: "10px" }} >        
        <Autocomplete
          disablePortal          
          id="combo-box-demo"
          options={OPTION}
          getOptionLabel={(item) => item.email}
          sx={{ width: 500 }}
          onChange={(event, value) => handleValueChange(event, value)}
          renderInput={(params) => <TextField {...params} label="Camera Meta-Data" onChange={(e) => handleInputChange(e)} />}
        />
      </div>
      <TableContainer component={Paper} hidden >
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
            {OPTION.map((row) => (
              <TableRow
                key={row.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">{row.postId}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">{row.body}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}