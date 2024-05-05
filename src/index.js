import express from 'express'
import cors  from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())

app.use(express.json())

//----------------------- ROTA / -----------------------------------

app.get('/', (req, res) => {
    res.status(200).send('Bem vindo à aplicação.')
});

//------------------------PESSOA USUÁRIA----------------------------

const usuarios = [];
const mensagens = [];
const mensagem = [];

app.post('/registro', async (req, res) => {
        const { nome, email, password } = req.body;

        if(!nome || !email || !password) {
            return res.status(400).send('Por favor, preencha todos os campos')
        }

         // Verificando se o e-mail já está em uso
        const existirUsuario = usuarios.find(usuario => usuario.email === email);
        if (existirUsuario) {
        return res.status(400).send('Este e-mail já está em uso.');
        }

        // Gerando um ID único para o novo usuário (ultilizando um UUID)
        const { v4: uuidv4 } = req('uuid');
        
        const id = uuidv4();

        bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
            if (err) {
                return res.status(500).send('Erro ao criar usuário')
            }
        })
    
        // Registrando novo usuário
        const novoUsuario = { email, senha: senhaCriptografada };
        usuarios.push(novoUsuario);
        return res.status(201).send(`Seja bem vindo ${nome}! usuário registrado com sucesso.`);
    });

//------------------LOGIN----------------------------------

app.post('/login', (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).send('Insira um e-mail e uma senha válidos')
    }
    const usuario = usuarios.find(usuario => usuario.email === email && usuario.password === password);

    if (!usuario) {
        return res.status(401).send('E-mail ou senha incorretos');
    }

    return res.status(200).send('Login bem-sucedido');
});

//-----------------------CRIAR RECADOS-------------------------

app.post('/mensagens', async (req, res) => {
    const { idUsuario, mensagem } = req.body;

    const usuario = usuarios.find(usuario => usuario.id === idUsuario);
    if (!usuario) {
        return res.status(404).send('Usuário não encontrado');
    }

    const novaMensagem = { idUsuario, mensagem };
    mensagens.push(novaMensagem)

    res.status(201).send('Recado criado com sucesso')
});

app.get('/mensagem/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;

    const mensagensUsuario = mensagens.filter((mensagem) => mensagem.idUsuario === idUsuario);

    return res.status(200).send(mensagensUsuario);
});


//-------------------------- LER MENSAGENS --------------------------

app.get('/mensagem/:email', (req,res) => {
    const emailUsuario = req.params.email;

    const usuario = usuarios.find(usuario => usuario.email === emailUsuario);
    if(!usuario) {
        return res.status(404).send('Email não encontradono sistema')
    }

    const usuarioMensagens = mensagens.filter(mensagem => mensagem.idUsuario === usuario.id)

    res.status(200).send(`Sejs bem-vindo! ${JSON.stringify(usuarioMensagens)}`)
});



//-------------------------- ATUALIZAR MENSAGEM -----------------------

app.put('/mensagem/:id', (req, res) => {
    const mensagemId = req.body.id;
    const { titulo, descricao } = req.body

    const mensagemIndex = mensagens.findIndex(mensagem => mensagem.id === mensagemId);

    if(mensagemIndex === -1) {
        return res.status(400).send('Por favor, informe um ID válido da mensagem')
    }

    mensagens[mensagemIndex].titulo = titulo;
    mensagens[mensagemIndex].descricao = descricao;

    res.status(200).send(`Mensagem atualizada com sucesso! ${JSON.stringify(mensagens[mensagemIndex])}`);
})

//------------------------- DELETAR MENSAGEM ---------------------------

app.delete('/mensagem/:id', (req, res) => {
    const { id } = req.params

    const index = mensagens.findIndex(mensagem => mensagem.id === id);

    if (index === -1) {
        return res.status(400).send('Mensagem não encontrada, verifique o ID')
    }

    mensagens.splice(index, 1)
    res.status(200).send(JSON.stringify({ Mensagem: "deletada com sucesso"}))

})

app.listen(3333, () => console.log("Servidor rodando na porta 3333"))