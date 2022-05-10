const pid = process.pid
import {createServer} from 'http'
const PORT = process.env.PORT || 8080

export const server = createServer((req,res) => {
    res.write('Hello Cluster ')

    res.end(`Handled by process ${pid}`)   
})

server
    .listen(PORT,'0.0.0.0')
    .once('listening',()=> console.log('Server Instance being handled by pid:',pid))

process.on('SIGTERM',()=>{
    console.log('Ending Server with pid', pid ,new Date().toISOString())
    server.close((err) => process.exit(0) )
})