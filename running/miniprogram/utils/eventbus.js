import {
  validArrayParams,
  validFunctionParams,
  validObjectParams,
  validStringParams,
} from "./validParams";

export default class EventBus {
  constructor(prefix) {
    this.prefix = prefix;
  }

  prefix = "";

  listenMap = {};

  computeKey = (key) => {
    if (!validStringParams(key)) {
      throw new Error("事件名称错误！");
    }
    if (this.prefix && key.indexOf(this.prefix) === 0) {
      return key;
    }
    return this.prefix ? `${this.prefix}_${key}` : key;
  };

  hasKey = (key) => {
    return this.listenMap.hasOwnProperty(key);
  };

  on = (key, fun) => {
    try {
      key = this.computeKey(key);
      if (validFunctionParams(fun)) {
        if (!this.hasKey(key)) {
          this.listenMap[key] = {
            listenList: [],
            offlineStack: [],
          };
        }
        this.listenMap[key].listenList.push(fun);
        const { offlineStack } = this.listenMap[key];
        let offlineFun = offlineStack.shift();
        while (offlineFun) {
          offlineFun();
          offlineFun = offlineStack.shift();
        }
      } else {
        throw new Error("注册的函数错误");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  trigger = (key, ...args) => {
    try {
      key = this.computeKey(key);
      const targetListenMap = this.listenMap[key];
      if (
        validObjectParams(targetListenMap) &&
        validArrayParams(targetListenMap.listenList)
      ) {
        // 已 on
        const { listenList } = targetListenMap;
        listenList.forEach((listen) => {
          listen.apply(this, args);
        });
      } else {
        // 未 on
        this.listenMap[key] = this.listenMap[key] || {
          listenList: [],
          offlineStack: [],
        };
        this.listenMap[key].offlineStack.push(() => {
          this.trigger(key, ...args);
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  off = (key, fun) => {
    try {
      key = this.computeKey(key);
      if (validFunctionParams(fun)) {
        let { listenList } = this.listenMap[key];
        if (validArrayParams(listenList)) {
          let _index = listenList.indexOf(fun);
          while (_index > -1) {
            listenList.splice(_index, 1);
            _index = listenList.indexOf(fun);
          }
          if (!listenList.length) {
            delete this.listenMap[key];
          } else {
            this.listenMap[key].listenList = listenList;
          }
        }
      } else {
        delete this.listenMap[key];
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  once = (key, fun) => {
    try {
      if (validFunctionParams(fun)) {
        const wrapFun = (...args) => {
          fun.apply(this, args);
          this.off(key, wrapFun);
        };
        this.on(key, wrapFun);
      } else {
        throw new Error("注册的函数错误");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  clear = () => {
    this.listenMap = {};
  };
}
