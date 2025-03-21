// ------ FILTERS SYNC WITH PYTHON CLIENT 06/10/2021 ------ //
const defaultBannedList = {
  name: 'Default',
  filters: [
    {
      condition: '<', value: '128', ftype: 'SIZE', scope: 'FILE',
    },

    // Folders and files filters
    {
      condition: 'starts', value: '.', ftype: 'NAME', scope: 'ALL',
    },

    // Vendor folders
    {
      condition: 'fullmatch', value: 'node_modules', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'vendor', ftype: 'NAME', scope: 'FOLDER',
    },

    // Folder filters
    {
      condition: 'ends', value: '.egg-info', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'nbproject', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'nbbuild', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'nbdist', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: '__pycache__', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'venv', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: '_yardoc', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'eggs', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'wheels', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: 'htmlcov', ftype: 'NAME', scope: 'FOLDER',
    },
    {
      condition: 'fullmatch', value: '__pypackages__', ftype: 'NAME', scope: 'FOLDER',
    },

    // Files filters
    {
      condition: 'fullmatch', value: 'gradlew', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'gradlew.bat', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'mvnw', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'mvnw.cmd', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'gradle-wrapper.jar', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'maven-wrapper.jar', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'thumbs.db', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'babel.config.js', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'license.txt', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'license.md', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'copying.lib', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'fullmatch', value: 'makefile', ftype: 'NAME', scope: 'FILE',
    },

    {
      condition: 'starts', value: '.asar', ftype: 'NAME', scope: 'FILE',
    },

    {
      condition: 'ends', value: 'news', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'authors', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: '-doc', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'changelog', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'config', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'copying', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'license', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'licenses', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'notice', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'readme', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'swiftdoc', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'texidoc', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'todo', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'version', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'ignore', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'manifest', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'sqlite', ftype: 'NAME', scope: 'FILE',
    },
    {
      condition: 'ends', value: 'sqlite3', ftype: 'NAME', scope: 'FILE',
    },

    {
      condition: '=', value: '.1', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.2', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.3', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.4', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.5', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.6', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.7', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.8', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.9', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ac', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.adoc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.am', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.asciidoc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.bmp', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.build', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.cfg', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.chm', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.class', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.cmake', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.cnf', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.conf', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.config', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.contributors', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.copying', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.crt', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.csproj', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.css', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.csv', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dat', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.data', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.doc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.docx', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dtd', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dts', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.iws', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.c9', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.c9revisions', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dtsi', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dump', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.eot', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.eps', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.geojson', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.gdoc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.gif', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.glif', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.gmo', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.gradle', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.guess', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.hex', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.htm', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.html', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ico', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.iml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.in', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.inc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.info', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ini', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ipynb', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.jpeg', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.jpg', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.json', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.jsonld', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.lock', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.log', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.m4', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.map', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.markdown', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.md', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.md5', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.meta', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.mk', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.mxml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.o', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.otf', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.out', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.pbtxt', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.pdf', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.pem', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.phtml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.plist', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.png', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.po', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ppt', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.prefs', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.properties', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.pyc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.qdoc', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.result', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.rgb', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.rst', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.scss', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sha', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sha1', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sha2', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sha256', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sln', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.spec', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sql', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.sub', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.svg', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.svn-base', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.tab', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.template', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.test', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.tex', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.tiff', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.toml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.ttf', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.txt', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.utf-8', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.vim', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.wav', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.whl', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.woff', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xht', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xhtml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xls', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xlsx', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xpm', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xsd', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.xul', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.yaml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.yml', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.wfp', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.editorconfig', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.dotcover', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.pid', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.lcov', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.egg', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.manifest', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.cache', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.coverage', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.cover', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.gem', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.lst', ftype: 'EXTENSION', scope: 'FILE',
    },
    {
      condition: '=', value: '.asar', ftype: 'EXTENSION', scope: 'FILE',
    },
  ],
};
export { defaultBannedList };
