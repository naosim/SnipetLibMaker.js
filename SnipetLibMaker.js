// node SnipetLoader gists.json gists.js
var fs = require('fs');

var run = function(snipetList, callback) {
  var exec = require('child_process').exec;
  var download = function(url, callback) {
    exec('curl ' + url, function(err, stdout, stderr) {
      if (!err) {
        callback(stdout);
      } else {
        callback();
      }
    });
  };

  var index = 0;
  var loop = function() {
    if(index < snipetList.length) {
      var snipet = snipetList[index];
      index++;
      download(snipet.url, function(data){
        snipet.data = data;
        loop();
      });
    } else {
      onFinished(snipetList);
    }
  };

  var onFinished = function(snipetList) {
    var result = createScript(snipetList);
    callback(result);
  };

  var addIndent = function(text, indent) { return indent + text.split('\n').join('\n' + indent); };

  var createScript = function(snipetList) {
    var text = '';
    text += '(function(global) {\n';
    text += '  var snipet = (function() {\n';

    snipetList.forEach(function(snipet) {
      text += snipet.name ? '    // ' + snipet.name + '\n' : '';
      text += addIndent(snipet.data, '    ') + '\n';
    });
    text += '    return {\n';
    snipetList.forEach(function(snipet) {
      snipet.var.forEach(function(varName) {
        text += "      '" + varName + "': " + varName + ',\n';
      });

    });
    text += '    };\n';
    text += '  })();\n';
    text += '  if ("process" in global) module["exports"] = snipet;\n';
    text += '  global["snipet"] = snipet;\n';
    text += '})((this || 0).self || global);\n';
    return text;
  };

  loop();
};

// main
var filename = process.argv[2];
var outputFilename = process.argv[3] || filename.slice(0, filename.lastIndexOf('.')) + '.js';
var snipetList = JSON.parse(fs.readFileSync(filename, 'utf-8'));
run(snipetList, function(script) {
  console.log(script);
  fs.writeFileSync(outputFilename, script);
});
