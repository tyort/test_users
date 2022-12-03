import cors from 'cors';
import express from "express";
import { users } from "../../mock/users.js";
import UserRepository from "../repositories/UserRepository.js";

const userRepository = new UserRepository({users})

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3002;

app.get('/', async (req, res) => {
  userRepository.setLimitCountUsers(req.query.limit)
  await userRepository.setAllUsersVisible();
  const data = await userRepository.getAllUsers();
  res.json(data);
})

app.post('/filter', async (req, res) => {
  await userRepository.setFilters(req.body);
  await userRepository.updateAllUsersByCheckbox();
  await userRepository.updateAllUsersBySearch();
  const data = await userRepository.getAllUsers();
  res.json(data);
})

app.get('/create-users', async (req, res) => {
  const data = await userRepository.createUsers();
  res.send('Пользователи созданы');
})

app.listen(PORT);