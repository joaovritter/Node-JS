//import padrao
const fs = require ('fs') //file system

fs.readFile ('arquivo.txt', 'utf8', (err, data) => {
    if (err){
        console.log (err) //imprime erro
        return;
    }
    console.log(data) //imprime dados
    
});

