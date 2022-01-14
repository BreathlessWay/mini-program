const EventBus = require("../utils/eventbus");

exports.userStore = new EventBus("user");

exports.SET_USER = "set_user";
