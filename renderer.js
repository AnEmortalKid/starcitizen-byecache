function getEnvFromPath(installPath) {
  const lastSlash = installPath.lastIndexOf("\\");
  return installPath.substring(lastSlash + 1);
}

function findKind(containerElement, kindValue) {
  return containerElement.querySelector(`[data-kind="${kindValue}"]`);
}

function removeInstall(id) {

}

function purgeInstall(id) {

}

function setBackupValue(backupInput, value) {
  const prettyValue = value ? value : ""
  backupInput.value = prettyValue
}

async function selectBackup(id) {
  const filePath = await window.byecache.directory.select();

  // nothing selected, don't clear
  if (!filePath) {
    return;
  }

  const result = await window.byecache.installs.setBackup(id, filePath);

  // TODO do the repainting of settings better?
  const parent = document.getElementById(id);
  const backupInput = findKind(parent, "backup-location");
  setBackupValue(backupInput, filePath);
}

async function removeBackup(id) {
  const result = await window.byecache.installs.removeBackup(id);

  const parent = document.getElementById(id);
  const backupInput = findKind(parent, "backup-location");
  setBackupValue(backupInput, null);
}

const deleteShaders = document.getElementById('game-shaders');
deleteShaders.addEventListener('click', async () => {
  const result = await window.cacheManager.deleteShaders();
  console.log(JSON.stringify(result));
});

const btn = document.getElementById('btn')

btn.addEventListener('click', async () => {
  const filePath = await window.byecache.directory.select()
  console.log('Selected dir', filePath);

  window.byecache.installs.add(filePath);
})


window.byecache.installs.get().then((res) => {
  const parentContainer = document.getElementById('installs-container');

  const template = document.getElementById('install-template');
  for (var install of res) {
    const installId = install.id;

    const cloned = template.cloneNode(true);
    cloned.classList.remove('w3-hide')
    cloned.id = installId

    const envSpan = findKind(cloned, "environment");
    envSpan.textContent = getEnvFromPath(install.location);

    const removeIcon = findKind(cloned, "remove-install");
    removeIcon.addEventListener('click', () => removeInstall(installId));

    const locationInput = findKind(cloned, "install-location");
    locationInput.value = install.location;

    const trashcanIcon = findKind(cloned, "purge-install");
    trashcanIcon.addEventListener('click', () => purgeInstall(installId))

    const backupInput = findKind(cloned, "backup-location");
    setBackupValue(backupInput, install.backup);

    const pickBackupIcon = findKind(cloned, "select-backup");
    pickBackupIcon.addEventListener('click', async () => selectBackup(installId));

    const removeBackupIcon = findKind(cloned, "remove-backup");
    removeBackupIcon.addEventListener('click', async () => removeBackup(installId));

    console.log(JSON.stringify(install))
    parentContainer.appendChild(cloned);
  }
});
