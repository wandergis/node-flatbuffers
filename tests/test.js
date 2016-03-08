var child_process = require('child_process');
var flatbuffers = require('../src/index');
var assert = require('assert');
var fs = require('fs');

function checkSame(name, expectedFile, string) {
  console.log('checking:', name);
  var diff = child_process.spawnSync('diff', [expectedFile, '/dev/stdin'], {input: string}).stdout.toString();

  if (diff !== '') {
    console.log(diff);
    console.log('check failed:', name);
    process.exit(1);
  }
}

function checkCompiledExampleSchema(compiled) {
  // Check buffer parsing
  var parsed = compiled.parse(fs.readFileSync(__dirname + '/example_input.example'));
  checkSame('buffer parsing', __dirname + '/example_output.json', JSON.stringify(parsed, null, 2));

  // Check buffer generation
  var generated = compiled.generate(JSON.parse(fs.readFileSync(__dirname + '/example_input.json', 'utf8')));
  var parsed = compiled.parse(generated);
  checkSame('buffer generation', __dirname + '/example_output.json', JSON.stringify(parsed, null, 2));
}

function main() {
  // Check support for different types
  var binarySchema = fs.readFileSync(__dirname + '/example.bfbs');
  var parsedSchema = flatbuffers.parseSchema(binarySchema);
  checkSame('schema parsing', __dirname + '/example.json', JSON.stringify(parsedSchema, null, 2));
  checkCompiledExampleSchema(flatbuffers.compileSchema(parsedSchema));
  checkCompiledExampleSchema(flatbuffers.compileSchema(binarySchema));

  // Check unicode serialization
  var unicodeSchema = fs.readFileSync(__dirname + '/unicode.bfbs');
  var unicodeData = JSON.parse(fs.readFileSync(__dirname + '/unicode.json', 'utf8'));
  var compiled = flatbuffers.compileSchema(unicodeSchema);
  var parsed = compiled.parse(compiled.generate(unicodeData));
  checkSame('unicode serialization', __dirname + '/unicode.json', JSON.stringify(parsed, null, 2));

  console.log('all tests pass');
}

main();
