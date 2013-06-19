process.on('uncaughtException', function (err) {
    console.log("Uncaught Exception", err)
});

var mysqlDriver = require('mysql');
var neo4jDriver = require('neo4j');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
  exports.movies=db.collection("movies",{w:1});
/*
  coll.insert(data, function(err, result) {
    db.close();
  });
*/
});

var mysql = mysqlDriver.createConnection({ host:'localhost', user:'me', password:'secret' });
mysql.connect();
var neo4j = new neo4jDriver.GraphDatabase('http://localhost:7474');

exports.mysql=mysql
exports.neo4j=neo4j
exports.mongo=MongoClient

exports.handle = function(err,data) { if (err) console.log(err); }
/*

var x=require("./run")
x.movies.find().toArray(function(err,res) {console.log(res);})
var d=require("./load_data")
d.load_movie(600,function(err,data) { data._id = data.id; console.log(data)})

d.load_movie(600,function(err,data) { data._id = data.id; x.movies.insert(data,console.log)})

d.load_movie(600,function(err,data) { data._id = data.id; x.movies.insert(data,x.handle)})

x.movies.find().toArray(function(err,data) {
   data.forEach(function(movie){
    
   })
})
x.movies.find().each(function(err,movie){
    if (!movie || !movie.id) return;
    console.log("Adding",movie.name);
    x.neo4j.query("MERGE (m:Movie {id:{id},name:{name}})",{id:movie.id,name:movie.name},x.handle);
    movie.cast.forEach(function(member) {
        console.log("Adding",member.name,member.character);                                                  
        x.neo4j.query("MERGE (a:Actor {id:{actor},name:{name}})",{actor:member.id, name:member.name},x.handle);
        x.neo4j.query("MATCH (m:Movie),(a:Actor) where m.id={id} and a.id={actor} create (m)<-[:ACTS_IN {role:{role}}]-(a)",
            {id:movie.id,role: member.character, actor:member.id, name:member.name},x.handle);
    })
})
x.neo4j.query("MERGE (m:Movie {id:{id}})<-[:ACTS_IN {role:{role}}]-(a:Actor {id:{actor}})",
    {id:movie.id,role: member.character, actor:member.id, name:member.name},x.handle);

*/
