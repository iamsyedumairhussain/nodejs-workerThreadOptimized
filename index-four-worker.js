const express = require('express');
const app = express()
const { Worker } = require('worker_threads')

function createWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./four-worker.js');
        worker.on('message', (data) => {
            resolve(data)
        });
        worker.on('error', (data) => {
            reject('Error occured')
        });
    })
}

app.get('/blocking', async (req, res) => {
    const workerPromises = [];
    for(let i = 0; i < 4; i++){
        workerPromises.push(createWorker());
    }
    const thread_results = await Promise.all(workerPromises)
    const total  = thread_results[0] + thread_results[1] + thread_results[2] + thread_results[3];
    res.send(`Total ${total}`)


})

app.get('/non-blocking', (req, res) => {
    res.send('Non Blocking called')
})

app.listen(3000, () => {
    console.log('listening at 3000')
})
