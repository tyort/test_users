/* eslint-disable import/extensions */
import prisma from '../../lib/prisma.js';

export default class UserRepository {
  constructor({ users }) {
    this.prisma = prisma;
    this.mockUsers = users;
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

  async changeShowCheckbox(isShowing) {
    const item = await this.prisma.ShowUnchecked.findUnique({
      where: { id: 1 },
    });

    let isShow;

    if (item === null) {
      isShow = isShowing === 'not_determined';
    }

    if (item !== null && isShowing === 'not_determined') {
      isShow = item.isShow;
    }

    if (item !== null && isShowing === 'true') {
      isShow = true;
    }

    if (item !== null && isShowing === 'false') {
      isShow = false;
    }

    this.isShowUnchecked = await this.prisma.ShowUnchecked.upsert({
      where: { id: 1 },
      update: { isShow },
      create: { id: 1, isShow },
    });
  }

  async letChangeVisibility(isShowing) {
    await this.changeShowCheckbox(isShowing);
    if (this.isShowUnchecked.isShow) {
      await this.prisma.User.updateMany({
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

    return this.isShowUnchecked.isShow;
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

    return this.changedCheckboxes.map((user) => {
      let isVisible;

      if (!this.isShowUnchecked) {
        isVisible = true;
      }
      if (this.isShowUnchecked && !this.isShowUnchecked.isShow && !user[1]) {
        isVisible = false;
      }
      if (this.isShowUnchecked && this.isShowUnchecked.isShow) {
        isVisible = true;
      }

      return this.prisma.User.update({
        where: { id: Number(user[0]) },
        data: {
          isChecked: { set: user[1] },
          isVisible,
        },
      });
    });
  }

  async getAllUsers() {
    if (this.isShowUnchecked && this.isShowUnchecked.isShow) {
      this.dbUsers = await this.prisma.User.findMany({
        orderBy: {
          order: 'asc',
        },
        take: Number(this.limitCountUsers),
      });
    } else {
      this.dbUsers = await this.prisma.User.findMany({
        where: { isChecked: true },
        orderBy: {
          order: 'asc',
        },
        take: Number(this.limitCountUsers),
      });
    }
    // eslint-disable-next-line no-console
    console.log('Количество отображаемых пользоватлей:', this.limitCountUsers);
    return this.dbUsers;
  }
}
