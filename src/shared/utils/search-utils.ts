const BANNED_LIST = new Set(["api", "assets", "bin", "build", "cmd", "com", "controller", "deploy", "deployments", "dockerfile", "docs", "githooks", "inc", "include", "install", "internal", "java", "lib", "libs", "main", "makefile", "meta-inf", "model", "package", "pkg", "pom", "resources", "scripts", "source", "src", "template", "templates", "test", "tests", "third_party", "3rd_party", "tools", "vendor", "view", "web-inf", "web"]);

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

export { getTerms, isBanned };
