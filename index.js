/**
 * Created by v-navray on 07/26/18.
 */
var express = require('express')
var bodyParser = require('body-parser')
var admin = require('./fireStoreConfig/fireStoreAdmin');

var db = admin.firestore();


var app = express()
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send({
        user: "test"
    })
});



const getJobById = (req, res, next) => {
    var jobId = req.params.jobId;

    db.collection('jobs')
        .doc(jobId)
        .get()
        .then(doc =>{
            res
                .status(200)
                .send(
                    {
                        id: doc.id,
                        job: doc.data()
                    });
        })
        .catch( e =>{
                res.send(e).status(403)
            }
        )
}


app.get('/jobs/:jobId', (req, res) =>{
    getJobById(req, res);
});



app.post('/jobs', function (req, res) {
    var job = req.body.job;
    var newJobRef = db.collection('jobs').doc();
    var setJob = newJobRef.set(job);


    newJobRef.get()
        .then(doc =>{
            res
                .status(200)
                .send(
                    {
                        id: doc.id,
                        job: doc.data()
                    });
        })
        .catch( e =>{
                res.send(e).status(403)
            }
        )
});



app.put('/jobs/:jobId',(req, res, next) =>{

    var jobId = req.params.jobId;

   var updatedJob = db.collection('jobs')
        .doc(jobId)
        .update({
            'slides':[{test:123}, {test:124}, {test:125}]
        })
       .then((data)=>{
          getJobById(req, res, next);
       })
});


app.listen(3000);