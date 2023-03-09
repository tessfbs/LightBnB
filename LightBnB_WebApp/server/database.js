const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { query } = require('express');

const pool = new Pool({
  user: 'tessfbs',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// pool.query(`SELECT * FROM properties LIMIT 10;`).then(response => {console.log(response)}) //test connection


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }

const getUserWithEmail = (email) => {
  const queryString = `
    SELECT * FROM users
    WHERE email = $1;
  `;
  const values = [email]

   return pool
      .query(queryString, values)
      .then(result => {
        console.log(result.rows[0])
        if(email === result.rows[0].email){
          return result.rows[0]
        } else {
          return null
        }
      })
      .catch(error => {
        console.log(error)
        return null
      })

}

// getUserWithEmail('tristanjacobs@gmail.com')



exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }

const getUserWithId = (id) => {
  const queryString = `
  SELECT * FROM users
  WHERE id = $1;
`;
  const values = [id]

    
  return pool
  .query(queryString, values)
  .then(result => {
    console.log(result.rows[0])
    if(id === result.rows[0].id){
      return result.rows[0]
    } else {
      return null
    }
  })
  .catch(error => {console.log(error)})

}

// getUserWithId(2)


exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }

const addUser = (user) => {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
`;
  const values = [user.name, user.email, user.password]

    
  return pool.query(queryString, values)
      .then(result => {
        console.log(result.rows[0])
        return result
      })
      .catch(error => {console.log(error)})
}

// addUser({
//   name: 'tessfbs2',
//   email: 'tessfbs2@gmail.com',
//   password: '$2b$1222$L6fwIaBp6pK67rWHJee3COz.myYqA23oIwrs4VjvcruNDpWbpxH5C'
// })
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }


const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
