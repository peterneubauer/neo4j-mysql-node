var mysqlDriver = require('mysql');
var neo4jDriver = require('neo4j');
//var q = require('promised-io/promise');

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
        });
    }
)

//now the migration part
var cypherStatements = [];
cypherStatements.push("hej");

//Die Teile
mysql.query("SELECT TeilID, Name FROM TEIL", function (err, rows, fields) {
    if (err) throw err;
    rows.forEach(function (row) {
        var cypher = "CREATE (t:Teil{id:" + row.TeilID + ", name:'" + row.Name + "'})";
        cypherStatements.push(cypher);
    })
}).then(function(){console.log("then")});

//Die Teile-Hierarchie   
// TODO should be always after the first part in order to guarantee ordered Cypher statements
mysql.query("SELECT TeilID, UnterTeilID, Anzahl FROM TEIL_VON", function (err, rows, fields) {
    if (err) throw err;
    rows.forEach(function (row) {
        var cypher = "MATCH unterteil:Teil, teil:Teil WHERE unterteil.id?=" + row.UnterTeilID + " and teil.id?=" + row.TeilID + " WITH unterteil, teil CREATE unterteil-[:TEIL_VON{anzahl:" + row.Anzahl + "}]->teil";
        cypherStatements.push(cypher);
    })
    console.log(cypherStatements);
    //TODO this has to be executed in order or through the Cypher Batch endpoint
    cypherStatements.forEach(function (statement, error) {
        neo4j.query(statement, function(error){
            console.log('1', error);
        });
    });
});

console.log("2", cypherStatements);


neo4j.query("START n=node(*) return n;", {}, function (err, results) {
    if (err) throw err;
//    var rel = results[0] && results[0]['rel'];
//    console.log(results);
});


mysql.end();


