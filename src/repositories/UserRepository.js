import prisma from '../../lib/prisma.js';

export default class UserRepository {
  constructor({users}) {
    this.prisma = prisma;
    this.users = users;
    this.usersDB = [];
    this.isMarkedShowOnly = false;
    this.modifiedCheckboxes = null;
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
    const {isMarkedShowOnly, modifiedCheckboxes, userIdForVisual} = data;
    this.isMarkedShowOnly = isMarkedShowOnly;
    this.modifiedCheckboxes = new Map(modifiedCheckboxes);
    this.userIdForVisual = userIdForVisual;
  }

  async setAllUsersVisible() {
    await this.prisma.User.updateMany({
      data: {isVisible: true}
    });
  }

  async getAllUsers() {
    const users = await this.prisma.User.findMany({});
    this.usersDB = users;
    return users;
  }
}