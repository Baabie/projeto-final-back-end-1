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

//------------------------REGISTRO----------------------------

let usuarios = [];
let mensagens = [];
let proximoRegistro = 1
let proximoId = 1


app.post('/registro', async (req, res) => {
    const { nome, email, password } = req.body;
// fazer essa merda de iD
    if (!nome || !email || !password) {
        return res.status(400).send('Por favor, preencha todos os campos');
    }

    // Verificando se o e-mail já está em uso
    const existirUsuario = usuarios.find(usuario => usuario.email === email);
    if (existirUsuario) {
        return res.status(400).send('Este e-mail já está em uso.');
    }


    // Hash da senha
    bcrypt.hash(password, 10, (err, senhaCriptografada) => {
        if (err) {
            return res.status(500).send('Erro ao criar usuário');
        }

        // Registrando novo usuário
        const novoUsuario = {
            id: proximoRegistro,
            nome: nome,
            email: email,
            password: senhaCriptografada
        };
        usuarios.push(novoUsuario);

        res.status(201).send(`Seja bem vindo ${nome}! Usuário registrado com sucesso.`);
    });
});

//------------------LOGIN----------------------------------

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const usuario = usuarios.find(usuario => usuario.email === email);

    if (!usuario) {
        return res.status(400).send('Insira um e-mail e uma senha válidos');
    }

    // Verifica a senha
    try {
        const senhaCorreta = await bcrypt.compare(password, usuario.password);

        if (senhaCorreta) {
            return res.status(200).send('Login bem-sucedido');
        } else {
            return res.status(400).send('Insira um e-mail e uma senha válidos');
        }
    } catch (error) {
        return res.status(500).send('Erro ao fazer login');
    }
});

//-----------------------CRIAR MENSAGENS-------------------------

app.post('/mensagens', async (req, res) => {
    const { idUsuario, mensagem } = req.body;


    const usuario = usuarios.find(usuario => usuario.id === parseInt(idUsuario));
    if (!usuario) {
        return res.status(404).send('Usuário não encontrado');
    }

    const novaMensagem = { 
        id: proximoId,
        idUsuario: idUsuario,
        mensagem: mensagem
    };
    mensagens.push(novaMensagem);

    res.status(201).send('Recado criado com sucesso')
});

app.get('/mensagens/:idUsuario', async (req, res) => {
    const idUsuario = Number(req.params);

    // Filtra as mensagens pelo id do usuário
    const mensagensUsuario = mensagens.filter(mensagem => mensagem.idUsuario === idUsuario);

    return res.status(200).json(mensagensUsuario);
});



//-------------------------- LER MENSAGENS --------------------------

app.get('/mensagem/:email', (req,res) => {
    const emailUsuario  = req.params.email;

    const usuario = usuarios.find(usuario => usuario.email === emailUsuario);

    if(!usuario) {
        return res.status(404).send('Email não encontradono sistema')
    }

    const usuarioMensagens = mensagens.filter(mensagem => mensagem.idUsuario == usuario.id)

    res.status(200).send(`Seja bem-vindo! ${JSON.stringify(usuarioMensagens)}`)
});



//-------------------------- ATUALIZAR MENSAGEM -----------------------

app.put('/mensagem/:id', (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao } = req.body;

    // Verifica se o id fornecido é um número válido
    if (isNaN(id) || id < 0 || id >= mensagens.length) {
        return res.status(400).send('Por favor, informe um ID válido da mensagem');
    }

    // Atualiza os dados da mensagem com base no id
    mensagens[id].titulo = titulo;
    mensagens[id].descricao = descricao;

    res.status(200).send(`Mensagem atualizada com sucesso! ${JSON.stringify(mensagens[id])}`);
});



//------------------------- DELETAR MENSAGEM ---------------------------

app.delete('/mensagem/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = mensagens.findIndex(mensagem => mensagem.id === id);

    if (index === -1) {
        return res.status(400).send('Mensagem não encontrada, verifique o ID');
    }

    mensagens.splice(index, 1);
    res.status(200).send(JSON.stringify({ mensagem: "Mensagem deletada com sucesso" }));
});


app.listen(3333, () => console.log("Servidor rodando na porta 3333"))
