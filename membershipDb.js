const Sequelize = require("sequelize");

// const db = new Sequelize(process.env.DATABASE_URL)
// const db = new Sequelize('postgres://localhost/membership_db')

// For cloud9 db
const db = new Sequelize('ubuntu', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Role = db.define('role', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Membership = db.define('membership', {
  isPrimary: Sequelize.BOOLEAN
});

Membership.hook('beforeSave', (membership) => {
  if (!membership.userId || !membership.roleId) {
    throw new Error('you need both userId and roleId')
  }
})

Membership.belongsTo(Role);
Membership.belongsTo(User);
User.hasMany(Membership);
Role.hasMany(Membership);

const userNames = ['moe', 'larry', 'curly'];
const roleNames = ['admin', 'hr', 'engineering'];

const syncAndSeed = () => {
  return db.sync({ force: true })
    .then(async() => {
      const [moe, larry, curly] = await Promise.all(userNames.map(name => User.create({ name })));
      const [admin, hr, engineering] = await Promise.all(roleNames.map(name => Role.create({ name })));

      await Promise.all([
        Membership.create({ userId: moe.id, roleId: admin.id }),
        Membership.create({ userId: moe.id, roleId: engineering.id }),
        Membership.create({ userId: larry.id, roleId: engineering.id })
      ]);

      return User.findOne({
        where: {
          name: 'moe'
        },
        include: [{
          model: Membership,
          include: [
            Role
          ]
        }]
      });
    })
    .then(moe => {
      // console.log(moe.get());
      // moe.memberships.forEach(membership => console.log(membership.get()));
      moe.memberships.forEach(membership => console.log(membership.role.get()));

      return Role.findOne({
        where: {
          name: 'engineering'
        },
        include: [{
          model: Membership,
          include: [
            User
          ]
        }]
      })
    })
    .then(role => {
      console.log('*********************\n*********************');
      role.memberships.forEach(membership => console.log(membership.user.get()))
    })
};

syncAndSeed();
