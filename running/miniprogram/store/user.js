import EventBus from "../utils/eventbus";

export const userStore = new EventBus("user");

export const SET_USER = "set_user";
