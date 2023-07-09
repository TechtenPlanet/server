const path = require("path");
const express = require("express");
const { ParseServer } = require("parse-server");
const ParseDashboard = require("parse-dashboard");

const DATABASE_URI = "mongodb://localhost:27017/testApp";
const MOUNT_PATH = "/1";
const PARSE_SERVER_URL = "http://localhost:1337/1";
const PORT =  1337;
const PARSE_APP_NAME = "testApp";
const PARSE_APP_ID = "248180b4-e828-4e7e-83cf-6240fa9cb41a";
const PARSE_MASTER_KEY = "771001e4-75f2-4ad7-8dd6-185a8b8f2310";
const PARSE_JAVASCRIPT_KEY = "b3a0062a-f60c-4fc9-9be9-53a94887230b";
const PARSE_DASHBOARD_USER = "admin";
// The password is bycrypt encrypted. The following contains 'password'
// You can generate an encrypted password using parse-dashboard --createUser
const PARSE_DASHBOARD_PASS = "$2a$10$N9mfPZJfc.bqzZIdI9vNluSrUBpHjfZapDtCYg230VTrREGZd/8nS";
const CLOUD_CODE_MAIN = "cloud/main.js";

const dashboard_config = () => {
  return {
    apps: [
      {
        appName: PARSE_APP_NAME,
        serverURL: PARSE_SERVER_URL,
        appId: PARSE_APP_ID,
        masterKey: PARSE_MASTER_KEY,
      },
    ],
    users: [
      {
        user: PARSE_DASHBOARD_USER,
        pass: PARSE_DASHBOARD_PASS,
      },
    ],
    useEncryptedPasswords: true,
  };
};

const api = new ParseServer({
  databaseURI: DATABASE_URI,
  // allowClientClassCreation: false,
  appId: PARSE_APP_ID,
  masterKey: PARSE_MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: PARSE_SERVER_URL,
  javascriptKey: PARSE_JAVASCRIPT_KEY,

  // If you change the cloud/main.js to another path
  // it wouldn't work on SashiDo :( ... so Don't change this.
  cloud: CLOUD_CODE_MAIN,
  defaultACL: { currentUser: { read: true, write: true } },

  liveQuery: {
    classNames: ["TODO"],
  },
});

const dashboard = new ParseDashboard(dashboard_config());
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express();

// Serve the Parse API on the /parse URL prefix
app.use(MOUNT_PATH, api);
app.use("/dashboard", dashboard);

const httpServer = require("http").createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

