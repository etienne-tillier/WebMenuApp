import React, { useState, useEffect } from 'react';
import LoginFireBase from '../loginFirebase/loginFirebase';
import LoginKeyCloak from '../loginKeyCloak/loginKeyCloak';
import LoginOffline from '../loginDB/loginDB';
import { isOnline, selectStyle, loadStyleUser, isStyleFull } from '../../utils/db2';
import classNames from 'classnames'

const loginMenu = () => {
  const [isNewUser, setisNewUser] = useState(0);
  const [logChoice, setlogChoice] = useState("");
  const [onLine, setonLine] = useState(false);
  const [idMenu, setidMenu] = useState("");
  const [styleData, setStyleData] = useState("");
  const root = document.documentElement;

  const internetOn = () => {
    setonLine(true);
  }

  const internetOff = () => {
    setonLine(false);
  }

  const updateStylePage = (data) => {
    console.log("STYLEEE " + JSON.stringify(data));
    document.title = data.loginPage.design.title.name;
    root.style.setProperty('--color1',data.loginPage.design.color.mainColor);
    root.style.setProperty('--color4',data.loginPage.design.color.secondColor);
    root.style.setProperty('--color2',data.loginPage.design.color.bgLoginColor);
  }

  useEffect(() => {
    let nbstyleline = 0;
    isStyleFull().then((value) => {
      console.log('nbrlignevalue = ' + value);
      console.log('idmenueffect = ' + idMenu);
      console.log('Nbruser = ' + isNewUser);
      nbstyleline = value;
      if (nbstyleline >= 1){
        if (idMenu != ""){
          console.log("looogeeeeeed");
          loadStyleUser(idMenu).then(() => {
            selectStyle().then((data) => {
              setStyleData(data);
              updateStylePage(data);
            })
          })
        }
        else {
          selectStyle().then((data) => {
            setStyleData(data);
            updateStylePage(data);
          })
        }
      }
      else {
        let data = require("../../utils/stylebase.json")
        setStyleData(data);
        updateStylePage(data);
      }
    })

  },[isNewUser])

  useEffect(() => {
    isOnline(internetOn,internetOff);
  }, [])

  const buttonClicked = (value) => {
    setlogChoice(value);
  }


  return (
    <div className="loginMenu" style={{textAlign: 'center'}}>
      {logChoice == "" ? ( styleData != "" ?
        <div className="loginPage">
          <div className="loginChoice">
              <img className="imgLogin" src={(onLine ? styleData.loginPage.design.logo.backgroundImage : require('../../assets/images/Opinaka.png'))} />
              <h2>{styleData.loginPage.design.title.name}</h2>
              <div className="divButton">
                <div disabled={(onLine ? false : true)}
                className={classNames("buttonConnexion",(onLine ? "" : "disabled"))}
                variant="contained"
                color="primary"
                onClick={(onLine ? () => buttonClicked("firebase") : () => console.log("no connexion"))}>
                  {styleData.loginPage.connexion.firebase.name}
                </div>
                <div className={classNames("buttonConnexion","disabled")} variant="contained" color="secondary" /*onClick={() => buttonClicked("keyCloak")}*/>
                  {styleData.loginPage.connexion.keycloak.name}
                </div>
                <div className="buttonConnexion" variant="contained" color="inherit" onClick={() => buttonClicked("offline")}>
                  {styleData.loginPage.connexion.local.name}
                </div>
              </div>
            </div>
          </div>
       : "") : (logChoice == "firebase" ? <LoginFireBase
       isNewUser={isNewUser}
       styleData={styleData}
       idMenu={idMenu}
       setidMenu={setidMenu}
       setisNewUser={setisNewUser}
       internet={onLine}
       setlogChoice={setlogChoice}/>
      : (logChoice == "keyCloak" ? <LoginKeyCloak
      isNewUser={isNewUser}
      styleData={styleData} idMenu={idMenu}
      setidMenu={setidMenu}
      setisNewUser={setisNewUser}
      internet={onLine}
      setlogChoice={setlogChoice}/>
       : <LoginOffline
       isNewUser={isNewUser}
       styleData={styleData}
       idMenu={idMenu}
       setidMenu={setidMenu}
       setisNewUser={setisNewUser}
       internet={onLine}
       setlogChoice={setlogChoice}/>)) }
    </div>
  );
};

export default loginMenu;
