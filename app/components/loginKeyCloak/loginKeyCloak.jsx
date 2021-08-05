import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Keycloak from 'keycloak-js';

const _kc = new Keycloak('./app/components/loginKeycloak/keycloak.json');

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */


const doLogin = _kc.login;

const initKeycloak = (onAuthenticatedCallback) => {
  console.log('init');
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  }).then((authenticated) => {
      if (authenticated) {
        console.log("connecté");
        onAuthenticatedCallback(true);
       } else {
        console.log("fail");
        onAuthenticatedCallback(false);
        doLogin();
       }
    })
};

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed.preferred_username;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
};



const loginKeyCloak = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(false);


  return (
    <div className="loginKeyCloak" style={{textAlign: "center"}}>
      {isSignedIn ? (
        <Home internet={props.internet}/>
      ) : (
        <div className="loginKeyCloak-page">
        <h2>Opinaka-Hybrid Login KeyCloak</h2>
        <Button className="button" variant="contained" color="secondary" onClick={() => initKeycloak(setIsSignedIn)}>
              KeyCloak Login
        </Button>
        <Button className="button" variant="contained" color="primary" onClick={() => props.setlogChoice("")}>
              Retour
        </Button>
      </div>)}
    </div>
  );
};

export default loginKeyCloak;
