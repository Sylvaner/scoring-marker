/* eslint-disable no-undef */
const Application = require('spectron').Application;
const electronPath = require('electron');
const path = require('path');

let app;

beforeEach(() => {
  app = new Application({
    path: electronPath,

    args: [path.join(__dirname, '../')]
  });

  return app.start();
}, 15000);

afterEach(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

test('Displays App windows', async function () {
  const windowCount = await app.client.getWindowCount();

  expect(windowCount).toBe(2);
});
