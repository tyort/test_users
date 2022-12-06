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

  // async setShowCheckbox(isShow) {
  //   if (isShow === 'not_determined') {
  //     this.isShowDB = await this.prisma.ShowUnchecked.findUnique({
  //       where: { id: 1 },
  //     });
  //   } else {
  //     this.isShowDB = await this.prisma.ShowUnchecked.upsert({
  //       where: { id: 1 },
  //       update: { isShow: Boolean(isShow) },
  //       create: { id: 1, isShow: Boolean(isShow) },
  //     });
  //   }

  //   return this.isShowDB.isShow;
  // }

  async setInitialVisability() {
    this.isShowDB = await this.prisma.ShowUnchecked.findUnique({
      where: { id: 1 },
    });
    return this.isShowDB ? this.isShowDB.isShow : false;
  }

  async letChangeVisibility() {
    if (this.isShowDB === null || this.isShowDB.isShow) {
      await this.prisma.User.updateMany({
        where: {
          OR: [{ isChecked: false }, { isChecked: true }],
        },
        data: {
          isVisible: true,
        },
      });
    } else {
      await this.prisma.User.updateMany({
        where: {
          isChecked: false,
        },
        data: {
          isVisible: false,
        },
      });
    }
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

  letChangeCheckboxes(changedCheckboxes) {
    this.changedCheckboxes = Array.from(new Map(changedCheckboxes));

    return this.changedCheckboxes.map((user) =>
      this.prisma.User.update({
        where: { id: Number(user[0]) },
        data: {
          isChecked: { set: user[1] },
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
