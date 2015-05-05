var fs = require('hexo-fs');
var path = require('path');

var assetBase = path.resolve(__dirname, "./static");

var files = [
  'style.css',
  'badge.js',
  'octicons/octicons.css',
  'octicons/octicons.eot',
  'octicons/octicons.svg',
  'octicons/octicons.ttf',
  'octicons/octicons.woff'
];

hexo.extend.generator.register('hexo-github', function(locals) {

  return files.map(function(f) {
    var p = 'hexo-github/' + f;
    var filePath = path.resolve(assetBase, f);

    return {
      path: p,
      data: function () {
        return fs.createReadStream(filePath);
      }
    }
  })


});

var repoUrlRegexp = /(?:http|https):\/\/github.com\/(.*)\/(.*)/;

function tryParseUrl(url) {
  var m = repoUrlRegexp.exec(url);
  if (m) {
    return {
      user: m[1],
      repo: m[2]
    }
  }
}

function generateSnippet(user, repo, commit, autoExpand, width) {
  var id = "badge-container-" + user + "-" + repo + "-" + commit;
  var src = [
    '<div id="' + id + '" style="width: ' + (width ? width : '300px') + '"></div>',
    '<script src="/hexo-github/badge.js"></script>',
    '<script type="text/javascript">',
    '  loadStyle("/hexo-github/style.css");',
    '  loadStyle("/hexo-github/octicons/octicons.css");',
    '  new Badge("#' + id + '", "' + user + '", "' + repo + '", "' + commit + '", ' + autoExpand + ')',
    '</script>'
  ].join("");
  return src;
}

hexo.extend.tag.register('github', function(args) {
  return generateSnippet(args[0], args[1], args[2], args[3] === 'true', args[4]);
});
