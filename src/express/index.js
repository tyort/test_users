import express from "express"
import UserRepository from "../repositories/UserRepository.js"
import {users} from "../../mock/users.js"

const userRepository = new UserRepository({users})

const app = express();
const PORT = 3002;

app.get('/', async (req, res) => {
  const data = await userRepository.getAllUsers();
  res.json(data);
})

app.get('/create-users', async (req, res) => {
  const data = await userRepository.createUsers();
  res.send('Пользователи созданы');
})

app.listen(PORT, () => {
  console.log('ghbdtn')
});