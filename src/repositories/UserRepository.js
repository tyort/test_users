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

  async setInitialOrder() {
    this.dbUsers = await this.prisma.User.findMany({});
    const idCounts = this.dbUsers.map((user) => user.id);

    const orderForDB = idCounts.reduce(
      (accumulator, currentValue) => `${accumulator}o${currentValue}`,
      ''
    );

    const orderItemFromDB = await this.prisma.Order.create({
      data: {
        order: orderForDB.slice(1),
      },
    });

    this.order = orderItemFromDB.order;
  }

  async setNewOrder(newOrder) {
    const oldOrder = this.order;
    this.order = `${newOrder}${oldOrder.slice(newOrder.length)}`;
    await this.prisma.Order.updateMany({
      data: {
        order: this.order,
      },
    });
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
