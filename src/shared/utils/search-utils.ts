const BANNED_LIST = new Set(["api", "assets", "bin", "build", "cmd", "com", "controller", "deploy", "deployments", "dockerfile", "docs", "githooks", "inc", "include", "install", "internal", "java", "lib", "libs", "main", "makefile", "meta-inf", "model", "package", "pkg", "pom", "resources", "scripts", "source", "src", "template", "templates", "test", "tests", "third_party", "3rd_party", "tools", "vendor", "view", "web-inf", "web"
  ,"packages", "release", "releases", "dist", "scripts", "unit", "type", "types", "yarn", "gem"]);

/**
 * Return a list of query terms by splitting the search query
 * @param querySearch The search query
 * @param regex The regex to split the query by. The default use same regex as the tokenizer
 */
const getTerms = (querySearch: string, regex = /[\W_]+/): string[] => {
  return querySearch.split(regex);
};

/**
 * Determine if a term to obfuscate is in the banned list
 * @param value term to obfuscate
 */
const isBanned = (value) => BANNED_LIST.has(value.toLowerCase());

const groupByFirstLetter = (arr: string[]): {[key: string]: string[]} => {
  const result: {[key: string]: string[]} = {};

  for (const item of arr) {
    const firstLetter = item[0].toUpperCase();
    if (!result[firstLetter]) {
      result[firstLetter] = [];
    }
    result[firstLetter].push(item);
  }

  // Sort the keys in ascending order and return the result object
  return Object.keys(result).sort().reduce((obj, key) => {
    obj[key] = result[key];
    return obj;
  }, {} as {[key: string]: string[]});
}

export { getTerms, isBanned, groupByFirstLetter };
