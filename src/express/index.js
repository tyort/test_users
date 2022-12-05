/* eslint-disable import/extensions */
import cors from 'cors';
import express from 'express';
import { users } from '../../mock/users.js';
import UserRepository from '../repositories/UserRepository.js';

const userRepository = new UserRepository({ users });

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3002;

app.get('/create-users', async (req, res) => {
  await userRepository.createUsers();
  res.send('Пользователи созданы');
});

app.get('/', async (req, res) => {
  userRepository.setLimitCountUsers(req.query.limit);
  const data = await userRepository.getAllUsers();
  res.json(data);
});

app.post('/', async (req, res) => {
  try {
    await Promise.all(userRepository.letChangeOrders(req.body));
    res.send('Все юзеры обновлены');
  } catch (e) {
    console.log(e.message);
  }
});

app.post('/checkedboxes', async (req, res) => {
  try {
    await Promise.all(userRepository.letChangeCheckboxes(req.body));
    res.send('Все чекбоксы обновлены');
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(PORT);
