var certConf = {};
if (process.env.WIN_CERT_FILE) {
  certConf.certificateFile = process.env.WIN_CERT_FILE;
}
if (process.env.WIN_CERT_PASS) {
  certConf.certificatePassword = process.env.WIN_CERT_PASS;
}

// only allow both to be set to more easily debug issues
if (certConf.certificateFile || certConf.certificatePassword) {
  if (!certConf.certificateFile) {
    throw new Error("ForgeConfig: Specified pass but no cert file.");
  }
  if (!certConf.certificatePassword) {
    throw new Error("ForgeConfig: Specified a cert file but no password.");
  }
  console.log("[FORGE] > signing binary.");
} else {
  console.log("[FORGE] > not signing binary.");
}

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
