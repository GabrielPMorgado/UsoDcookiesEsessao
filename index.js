import express from 'express';
import path from 'path';
import session from 'express-session';

import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;
const app = express();

let listaUsuarios = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4', 
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 15 
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next(); //permitir que a requisição continue a ser processada
    }
    else{
        resposta.redirect('/login.html');
    }
}

app.use(express.static(path.join(process.cwd(), 'pagina')));

function cadastrarUsuario(requisicao, resposta) {
    const codico = requisicao.body.codico;
    const descricao = requisicao.body.descricao;
    const precoCusto = requisicao.body.precoCusto;
    const precoVenda = requisicao.body.precoVenda;
    const validade = requisicao.body.validade;
    const estoque = requisicao.body.estoque;
    const fabricante = requisicao.body.fabricante;

    // Aqui você implementa a lógica de cadastro do usuário
    if (codico && descricao && precoCusto && precoVenda && validade && estoque && fabricante) {
        listaUsuarios.push({
            codico: codico,
            descricao: descricao,
            precoCusto: precoCusto,
            precoVenda: precoVenda,
            validade: validade,
            estoque: estoque,
            fabricante: fabricante,
        });
        resposta.redirect('/listarUsuarios');
    } else {
        resposta.write(`<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <form method="POST" action='/cadastrarEmpressa'>
            <label for="cnpj">CNPJ:</label>
            <input type="text" id="cnpj" name="cnpj" value="${codico}" required>`);
        if (codico == "") {
            resposta.write(`
                            <div m-2 class="alert alert-danger" role="alert">
                                Por favor, informe o cnpj.
                            </div>
                `);
        }
        resposta.write(`
            <label for="razao_social">Razão Social ou Nome do Fornecedor:</label>
            <input type="text" id="razao_social" name="razao_social" placeholder="Moraes & irmãos Ltda" value="${descricao}" required>`);
        if (descricao == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe a razão social.
                                </div>`);
        }
        resposta.write(`<label for="nome_fantasia">Nome Fantasia:</label>
            <input type="text" id="nome_fantasia" name="nome_fantasia" placeholder="Loja do 1,99" value="${precoCusto}" required>`);
        if (precoCusto == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe o nome fantasia.
                                </div>`);
        }
        resposta.write(`<label for="endereco">Endereço:</label>
            <input type="text" id="endereco" name="endereco" value="${precoVenda}" required>`);
        if (precoVenda == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe o endereço.
                                </div>`);
        }
        resposta.write(`<label for="cidade">Cidade:</label>
            <input type="text" id="cidade" name="cidade" value="${validade}" required>`);
        if (validade == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe a cidade.
                                </div>`);
        }
        resposta.write(`<label for="uf">UF:</label>
            <input type="text" id="uf" name="uf" maxlength="2" value="${estoque}" required>`);
        if (estoque == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe sua região.
                                </div>`);
        }
        resposta.write(`<label for="cep">CEP:</label>
            <input type="text" id="cep" name="cep" value="${fabricante}" required>`);
        if (fabricante == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                    Por favor, informe o cep.
                                </div>`);
        }
        resposta.write(` 
            <div class="buttons">
                 <button type="submit">Cadastrar</button>
                 <button type="button" onclick="history.back()">Voltar</button>
             </div>
             </form>
             </body>
             <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
             </html>`);
        resposta.end();
    }
}

function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'Gab' && senha == '123'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        //resposta.write('<input type="button" value="Voltar" onclick="history.go(-1)"/>');
        resposta.end();
    }
}
app.post('/login', autenticarUsuario);

app.get('/login', (req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    //req.session.usuarioLogado = false;
    resp.redirect('/login.html');
});  
app.use(express.static(path.join(process.cwd(), 'publico')));
app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));
app.post('/cadastrarUsuario', usuarioEstaAutenticado, cadastrarUsuario);


function gerarPagina(requisicao, resposta) {
    let conteudoResposta = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resultado do cadastro das empresas</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
    </head>
    <body>
        <h1>Lista de Usuários</h1>
        <table class="table table-striped">
            <tr>
                <th>codico</th>
                <th>descricao</th>
                <th>precoCusto</th>
                <th>procoVenda</th>
                <th>Validade</th>
                <th>estoque</th>
                <th>Fabricante</th>
            </tr>`;

    for (let i = 0; i < listaUsuarios.length; i++) {
        conteudoResposta += `
            <tr>
                <td>${listaUsuarios[i].codico}</td>
                <td>${listaUsuarios[i].descricao}</td>
                <td>${listaUsuarios[i].precoCusto}</td>
                <td>${listaUsuarios[i].precoVenda}</td>
                <td>${listaUsuarios[i].validade}</td>
                <td>${listaUsuarios[i].estoque}</td>
                <td>${listaUsuarios[i].fabricante}</td>
            </tr>`;
    }

    conteudoResposta += `
        </table>
        <a href="/">Voltar</a>
        if (req.cookies.dataUltimoAcesso){
            resp.write('<p>');
            resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
            resp.write('</p>');
        }
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
    </body>
    </html>`;

    resposta.write(conteudoResposta);
    resposta.end();
}



app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});