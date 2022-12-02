import prisma from '../../lib/prisma';

export default class UserRepository {
  constructor({users}) {
    this.prisma = prisma;
    this.users = users;
  }

  async createUsers() {
    this.users.forEach(async (data) => {
      await this.prisma.User.create({
        data
      });
    })
  }

  async getAllUsers() {
    await this.createUsers();
    const users = await this.prisma.User.findMany({});
    return JSON.stringify(users);
  }
}