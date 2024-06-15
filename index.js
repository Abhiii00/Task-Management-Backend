const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors');
const route = require('./src/route/route')
const config = require('./src/config/db.config')


const app = express()
dotenv.config();
const port = process.env.PORT || 8181;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', route)


async function startServer() {
    try {
        app.listen(port, () => {
            console.log("App listening on port %s", port);
        });
        await config.dbConnection();
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();