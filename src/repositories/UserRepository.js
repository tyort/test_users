/* eslint-disable import/extensions */
import prisma from '../../lib/prisma.js';

export default class UserRepository {
  constructor({ users }) {
    this.prisma = prisma;
    this.mockUsers = users;
    this.dbUsers = [];
    this.dbReorderedUsers = [];
    this.limitCountUsers = null;
    this.order = '';
  }

  async createUsers() {
    this.mockUsers.forEach(async (data) => {
      await this.prisma.User.create({
        data,
      });
    });
  }

  setLimitCountUsers(count) {
    this.limitCountUsers = count;
  }

  async getAllUsers() {
    const users = await this.prisma.User.findMany({
      take: Number(this.limitCountUsers),
    });
    this.dbUsers = users;
    // eslint-disable-next-line no-console
    console.log('Количество отображаемых пользоватлей:', this.limitCountUsers);
    return users;
  }
}
