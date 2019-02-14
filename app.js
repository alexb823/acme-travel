const express = require('express');
const html = require('html-template-tag');
const morgan = require('morgan');
const getAllUsersStayInfo = require('./db');

const app = express();

app.use(morgan('dev'));

// app.get('/', (req, res, next) => {
//   getAllUsersStayInfo()
//     .then(UsersStayInfo =>
//       res.send(UsersStayInfo)
//     )
//     .catch(next);
// });

app.get('/', (req, res, next) => {
  getAllUsersStayInfo()
    .then(UsersStayInfo =>
      res.send(
        html`
          <!DOCTYPE html>
          <html>
            <header>
              <title>Acme Hotels</title>
              <link
                rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css"
              />
            </header>
            <body>
              <div class="container">
                <!-- Page Header -->
                <h1 class="my-2">Acme Hotels</h1>

                <!-- List of users and their stays -->
                <ul class="list-group">
                  ${UsersStayInfo.map(user => {
                    return html`
                      <li class="list-group-item">
                        ${user.name}
                      </li>
                      <li class="list-group-item">
                        <ul class="list-group">
                          ${user.stays.map(stay => {
                            return html`
                              <li class="list-group-item">
                                ${stay.hotel.name} (${stay.days})
                              </li>
                            `;
                          })}
                        </ul>
                      </li>
                    `;
                  })}
                </ul>
              </div>
            </body>
          </html>
        `
      )
    )
    .catch(next);
});

module.exports = app;
