const express = require ("express")
const app = express()
const port = 3000

app.get('/',(req,res)=>{ //requisicao e resposta
    res.send("Ola mundo")
})

app.listen (port, ()=>{
    console.log(`App rodando na porta: ${port}`)
})

