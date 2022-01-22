[![Nodejs-CI](https://github.com/SriMethan/Liantichess/actions/workflows/nodejs.yml/badge.svg)](https://github.com/SriMethan/Liantichess/actions/workflows/nodejs.yml)

## Liatomic


Liatomic is a free, open-source antichess server designed to play antichess variants.

Currently supported games are:

- [Atomic](https://liatomic.herokuapp.com/variants/atomic)
- [Atomic960](https://liatomic.herokuapp.com/variants/atomic960)

Liantichess is a free, open-source antichess server designed to play antichess and antichess variants.

Currently supported games are:

- [Antichess](https://liantichess.herokuapp.com/variants/antichess)
- [Antichess960](https://liantichess.herokuapp.com/variants/antichess960)
- [loserschess](https://liantichess.herokuapp.com/variants/losers)
- [loserschess960](https://liantichess.herokuapp.com/variants/losers960)
- [anti-antichess](https://liantichess.herokuapp.com/variants/anti_antichess)
- [anti-antichess960](https://liantichess.herokuapp.com/variants/anti_antichess960)


Additionally you can check the Chess960 option for antichess variants [Chess960 castling rules](https://en.wikipedia.org/wiki/Chess960#Castling_rules)

For move generation, validation, analysis and engine play it uses
- [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish)
- [fairyfishnet](https://github.com/gbtami/fairyfishnet) fork of [fishnet](https://github.com/niklasf/fishnet)
- [lichess-bot-variants](https://github.com/gbtami/lichess-bot-variants) fork of [lichess-bot](https://github.com/careless25/lichess-bot)

On client side it is based on [chessgroundx](https://github.com/gbtami/chessgroundx) fork of [chessground](https://github.com/ornicar/chessground)

##

liatomic is a free server and it will remain free forever.

## Installation

### Prerequisites
* You need mongodb up and running. [Mongo daemon](https://docs.mongodb.com/manual/installation/)


### Project setup
```
pip3 install -r requirements.txt --user // Install python requirements
yarn install                            // Install node requirements
yarn dev                                // Compile typescript files to javascript
yarn md                                 // Compile md files to html
```

### Start server
```
python3 server/server.py
```

### Open the repo in GitPod

GitPod lets you configure one off initializing tasks and tasks that should be run on each startup.

The project comes with the necessary GitPod config files that instruct GitPod to install dependencies for the first time, and on every startup start MongoDb and the dev server.

You can open the repo in GitPod by attaching the repo url to `https://gitpod.io/#`. For this concrete fork the url would be:

[https://gitpod.io/#https://github.com/easychessanimations/Liantichess](https://gitpod.io/#https://github.com/easychessanimations/Liantichess)

For the first time the server won't start as the installation will be still ongoing. So wait for the installation to finish and in the `Run Server` terminal tab type `. startserver.sh` or simply bring back this command with the up arrow and now the server will start ok.

You can also set the server URI in https://gitpod.io/variables . Create a variable `LIATOMIC_URI` and set it to the web page url as opened by GitPod for the server, without the trailing slash and change protocol to `http`. The startserver script will export this variable as `URI` so that redirect for oauth will be correct.

Example `LIATOMIC_URL`:

`http://8080-amber-reindeer-qu3afegt.ws-eu25.gitpod.io`

### Deploy to Heroku

Create a Heroku app ( in the example we will assume the app name is `atomiconly` ). Then issue the following commands in Heroku CLI to set the necessary buildpacks

```
heroku buildpacks:set heroku/python --app atomiconly
heroku buildpacks:add --index 1 heroku/nodejs --app atomiconly
```

In Heroku UI set config var `URI` to the app url without trailing slash ( `http://atomiconly.herokuapp.com` in our case ) and set `MONGO_HOST` to a MongoDb connect URI that has credentials included.

### Heroku config vars
`URI` set it to your app url example: http://atomiconly.herokuapp.com
`MONGO_HOST` set it to your mongo database url
`DEV` set it false to remove dev
`FERNET_KEY` setup this if you want fishnet
`ADMINS` set it to names of the players that you want to make tournaments  example:Raviharav SriMethan
`TOURNAMENT_DIRECTORS` set it to the names of players that that can make special games like host a game for others

### How to give titles to players
go to your mongodb database page and click on browse Collections
![Screenshot 2022-01-08 152659](https://user-images.githubusercontent.com/91451271/148640036-7fb953a9-0286-4248-9e05-616ef4c90a2a.png)
- now click on user
- now click edit icon on the players name that you want to add title 
- now add title:"the title you want to give" example title:"AGM"
- now click on update document
- now go to your heroku page and restart all dynos 
 **done!**
