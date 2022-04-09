import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Hint } from "react-autocomplete-hint";
import "./App.css";
import styled from "styled-components";
import Cursor from "./Cursor";

const Container = styled.div`
  display: grid;

  grid-template-columns: 1fr;
`;

const Child = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;
  background-color: #184e65;
  display: none;
`;

const ChildInput = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;
  display: block;
`;

function App() {
  const [hintData, setHintData] = useState([]);
  const [text, setText] = useState("");
  const [selectedCity, setselectedCity] = useState("");

 
  const childRef = React.useRef();

  // IP ADRESS -> city
  const [city, setIP] = useState("");

  //creating function to load ip address from the API
  const getDataIP = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    setIP(res.data.city);
    //setText("find a city");
    setselectedCity(res.data.city);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getDataIP();
  }, []);

  //////////////////////////

  var hintArray = [];
  const getData = async () => {
    const res = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );

    for (const key of Object.keys(res.data.data)) {
      console.log(key, res.data.data[key].cities);
      res.data.data[key].cities.map((a) => hintArray.push(a));
    }

    hintArray.push("Liege");
    setHintData(hintArray);
  };

  useEffect(() => {
    getData();
  }, []);

  //a mettre dans le return pour afficher les villes :
  // <code>{`[${hintData.toString()}]`}</code>
  function handleclick(e) {
    e.preventDefault();
    setText(e.target.value);
    //console.log(e.target.code)
    //console.log(e.target.keyCode)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      console.log("enter press here! ");
      checkIfExist(event.target.value);
    }
  }

  function strNoAccent(a) {
    var b = "áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
      c = "aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
      d = "";
    for (var i = 0, j = a.length; i < j; i++) {
      var e = a.substr(i, 1);
      d += b.indexOf(e) !== -1 ? c.substr(b.indexOf(e), 1) : e;
    }
    return d;
  }

  function checkIfExist(targetValue) {
    console.log(targetValue);
    ///// remove white space from string value
    let last = targetValue.charAt(targetValue.length - 1);
    let correctedString = targetValue;
    while (last === " ") {
      console.log(last + "is white space");
      correctedString = correctedString.slice(0, -1);
      last = correctedString.charAt(correctedString.length - 1);
    }

    /// remove "." from string value
    last = correctedString.charAt(correctedString.length - 1);

    while (last === ".") {
      console.log(last + "is a dot");
      correctedString = correctedString.slice(0, -1);
      last = correctedString.charAt(correctedString.length - 1);
    }
    //console.log(hintData)
    ///// remove accent from string value
    let cityNoAccent = strNoAccent(correctedString);
    const found = hintData.find((element) => {
      return element.toLowerCase() === cityNoAccent.toLowerCase();
    });
    if (found !== undefined) {
      console.log(found + " is in data");
      setText("");
    } else {
    }
  }

  function onDivEvent(e){
    console.log("onIn")
    childRef.current.mouseOverEvent();

  }
  function onDivOut(e){
    console.log("onOut")
    childRef.current.mouseOutEvent();

  }

  return (
    <>
      <Cursor ref={childRef} ></Cursor>
      <div className="App">
        <Container  >
          <Child className="selectedCity"> {selectedCity}</Child>
          <ChildInput >
            <Hint options={hintData} allowTabFill>
              <input
                placeholder="find a city"
                spellcheck="false"
                className="input-with-hint"
                value={text}
                onChange={handleclick}
                onKeyPress={handleKeyDown}
                onMouseEnter={onDivEvent} onMouseLeave={onDivOut}
              ></input>
            </Hint>
          </ChildInput>
        </Container>
      </div>
    </>
  );
}

export default App;
