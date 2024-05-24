import express from 'express';
import path from 'path';
import session from 'express-session';

const host = '0.0.0.0';
const porta = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinhaChave123',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15 
    }
}));

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next();
    } else {
        resposta.redirect('/login.html');
    }
}

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/outraPagina.html'); // Redireciona para outra página após o login
    } else {
        resposta.write(`<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Senha inválida</title>
        </head>
        <body>
            <script>
                alert('Usuário ou senha inválidos');
                window.location.href = '/login'; // Redireciona para a página de login
            </script>
        </body>
        </html>`);
        resposta.end();
    }
}

function cadastrarProduto(requisicao, resposta) {
    // Lógica para cadastrar o produto
    resposta.send('Produto cadastrado com sucesso!');
}

app.post('/login', autenticarUsuario);

app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'pagina')));
app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarProduto);

app.get('/listaDprodutos', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
    </head>
    <body>
        
    </body>
    </html>`);
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
