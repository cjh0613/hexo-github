var fs = require('hexo-fs');
var path = require('path');
var Promise = require('bluebird');
var nunjucks = require('nunjucks');

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

nunjucks.configure(__dirname);

hexo.extend.tag.register('github', function(args) {
  var user = args[0],
    repo = args[1],
    commit = args[2],
    autoExpand = args[3] === 'true',
    id = "badge-container-" + user + "-" + repo + "-" + commit;

  var payload = {
    user: user,
    repo: repo,
    commit: commit,
    autoExpand: autoExpand,
    id: id
  };

  return new Promise(function (resolve, reject) {
    nunjucks.render('tag.html', payload, function (err, res) {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}, {async: true});
