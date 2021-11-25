const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  console.debug(context);
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      page: event.path,
      scene: event.scene,
      is_hyaline: true,
      width: 280,
    });
    return result;
  } catch (err) {
    return err;
  }
};
