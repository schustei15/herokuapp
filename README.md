Anwendung:

index.js 			Startpunkt

app /config 		DB Logindaten
	/controller 	Funktionen für Anwendung
	/route 			Routen für Anwendung


Datenbank:

CREATE TABLE snippet (id serial primary key,
    name varchar(255),
    description varchar(255),
    author varchar(255),
    language varchar(255), 
    code varchar(255),
    tags text[]
);


Login DB:

user: "rgpclslwqwkfgh"
host: "ec2-54-235-68-3.compute-1.amazonaws.com"
database: "dbgph9pnk4gj08"
password: "33885815170ef856dd628a7ecf6a37e016ad37a4397d82b3d60c9bd4a1a5763e"
port: "5432"


Build:

benötigt Heroku Buildpack for Node.js
siehe: https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs


URI:
https://cloudappschustei15.herokuapp.com/

GIT:
https://github.com/schustei15/herokuapp