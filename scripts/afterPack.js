const fs = require('node:fs');
const path = require('node:path');

exports.default = async function ({ appOutDir, packager }) {
  if (packager.platform.name !== 'mac') return;

  const product = packager.appInfo.productFilename;
  const frameworks = path.join(
    appOutDir,
    `${product}.app`,
    'Contents',
    'Frameworks'
  );

  const suffixes = ['', ' (GPU)', ' (Plugin)', ' (Renderer)'];

  for (const suffix of suffixes) {
    const oldName = `${product} Helper${suffix}.app`;
    const newName = `Electron Helper${suffix}.app`;
    const source = path.join(frameworks, oldName);
    const target = path.join(frameworks, newName);

    if (!fs.existsSync(source) || fs.existsSync(target)) continue;

    fs.renameSync(source, target);

    const macOS = path.join(target, 'Contents', 'MacOS');
    const oldBinary = path.join(macOS, `${product} Helper${suffix}`);
    const newBinary = path.join(macOS, `Electron Helper${suffix}`);

    if (fs.existsSync(oldBinary)) {
      fs.renameSync(oldBinary, newBinary);
    }
  }
};
