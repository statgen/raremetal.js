const REGEX_EPACTS = new RegExp("(?:chr)?(.+):(\\d+)_?(\\w+)?/?([^_]+)?_?(.*)?");
const REGEX_REGION = new RegExp("(?:chr)?(.+):(\\d+)-(\\d+)");
module.exports = { REGEX_EPACTS, REGEX_REGION };
