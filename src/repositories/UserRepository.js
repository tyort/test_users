import prisma from '../../lib/prisma.js';

export default class UserRepository {
  constructor({users}) {
    this.prisma = prisma;
    this.users = users;
    this.usersDB = [];
    this.isMarkedShowOnly = false;
    this.modifiedCheckboxes = null;
    this.usersOrder = null;
  }

  async createUsers() {
    this.users.forEach(async (data) => {
      await this.prisma.User.create({
        data
      });
    })
  }

  async updateAllUsersBySearch() {
    await this.prisma.User.updateMany({
      where: {
        AND: [
          {isVisible: true},
          {id: {notIn: this.userIdForVisual}}
        ]
      },
      data: {isVisible: false}
    });
  }

  async updateAllUsersByCheckbox() {
    if (this.isMarkedShowOnly) {
      await this.prisma.User.updateMany({
        where: {
          AND: [
            {isChecked: false},
            {isVisible: true}
          ]
        },
        data: {isVisible: false}
      });
    } else {
      await this.prisma.User.updateMany({
        where: {isVisible: false},
        data: {isVisible: true}
      });
    }

    for (const [id, isChecked] of this.modifiedCheckboxes) {
      let isVisible = true;

      if (this.isMarkedShowOnly && !isChecked) {
        isVisible = false;
      }

      await this.prisma.User.update({
        where: { id },
        data: { isChecked, isVisible },
      })
    }
  }

  async setFilters(data) {
    const {order, isMarkedShowOnly, modifiedCheckboxes, userIdForVisual} = data;
    this.isMarkedShowOnly = isMarkedShowOnly;
    this.modifiedCheckboxes = new Map(modifiedCheckboxes);
    this.userIdForVisual = userIdForVisual;
    this.usersOrder = order
  }

  async setAllUsersVisible() {
    await this.prisma.User.updateMany({
      data: {isVisible: true}
    });
  }

  async getAllUsers() {
    let users = await this.prisma.User.findMany({});

    if (this.usersOrder) {
      let allId = users.map((sad) => sad.id);
      console.log(this.usersOrder)
      console.log(allId)
      let order = Array.from(new Set([...this.usersOrder, ...allId]));
      console.log(order);
      users = users.map((_user, index, arr) => {
        return arr.find((item) => item.id === order[index])
      });
    }

    console.log(users);
    return users;
  }
}