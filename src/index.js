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

        const id = uuid4()

        bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
            if (err) {
                return res.status(500).send('Erro ao criar usuário')
            }
        })
    
        // Registrando novo usuário
        const novoUsuario = { email, senha: senhaCriptografada };
        usuarios.push(novoUsuario);
        return res.status(201).send('Usuário registrado com sucesso.');
    });

//------------------LOGIN----------------------------------

app.post('/login', (req, res) => {
    const { email, password } = req.body

    const usuario = usuarios.find(usuario => usuario.email === email && usuario.password === password);

    if (!usuario) {
        return res.status(401).send('E-mail ou senha incorretos');
    }

    return res.status(200).send('Login bem-sucedido');
});

//-----------------------CRIAR RECADOS-------------------------

app.post('/menssagens', async (req, res) => {
    const { idUsuario, messagem } = req.body;

    const usuario = usuarios.find(usuario => usuario.id === idUsuario);
    if (!usuario) {
        return res.status(404).send('Usuário não encontrado');
    }

    const novoRecado = { idUsuario, contrudo };
    recados.push(novoRecado)

    res.status(201).send('Recado criado com sucesso')
});

app.get('/menssagem/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;

    const recadosUsuario = recados.filter((recado) => recado.idUsuario === idUsuario);

    return res.status(200).send(recadosUsuario);
});

app.listen(3333, () => console.log("Servidor rodando na porta 3333"))