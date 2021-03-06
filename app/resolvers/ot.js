var fs = require('fs');

var textOT = require('ottypes').text
var gulf = require('gulf');
var text = fs.readFileSync(__dirname + '/../index.js', 'utf8');

var textarea = document.querySelector('textarea#doc');

// var doc = require('gulf-textarea')(textarea);
require('codemirror/mode/javascript/javascript');
var cm = require('codemirror').fromTextArea(textarea, {
  lineNumbers: true
});
var doc = require('gulf-codemirror')(cm);

module.exports = stream => {
  var textareaMaster = doc.masterLink();

  if (stream.server) {
    // master
    gulf.Document.create(new gulf.MemoryAdapter, textOT, text, (err, master) => {
      var slave1 = master.slaveLink();
      stream.pipe(slave1).pipe(stream);

      var slave2 = master.slaveLink();
      textareaMaster.pipe(slave2).pipe(textareaMaster);
    });
  } else {
    // slave
    textareaMaster.pipe(stream).pipe(textareaMaster);
  }
};
