import prisma from '../../lib/prisma.js';

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

  async letChangeChekedUsers(data) {
    // data.forEach(async (value, key) => {
    //   await prisma.User.update({
    //     where: { id: 1 },
    //     data: { email: 'alice@prisma.io' },
    //   })
    // });
    for (const [key, value] of data) {
      console.log(`${key} = ${value}`);
    }
  }

  async getAllUsers() {
    const users = await this.prisma.User.findMany({});
    return users;
  }
}