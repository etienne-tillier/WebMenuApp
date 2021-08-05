import { db } from './db2'
import { firebase, dataTable } from './firebaseConfig';
const databaseOnline = firebase.database();
//const rootUser = databaseOnline.ref("Users");
const rootUser = databaseOnline.ref(dataTable);

db.serialize(() => {
  // let sqlDelete = "DROP TABLE USERS";
  // db.run(sqlDelete);
  let sql = "CREATE TABLE IF NOT EXISTS USERS (" +
  "login VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL" +
  ", menuId VARCHAR(255) NOT NULL, FOREIGN KEY (menuId) REFERENCES MENUS(id));";
  db.run(sql);
})
const checkerConnexion = (id) => {
  var find = false;
  return new Promise((resolve,reject) => {
    rootUser.once("value", (snapchot) => {
      if (snapchot.val()){
        var monTableau = Object.keys(snapchot.val()).map(function(cle) {
          return [cle, snapchot.val()[cle]];
        });
        for (var [key, value] of monTableau){
          if (key == id){
            find = true;
            resolve(true);
          }
        }
        if (find == false) {
          console.log("not find");
          resolve(false);
        }
      }
    })
  })
}

const connexionFirebase = (login,password,callback) => {
  firebase.auth().signInWithEmailAndPassword(login, password)
  .then((userCredential) => {
    if (userCredential){
      console.log("userhere");
      //Signed in
      checkerConnexion(firebase.auth().currentUser.uid).then((value) => {
        if (value == true){
          console.log("userid " + firebase.auth().currentUser.uid);
          callback(true,firebase.auth().currentUser.uid);
        }
        else {
          callback(true,"defaut");
        }
      })
    }
    })
    .catch((error) => {
      console.log("nouser");
      callback(false);
    });
    // rootUser.once("value", (snapchot) => {
    //   if (snapchot.val()){
    //     console.log(snapchot.val());
    //     for (let i = 0; i < snapchot.val().length ; i++){
    //       if (snapchot.val()[i]){
    //         let user = snapchot.val()[i];
    //           if (user.login == login && user.password == password){
    //             console.log("fonctionne");
    //             find = true;
    //             console.log("userid " + user.id);
    //             callback(true,user.id);
    //             console.log("callbacktrue")
    //           }
    //       }
    //     }
    //     if (!find) callback(true,"defaut");
    //   }
    //   else {
    //     callback(true,"defaut");
    //   }
    // })
}


// const connexionFirebase = (login,password,callback) => {
//   let find = false;
//   console.log("rentré");
//   console.log("login = " + login);
//   console.log("password = " + password);
//   rootUser.once("value", (snapchot) => {
//     if (snapchot.val()){
//       console.log(snapchot.val());
//       for (let user of snapchot.val()){
//         if (user.login == login && user.password == password){
//           console.log("fonctionne");
//           find = true;
//           console.log("userid " + user.id);
//           callback(true,user.id);
//           console.log("callbacktrue")
//         }
//       }
//       if (!find) callback(false);
//     }
//     else {
//     callback(false);
//     }
//   })
// }

const connexion = (login,password,callback) => {
  console.log("rentré");
  console.log("login = " + login);
  console.log("password = " + password);
  let sql = "SELECT * FROM USERS WHERE login = ?"
  db.get(sql,[login],(error,row) => {
    if (row && password == row.password){
      console.log(row);
      if (row.menuId != 'defaut'){
        callback(true,row.menuId);
      }
      else {
        callback(false);
      }
    }
    else {
      callback(false);
    }
  })
}


export {
  db,
  connexion,
  connexionFirebase
};
