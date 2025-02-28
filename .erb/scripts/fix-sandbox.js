const fs = require('fs');
const path = require('path');

exports.default = function(context) {
  if (process.platform !== 'linux') return;

  const { appOutDir } = context;
  const chromeSandboxPath = path.join(appOutDir, 'chrome-sandbox');

  if (fs.existsSync(chromeSandboxPath)) {
    console.log('Setting chrome-sandbox permissions...');

    try {
      // Set SUID permissions
      fs.chmodSync(chromeSandboxPath, 0o4755);
      console.log('chrome-sandbox permissions set successfully');
    } catch (error) {
      console.error('Failed to set chrome-sandbox permissions:', error);
      console.log('NOTE: The packaging process may need to be run with sudo/root permissions');
    }
  }
};
