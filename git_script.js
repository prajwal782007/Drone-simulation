const { execSync } = require('child_process');

try {
  console.log(execSync('git init').toString());
  console.log(execSync('git status').toString());
} catch (err) {
  console.error(err.message);
}
