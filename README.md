# Récupération du projet

```
git clone 

cd my mySocialNetworkProject
```

# Installation

## Frontend
```
cd FRONT
npm install
```
## FICHIER .env (FRONT)


API_HOST = 
APP_HOST = 



## Backend
```
cd BACK
npm install
```
## FICHIER .env (BACK)


APP_PORT = 

DB_PASSWORD = 
DB_NAME = 
DB_USER = 

SIGN_TOKEN = "VOTRE SIGN SECRET"



## Base de données (BACK)
```
dans config/config.js

development: {
    username: "votre nom d'USER"
    password: "Votre PASSWORD",
    database:  "le nom de votre database",
    host: "127.0.0.1",
    dialect: "mysql"
  }

ENSUITE :

npm run config
```

# Démarrage (FRONT && BACK)
```
npm start
```

Le serveur est lancé sur le port 5000 (FRONT)
Le serveur est lancé sur le port 8030 (BACK)

