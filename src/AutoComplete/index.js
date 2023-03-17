import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const AutoComplete = ({
  options,
  onSearch,
  onSelect,
  optionKey = "name",
  optionKey2 = "Id",
  optionKey3 = "VideoDevice",
  optionCount = 5,
  noOptionText = "No Items"
}) => {
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState("");
  const [allOption, setAllOption] = useState(options || []);
  const [searchResult, setSearchResult] = useState(options || []);

  useEffect(() => {
    setAllOption(options);
  }, [options]);

  const selectHandle = (val) => {
    setSearchText("");
    setSelected(val[optionKey]);
    if (onSelect) {
      onSelect(val);
      return;
    }

    let tempOptions = [...options];
    tempOptions = tempOptions.filter((obj) =>
      obj[optionKey]?.toLowerCase().includes(val[optionKey].toLowerCase()) ||
      obj[optionKey3]?.toLowerCase().includes(val[optionKey3].toLowerCase())
    );    
    setSearchResult(tempOptions)
    
  };

  const handleChange = ({ target }) => {
    setSearchText(target.value);
    if (onSearch) {
      onSearch(target.value, (data) => setAllOption(data));
      return;
    }

    let tempOptions = [...options];
    tempOptions = tempOptions.filter((obj) =>
      obj[optionKey]?.toLowerCase().includes(target.value?.toLowerCase()) ||
      obj[optionKey3]?.toLowerCase().includes(target.value?.toLowerCase())
    );
    setAllOption(tempOptions);
  };

  return (
    <div style={{  margin: "10px", padding:"10px" }} >
    <div className={styles.autoComplete}>
      <input
        placeholder="Search Data"
        className={styles.inputBox}
        onFocus={() => {
          setSelected("");
          setSearchResult(options);
        }}
        value={selected || searchText}
        onChange={handleChange}
        style={{
          borderBottomLeftRadius: searchText ? 0 : "",
          borderBottomRightRadius: searchText ? 0 : ""
        }}
      />
      <div  
        className={styles.dropdown}
        style={{
          display: searchText ? "flex" : "none",
          // oneOption Height * count - 1st borderTop (1px)
          maxHeight: `${35 * optionCount -1}px`
        }}
      >
        {!allOption.length ? (
          <div> {noOptionText} </div>
        ) : (
          allOption.map((option, index) => (            
            <div key={`${index}`} class="cameraDiv" onClick={() => selectHandle(option)}>
              {option[optionKey2]} - {option[optionKey]}
            </div>
          ))
        )}
      </div>            
    </div>
    {!searchResult.length ? (
          <div> {noOptionText} </div>
        ) : (
    <tbody >
          <tr>
            <th>Id</th>
            <th>Name</th>            
            <th>Video Device</th>          
          </tr> 
          {
            searchResult.map((item, i) => (
                <tr key={i}>
                <td>{item.Id}</td>
                <td>{item.name}</td>              
                <td>{item.VideoDevice}</td>   
                </tr>
            ))
        }
    </tbody> 
    )}   
    </div>
  );
};
export default AutoComplete;