const express = require('express');
const html = require('html-template-tag');
const morgan = require('morgan');
const getAllUsersStayInfo = require('./db');

const app = express();

app.use(morgan('dev'));

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
                <h1 class="my-4">Acme Hotels</h1>

                <div class="col-12 col-lg-6">
                <!-- List of users -->
                <ul class="list-group">
                  ${UsersStayInfo.map(user => {
                    return html`
                      <li class="list-group-item bg-info text-white">
                        <h5>${user.name}</h5>
                      </li>
                      <li class="list-group-item">
                        <!-- List of stays for each user -->
                        <ul class="list-group">
                          ${user.stays.map(stay => {
                            return html`
                              <li class="list-group-item">
                                ${stay.hotel.name} (${stay.days} days)
                              </li>
                            `;
                          })}
                        </ul>
                      </li>
                    `;
                  })}
                </ul>
                </div>
              </div>
            </body>
          </html>
        `
      )
    )
    .catch(next);
});

app.get('/json', (req, res, next) => {
  getAllUsersStayInfo()
    .then(UsersStayInfo =>
      res.send(UsersStayInfo)
    )
    .catch(next);
});

module.exports = app;
