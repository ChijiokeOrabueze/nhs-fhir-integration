import express, { Application } from 'express';


const env = process.env.NODE_ENV;

const app: Application = express();



app.use(express.json());

app.get("/", (req, res) => {
    console.log("hi")
})



const init = async () => {


    app.listen(1313, () => {
        console.log('app started');
    })
};

init();
