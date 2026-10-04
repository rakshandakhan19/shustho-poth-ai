const fs = require('node:fs');
const vm = require('node:vm');
const sandbox = {};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '..', 'ai.js'), 'utf8') + '\nglobalThis.api={analyzeCase};', sandbox);
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify(input.map(row => {
  const result = sandbox.api.analyzeCase(row.text);
  return { intent: result.intent, direct_matches: result.direct_matches, red_flags: result.red_flags.map(flag => flag.id), model_signal: result.model_signal };
})));
