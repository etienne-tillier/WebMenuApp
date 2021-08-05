import React, { useState } from 'react';
import Home from '../home';
import { connexionFirebase } from '../../utils/connexionDB'
import { syncMenu, syncUsers, loadStyleUser } from '../../utils/db2'

const login = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [error,setError] = useState("")

  const syncBD = (id) => {
    return new Promise((resolve,reject) => {
      syncMenu(id).then((value) => {
        if (value){
            syncUsers(id).then(() => {
              resolve(true);
            });
          }
        })
    })
  }

  const displayConnexion = function(bool,id) {
    if (bool) {
      if (props.internet){
        console.log("internettt");
        syncBD(id).then(() => {
          console.log("propss" + JSON.stringify(props))
          props.setidMenu(id);
          loadStyleUser(id).then(() => {
            props.setisNewUser(props.isNewUser + 1);
            setError("");
            setIsSignedIn(true);
          })
        })
      }
      else {
        console.log(" no internettt");
        console.log("propss" + JSON.stringify(props))
        props.setidMenu(id);
        props.setisNewUser(props.isNewUser + 1);
        setError("");
        setIsSignedIn(true);
      }
    }
    else {
      setIsSignedIn(false);
      setPassword("");
      setLogin("");
      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
      setError("Mauvaise combinaison de mot de passe et de login");
    }
  }

  const handleLoginChange = (event) => {
    if (error != ""){
      setError("");
    }
    setLogin(event.target.value);
  }
  const handleCheckLogin = () => {
    console.log('login = ' + login + " password = " + password);
    connexionFirebase(login,password,displayConnexion)
  }
  const handlePasswordChange = (event) => {
    if (error != ""){
      setError("");
    }
    setPassword(event.target.value);
  }

  const returnButton = () => {
    setError("");
    props.setlogChoice("")
  }



  return (
    <div className="loginFirebase" style={{textAlign: 'center'}}>
    {isSignedIn ? (
      <Home styleData={props.styleData} idMenu={props.idMenu} internet={props.internet} setIsSignedIn={setIsSignedIn}/>
    ) : (
      <div className="loginPage">
        <div className="loginChoice">
          <img className="imgLogin" src={(props.internet ? props.styleData.loginPage.design.logo.backgroundImage : require('../../assets/images/Opinaka.png'))} />
          <h2>{props.styleData.loginPage.design.title.name} Connexion Firebase</h2>
          <div className="divButton">
            <input placeholder="Login" id="login" name="login" type="email" onChange={(e) => {handleLoginChange(e)}} />
            <input placeholder="Mot de passe" id="password" name="password" type="password" onChange={(e) => {handlePasswordChange(e)}} />
            <div id="error" style={{color:"red"}}>{error}</div>
            <div className="buttonConnexion" variant="contained" color="primary" onClick={handleCheckLogin}>
            Se connecter
            </div>
            <div className="buttonConnexion" variant="contained" color="secondary" onClick={() => returnButton()}>
              Retour
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default login;
