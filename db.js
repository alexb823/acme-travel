const Sequelize = require("sequelize");

const db = new Sequelize(process.DATABASE_URL);

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
        allowNull: false
    }
})

const Hotel = db.define('hotel', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Stay = db.define('stay', {
    
} )