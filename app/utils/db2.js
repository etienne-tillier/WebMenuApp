const sqlite3 = window.require('sqlite3');
var db = new sqlite3.Database('mydb.db');
import {firebase, dataTable} from './firebaseConfig';
const databaseOnline = firebase.database();
const rootUser = databaseOnline.ref(dataTable);
const onlineTest = require('is-online');



const isOnline = (yes,no) => {
  onlineTest().then(online => {
    if(online){
      console.log("YES INTERNET");
        yes();
    }else{
        console.log("NO DECONNECTED");
        no();
    }
});
}

db.serialize(() => {
  let sqlStyle = "CREATE TABLE IF NOT EXISTS STYLE (" +
  "json VARCHAR(3000));";
  db.run(sqlStyle);
  // let sqlDelete = "DROP TABLE MENUS"
  // db.run(sqlDelete);
  let sqlMenus = "CREATE TABLE IF NOT EXISTS MENUS (" +
  "id VARCHAR(255) PRIMARY KEY NOT NULL, json VARCHAR(3000), jsonStyle VARCHAR(3000));"
  db.run(sqlMenus);
})

const syncUsers = (id) => {
  return new Promise((result, reject) => {
    console.log("go sync users");
    var query = firebase.database().ref(dataTable + "/" + id);
    query.once("value", (snapchot) => {
      if (snapchot.val()){
        let sqlDel = "DELETE FROM USERS WHERE menuId = ?";
        db.run(sqlDel,[id],(err) => {
          if (err){
            console.log(err);
            reject(false);
          }
          else {
            let sqlInsert = 'INSERT INTO USERS (login,password,menuId) VALUES(?,?,?);';
            db.run(sqlInsert,[snapchot.val().authLocal.login,snapchot.val().authLocal.password,id]);
            console.log("ok sync users");
            result(true);
          }
        });
      }
      else {
        reject(false);
      }
    })
  })
  }

  const syncMenu = (id) => {
    return new Promise((result, reject) => {
      var query = firebase.database().ref(dataTable + "/" + id);
      console.log("entre syncMenu");
      query.once("value", (snapchot) => {
        if (snapchot.val()){
          console.log("ok syncMenu");
          let sqlDel = "DELETE FROM MENUS WHERE id = ?";
          db.run(sqlDel,[id],(err) => {
            if (err){
              console.log(err);
              reject(false);
            }
            else {
              console.log("okok");
              let sqlInsert = 'INSERT INTO MENUS (id,json,jsonStyle) VALUES(?,?,?);';
              db.run(sqlInsert,[id,JSON.stringify(snapchot.val().menu),JSON.stringify(snapchot.val().style)]);
              result(true);
            }
            });
        }
        else {
          reject(false)
        }
      })
    })
  }

const loadStyleUser = (id) => {
  return new Promise((result, reject) => {
    let sql = "SELECT jsonStyle FROM MENUS WHERE id = ?"
    db.get(sql,[id],(err,row) => {
      if (row){
        console.log("id courrant = " + id);
        let data = row.jsonStyle;
        let deleteRowsSQL = "DELETE FROM STYLE";
        db.run(deleteRowsSQL,(err) => {
          if (err) {
            console.log(err);
            reject(false);
          }
          else {
            let sqlInsert = "INSERT INTO STYLE (json) VALUES (?)"
            db.run(sqlInsert,[data]);
            console.log("ok sync style users");
            result(true);
          }
        });
      }
      else {
        reject(false);
      }
    })
  })
}

const isStyleFull = () => {
  return new Promise((result, reject) => {
    let sqlTest = "SELECT json FROM STYLE";
    db.get(sqlTest,(err, row) => {
      if (row){
        console.log("lignes style = " + row.json.length);
        result(row.json.length);
      }
      else {
        console.log("pass")
        result(0);
      }
    })
  })
}

const selectStyle = () => {
  return new Promise((result, reject) => {
    let sql = "SELECT json FROM STYLE";
    db.get(sql,(err,row) => {
      if (row) {
        let data = JSON.parse(row.json);
        console.log("ok dataStyle");
        result(data);
      }
      reject(err);
    })
  })
}

const fetchNotes = (id) => {
  console.log("id" + id);
  return new Promise((result, reject) => {
    var queries = [];
    let sql = "SELECT json FROM MENUS WHERE id = ?"
    db.get(sql,[id],(err,row) => {
      console.log("ouiiiiii");
       if (row) {
          console.log("rowww = " + row.json);
          let data = JSON.parse(row.json);
          console.log("ici ?");
          for(let i = 0; i < data.length; i++){
            console.log("row : " + data[i]);
            queries.push(data[i]);
          }
          console.log("queries = " + queries)
          result(queries); // resolve the promise
        }
        else {
          console.log("error = " + err);
          console.log("row = " + row);
        }
    })
});
}

// syncMenu().then((value) => {
//   if (value){
//       syncUsers();
//   }
// })


const selectAll = (callback,id) => {
  console.log("id selected = " + id);
  let sql = "SELECT json FROM MENUS WHERE id = ?";
  db.get(sql, [id], (error, row) => {
    var temp = [];
    if (row) {
      let data = JSON.parse(row.json);
      for (let i = 0; i < data.length; i++){
        temp.push(data[i]);
      }
      console.log("temps = " + temp);
      callback(temp);
    };
  });
}


const insertDB = (item) => {
  let json = JSON.stringify(item);
  let sql = 'INSERT INTO MENUDISPLAY (json) VALUES(?);';
  db.run(sql,[json]);
}

//pour les updates
const setCharAt = (str,index,chr) => {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

const cacherOnline = (note,id) => {
  const newData = {
    status: "0"
  }
  var query = firebase.database().ref(dataTable + "/" + id);
  console.log("queryyy = " + query);
  query.once("value", (snapshot) => {
    console.log("snap " + JSON.stringify(snapshot));
    //snapshot.val().ref("menu").orderByChild("id").equalTo(note._id).once("child_added", (value) => {
      //value.ref.update(newData);
   // })
   let newQuery = snapshot.ref.child("menu").orderByChild("_id").equalTo(note._id);
   newQuery.once("child_added", (snap) => {
    snap.ref.update(newData);
   })
  });
}

const cacher = (note,id) => {
  return new Promise((result, reject) => {
    let noteCache = note;
    let stringCondition = "";
    let setSql = [];
    noteCache.status = "0";
    fetchNotes(id).then((value) => {
      stringCondition = JSON.stringify(value);
      console.log("bd & " + stringCondition);
      for (let note of value){
        if (note._id == noteCache._id){
          setSql.push(noteCache);
        }
        else {
          setSql.push(note);
        }
      }
      let sql = `UPDATE MENUS ` +
      `SET json = ? ` +
      `WHERE json = ?`;
      console.log("base  update : " + JSON.stringify(setSql))
      db.run(sql,[JSON.stringify(setSql),stringCondition]);
      console.log("BDD updated");
      isOnline(cacherOnline(note,id),() => {console.log("no internet")});
      result(true);
    })
  })
}

const toutAfficherOnline = (id) => {
  const newData = {
    status: "1"
  }
  //var query = rootUser.orderByChild("id").equalTo(id);
  var query = firebase.database().ref(dataTable + "/" + id);
  query.once("value", (snapshot) => {
    let newQuery = snapshot.ref.child("menu").orderByChild("status").equalTo("0");
    newQuery.once("child_added", (snap) => {
     snap.ref.update(newData);
    })
  })
}


const toutAfficher = (id) => {
  return new Promise((result, reject) => {
    fetchNotes(id).then((value) => {
      let stringCondition = JSON.stringify(value);
      let listeNote = value;
      let sqlUpdate = `UPDATE MENUS ` +
      `SET json = ? ` +
      `WHERE json = ?`;
      //remise du status à 1
      for (let i = 0; i < listeNote.length; i++){
        listeNote[i].status = "1";
      }
      db.run(sqlUpdate,[JSON.stringify(listeNote),stringCondition]);
      isOnline(toutAfficherOnline(id),() => {console.log("no internet")});
      result(true);
    })
  })
}

// const toutAfficher = () => {
//   const updateBD = (temp) => {
//     for (let i = 0; i < temp.length; i++){
//       let data = JSON.stringify(temp[i]);
//       let index = data.indexOf(`status`) + 9;
//       let update = setCharAt(data,index,"1");
//       let sql = `UPDATE MENUDISPLAY ` +
//       `SET json = ? ` +
//       `WHERE json = ?`;
//       db.run(sql,[update,data]);
//     }
//   }
//   selectAll(updateBD);
// }

const searchNote = (query) => {
  return new Promise((result, reject) => {
    const tri = (temp) => {
      let search = [];
      for (let i = 0; i < temp.length; i++){
        console.log(query);
          if (temp[i].title.includes(query)){
            console.log("oui");
              search.push(temp[i]);
          }
      }
      console.log("listseeach = " + search);
      result(search);
    }
    (selectAll(tri));
  }
)}







/*const deleteDB = (id) => {
  db.transaction(function(transaction){
    transaction.executeSql(`DELETE FROM menu
    WHERE id = ?`, [id]);
  }
)}*/



/*const getDB = () => {
  return new Promise(function (resolve, reject) {
    db.all('SELECT * FROM menu', (error, rows) => {
      if (error)
        reject(error);
      else
        resolve({ rows: rows });
    });
  });
};*/




export {
  db,
  //getDB,
  insertDB,
  selectAll,
  fetchNotes,
  cacher,
  toutAfficher,
  searchNote,
  syncUsers,
  syncMenu,
  isOnline,
  loadStyleUser,
  selectStyle,
  isStyleFull
  //deleteDB,
};


