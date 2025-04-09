//modulos externos
import inquirer from 'inquirer';//permite criar perguntas interativas no terminal
import chalk from 'chalk';//adiciona cores e estilo no terminal
import fs from 'fs'//modulos internos
console.log("iniciamos o accounts")

operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'o que voce deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar Saldo',
            'Sacar',
            'Sair'
        ]
    },
    ]).then((answer) =>{ //then e catch = try e catch
        const action = answer['action']

        if(action === 'Criar conta'){
            createAccount()
            
        } else if(action === 'Depositar Saldo'){
            deposit()

        }else if(action === 'Consultar Saldo'){
            getAccountBalance()

        }else if(action === 'Sacar'){
            withdraw() //resgatar

        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.white('Obrigado por usar o accounts'))
            process.exit()
        }
        
    } )
    .catch((err)=>console.log(err)) //then armazena a resposta do usuario e catch é pra isolar o erro
}

//create account
function createAccount(){
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso banco'));
    console.log(chalk.green('Defina as opcoes da conta a seguir: '));
    buildAccount()
}

//creating account
function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta'
    }
]).then(answer =>{
    const accountName = answer['accountName'] //adiciona a resposta do usuario aqui
    console.info(accountName)

    if(!fs.existsSync('accounts')){ //cria a pasta de accounts
        fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${accountName}.json`)){ //verifica se a conta ja existe na pasta
        console.log(chalk.bgRed.black('Essa conta ja existe, escolha outra'))
        buildAccount(); //reinicia o processo
        return;
    }

    fs.writeFileSync(`accounts/${accountName}.json`,  //escreve no arquivo
                    '{"balance": 0}',
                    function (err){
                        console.log(err)
                        },

                    )

    console.log(chalk.green('Parabens sua conta foi criada'));
    operation()
}).catch(err=>{ console.log(err)

})
}


//depositing money
function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }
        //se existe:
        inquirer.prompt([
            {
                name: 'amount',
                message: 'quanto voce deseja depositar?',
            },
        ]).then((answer)=>{
            const amount = answer['amount']
            
            //add an amount 
            addAmount(accountName,amount)
            operation()
        }).catch(err=>console.log(err))

    }).catch(err => console.log(err))

}

//verify if account exists
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){ //procura o arquivo, se nao existe:
        console.log(chalk.bgRed.black('Esta conta nao existe, escolha outro nome!'))
        return false;
    }
    return true;


}
//adiciona saldo a conta, funcao executada no deposit
function addAmount(accountName, amount){
    const accountData = getAccount(accountName) //dados da conta atraves do getAccount

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) //transforma a string do balance em float e soma com o saldo atual da conta
    fs.writeFileSync(`accounts/${accountName}.json`, //puxa o arquivo
                    JSON.stringify(accountData), //transforma em string o json
                    function (err){console.log(err)})
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}


function getAccount(accountName){ //le o arquivo
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{encoding: 'utf8',flag:'r'})
return JSON.parse(accountJSON)
}


//show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer["accountName"]
        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance() //se nao existir reinicia a funcao
        }

        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`O saldo da sua conta de R$${accountData.balance}`))
        operation()
    }).catch(err=> console.log(err))

   

}
 //withdraw an amount from user account
function withdraw(){

    inquirer.prompt([
        {
            name:'accountName',
            message:'Qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer["accountName"]
        //verify if account exists
        if(!checkAccount(accountName)){
            return withdraw() //se nao existir reinicia a funcao
        }
        //se existe:
        inquirer.prompt([
            {
                name: 'amount',
                message: 'quanto voce deseja sacar?',
            },
        ]).then((answer)=>{
            const amount = answer['amount']
            removeAmount(accountName, amount)

        }).catch(err=>console.log(err))
    }).catch(err => console.log(err))      

}

function removeAmount (accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))
        return withdraw()
    }
    if (accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponivel!'))
        return withdraw()
    }    
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))

    operation()

}
