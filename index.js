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

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next(); 
    } else {
        resposta.redirect('/login.html');
    }
}

function cadastrarUsuario(requisicao, resposta) {
    const codigo = requisicao.body.codigo;
    const descricao = requisicao.body.descricao;
    const precoCusto = requisicao.body.precoCusto;
    const precoVenda = requisicao.body.precoVenda;
    const validade = requisicao.body.validade;
    const estoque = requisicao.body.estoque;
    const fabricante = requisicao.body.fabricante;

    if (codigo && descricao && precoCusto && precoVenda && validade && estoque && fabricante) {
        listaUsuarios.push({
            codigo: codigo,
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
            <title>Cadastro de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <h1>Cadastro de Produtos</h1>
            <form method="POST" action='/cadastrarProduto'>
                <label for="codigo">Código de Barras:</label>
                <input type="text" id="codigo" name="codigo" value="${codigo || ''}" required>`);
        if (!codigo) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe o código de barras.
                </div>
            `);
        }
        resposta.write(`
            <label for="descricao">Descrição do Produto:</label>
            <input type="text" id="descricao" name="descricao" value="${descricao || ''}" required>`);
        if (!descricao) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe a descrição do produto.
                </div>
            `);
        }
        resposta.write(`
            <label for="precoCusto">Preço de Custo:</label>
            <input type="number" id="precoCusto" name="precoCusto" value="${precoCusto || ''}" step="0.01" required>`);
        if (!precoCusto) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe o preço de custo.
                </div>
            `);
        }
        resposta.write(`
            <label for="precoVenda">Preço de Venda:</label>
            <input type="number" id="precoVenda" name="precoVenda" value="${precoVenda || ''}" step="0.01" required>`);
        if (!precoVenda) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe o preço de venda.
                </div>
            `);
        }
        resposta.write(`
            <label for="validade">Data de Validade:</label>
            <input type="date" id="validade" name="validade" value="${validade || ''}" required>`);
        if (!validade) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe a data de validade.
                </div>
            `);
        }
        resposta.write(`
            <label for="estoque">Quantidade em Estoque:</label>
            <input type="number" id="estoque" name="estoque" value="${estoque || ''}" required>`);
        if (!estoque) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe a quantidade em estoque.
                </div>
            `);
        }
        resposta.write(`
            <label for="fabricante">Nome do Fabricante:</label>
            <input type="text" id="fabricante" name="fabricante" value="${fabricante || ''}" required>`);
        if (!fabricante) {
            resposta.write(`
                <div class="alert alert-danger" role="alert">
                    Por favor, informe o nome do fabricante.
                </div>
            `);
        }
        resposta.write(`
            <div class="buttons">
                <button type="submit">Cadastrar Produto</button>
                <button type="button" onclick="window.history.back()">Voltar</button>
            </div>
            </form>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </body>
        </html>`);
        resposta.end();
    }
}

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario === 'admin' && senha === '123') {
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Falha ao realizar login</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 400px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .error-message {
                    color: #dc3545;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .link {
                    color: #007bff;
                    text-decoration: underline;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Falha ao realizar login</h1>
                <p class="error-message">Usuário ou senha inválidos!</p>
                <a href="/login.html" class="link">Voltar</a>
                <div id="lastAccess"></div>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const lastAccess = document.getElementById('lastAccess');
                    const lastAccessTime = '${requisicao.cookies.dataUltimoAcesso || ''}';
                    if (lastAccessTime) {
                        lastAccess.innerHTML = '<p>Seu último acesso foi em ' + lastAccessTime + '</p>';
                    }
                });
            </script>
        </body>
        </html>
        `);
        resposta.end();
    }
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

app.post('/formulario', usuarioEstaAutenticado, cadastrarUsuario);

app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarUsuario);

app.get('/listarUsuarios', usuarioEstaAutenticado, (req, resp) => {
    let conteudoResposta = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuários</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body>
        <h1>Lista de Produtos</h1>
        <table class="table table-striped">
            <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Preço de Custo</th>
                <th>Preço de Venda</th>
                <th>Validade</th>
                <th>Estoque</th>
                <th>Fabricante</th>
            </tr>`;

    for (let i = 0; i < listaUsuarios.length; i++) {
        conteudoResposta += `
            <tr>
                <td>${listaUsuarios[i].codigo}</td>
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
        <a href="/">Voltar</a>`;
    
    if (req.cookies.dataUltimoAcesso) {
        conteudoResposta += `
            <p>Seu último acesso foi em ${req.cookies.dataUltimoAcesso}</p>`;
    }

    conteudoResposta += `
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>
    </html>`;

    resp.send(conteudoResposta);
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
