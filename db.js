const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL, { logging: false });

// For cloud9 db
// const db = new Sequelize('ubuntu', 'postgres', 'password', {
//   host: 'localhost',
//   dialect: 'postgres',
//   logging: false,
// });

//Define models
const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Hotel = db.define('hotel', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Stay = db.define('stay', {
  days: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

//Define associations
Stay.belongsTo(User);
Stay.belongsTo(Hotel);
User.hasMany(Stay);
Hotel.hasMany(Stay);

//Seed data
const syncAndSeed = () => {
  return db
    .sync({ force: true })
    .then(async () => {
      const moe = await User.create({ name: 'moe' });
      const larry = await User.create({ name: 'larry' });
      const curly = await User.create({ name: 'curly' });
      const sheraton = await Hotel.create({ name: 'sheraton' });
      const hilton = await Hotel.create({ name: 'hilton' });
      //Seed data for stay and create the many to many association
      await Promise.all([
        Stay.create({ days: 3, userId: moe.id, hotelId: sheraton.id }),
        Stay.create({ days: 4, userId: moe.id, hotelId: sheraton.id }),
        Stay.create({ days: 5, userId: moe.id, hotelId: hilton.id }),
        Stay.create({ days: 19, userId: larry.id, hotelId: sheraton.id }),
        Stay.create({ days: 4, userId: curly.id, hotelId: sheraton.id }),
        Stay.create({ days: 5, userId: curly.id, hotelId: hilton.id }),
      ]);
    })
    .catch(e => console.error(e));
};
const getAllUsersStayInfo = () => {
  return User.findAll({
    include: [
      {
        model: Stay,
        include: Hotel,
      },
    ],
  });
};

//Seed data
// const userNames = ['moe', 'larry', 'curly'];
// const hotelNames = ['sheraton', 'hilton'];
// const syncAndSeed = () => {
//     return db.sync({force: true})
//     .then(async () => {
//         const [moe, larry, curly] = await Promise.all([
//             userNames.map(name => User.create({ name }))
//         ]);
//         const [sheraton, hilton] = await Promise.all([
//             hotelNames.map(name => Hotel.create({ name }))
//         ]);
//         //Seed data for stay and create the many to many association
//         await Promise.all([
//             Stay.create({ days: 3, userId: moe.id, hotelId: sheraton.id }),
//             Stay.create({ days: 4, userId: moe.id, hotelId: sheraton.id }),
//             Stay.create({ days: 5, userId: moe.id, hotelId: hilton.id }),
//             Stay.create({ days: 19, userId: larry.id, hotelId: sheraton.id }),
//             Stay.create({ days: 4, userId: curly.id, hotelId: sheraton.id }),
//             Stay.create({ days: 5, userId: curly.id, hotelId: hilton.id })
//         ]);
//     })
//     .catch(e => console.error(e))
// }

syncAndSeed();

module.exports = getAllUsersStayInfo;
