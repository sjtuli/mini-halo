const getMiniProgramCode = require("./getMiniProgramCode/index");

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "getMiniProgramCode":
      return await getMiniProgramCode.main(event, context);
  }
};
