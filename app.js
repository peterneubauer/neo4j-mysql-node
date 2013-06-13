var mysqlDriver = require('mysql');
var neo4jDriver = require('neo4j');

var mysql = mysqlDriver.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret'
});
mysql.connect();
var neo4j = new neo4jDriver.GraphDatabase('http://localhost:7474');


// populate the database with a small PARTS-graph

var sql = [
    "DROP DATABASE teile", ,
    "CREATE DATABASE teile;",
    "USE teile;",
    "CREATE TABLE TEIL (TeilID int PRIMARY KEY, Name VARCHAR(255));"          ,
    "CREATE TABLE TEIL_VON (TeilID int, UnterTeilID int, Anzahl int,PRIMARY KEY(TeilID,UnterTeilID));",
    "INSERT INTO TEIL VALUES(1,'Golf');",
    "INSERT INTO TEIL VALUES(2,'Karosserie');" ,
    "INSERT INTO TEIL VALUES(3,'Rad');",
    "INSERT INTO TEIL_VON VALUES(1,2,1);",
    "INSERT INTO TEIL_VON VALUES(2,3,4);"
//    "SELECT * FROM TEIL JOIN TEIL_VON ON TEIL_VON.TeilID=TEIL.TeilID AND TEIL_VON.UnterTeilID=TEIL.TeilID,;"
];


sql.forEach(function (statement) {
        console.log(statement);
        mysql.query(statement, function (err, rows, fields) {
            if (err) throw err;

            console.log(rows);
        });
    }
)

//now the migration part

//Die Teile
mysql.query("SELECT TeilID, Name FROM TEIL", function (err, rows, fields) {
    if (err) throw err;
    rows.forEach(function (row) {
        var sql = "CREATE (t:Teil{id:" + row.TeilID + ", name:'" + row.Name + "'})";
        console.log(sql);
//        neo4j.query(sql);
    })
});

//Die Teile-Hierarchie
mysql.query("SELECT TeilID, UnterTeilID, Anzahl FROM TEIL_VON", function (err, rows, fields) {
    if (err) throw err;
    rows.forEach(function (row) {
        var sql = "MATCH unterteil:Teil, teil:Teil WHERE unterteil.id?=" + row.UnterTeilID + " and teil.id?=" + row.TeilID +" WITH unterteil, teil CREATE unterteil-[:TEIL_VON{anzahl:" + row.Anzahl + "}]->teil";
        console.log(sql);
        neo4j.query(sql);
    })
});



neo4j.query("START n=node(*) return n;", {}, function (err, results) {
    if (err) throw err;
    var rel = results[0] && results[0]['rel'];
    console.log(results);
});



mysql.end();


