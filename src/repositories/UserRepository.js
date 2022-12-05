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
    this.mockUsers.forEach(async (user, index) => {
      await this.prisma.User.create({
        data: {
          ...user,
          order: index + 1,
        },
      });
    });
  }

  setLimitCountUsers(count) {
    this.limitCountUsers = count;
  }

  letChangeOrders(changedUsers) {
    this.changedUsers = changedUsers;
    const usersWithCurrentOrder = this.changedUsers.map((user, index) => ({
      ...user,
      order: index + 1,
    }));

    return usersWithCurrentOrder.map((user) =>
      this.prisma.User.update({
        where: { id: Number(user.id) },
        data: {
          order: { set: Number(user.order) },
        },
      })
    );
  }

  async getAllUsers() {
    const users = await this.prisma.User.findMany({
      orderBy: {
        order: 'asc',
      },
      take: Number(this.limitCountUsers),
    });

    this.dbUsers = users;
    // eslint-disable-next-line no-console
    console.log('Количество отображаемых пользоватлей:', this.limitCountUsers);
    return users;
  }
}
