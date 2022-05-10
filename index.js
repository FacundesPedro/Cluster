import {cpus} from 'os'
import cluster from 'cluster'

const runMainKernel = () => {
    const num_workers = cpus().length * 2
    console.log(`[Primary Process ${process.pid}]: Stating...`)
    console.log(`[Primary Process ${process.pid}]: Forking ${num_workers} Workers processes...\n \n`)

    startWorkers(num_workers)

    cluster.on('exit',(worker,code,signal) => {
        if(code !== 0 && !worker.exitedAfterDisconnect){
            console.log(`[Primary Process ${process.pid}]: Worker ${worker.process.pid} Died, Creating another one! `)
            cluster.fork()
        }
    })
}

const runWorkerKernel = async () =>{
    await import('./src/server.js')
}

cluster.isPrimary ? runMainKernel() : runWorkerKernel()

function startWorkers(NUM_WORKERS){
    for(let i=0;i<NUM_WORKERS;i++){
        cluster.fork()
    }
}