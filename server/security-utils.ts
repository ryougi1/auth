const nodeUtil = require("util");
const nodeCrypto = require("crypto");

export const randomBytes = nodeUtil.promisify(nodeCrypto.randomBytes);
