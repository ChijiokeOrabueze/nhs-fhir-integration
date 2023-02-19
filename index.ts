import express, { Application } from 'express';


const env = process.env.NODE_ENV;

const app: Application = express();



app.use(express.json());

const appId = "a3e29d55-3f7a-452e-b484-bf9fd8c8c932";
const apiKey = "0SIPQYEnd3kz620kGpYAkvVeZaG7iupO";
const apiSecret = "wperGRy6oQFVvOHX";

const generateAndSignJwt = () => {

    
}
app.get("/", (req, res) => {
    console.log("hi")
})



const init = async () => {


    app.listen(1313, () => {
        console.log('app started');
    })
};

init();
