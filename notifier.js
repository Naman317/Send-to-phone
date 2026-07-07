const { exec } = require("child_process");

function askUser(fileName) {
  return new Promise((resolve) => {
    const psCommand = `
Add-Type -AssemblyName PresentationFramework
$result = [System.Windows.MessageBox]::Show(
  'Send "${fileName}" to phone?',
  'Download Complete',
  'YesNo',
  'Question'
)
if ($result -eq 'Yes') { exit 0 } else { exit 1 }
`;

    exec(`powershell -Command "${psCommand}"`, (error) => {
      // exit code 0 → Yes, exit code 1 → No
      resolve(!error);
    });
  });
}

module.exports = askUser;
