import express from 'express';
import path from 'path';

const host = '0.0.0.0';
const porta = 3000;
const app = express();



app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(process.cwd(), 'pagina')));

app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));


function usuarioEstaAutenticado(requisicao,resposta, next){
    if(usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect('/login.html');
    }

}


app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});