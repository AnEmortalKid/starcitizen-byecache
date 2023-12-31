function getEnvFromPath(installPath) {
  const lastSlash = installPath.lastIndexOf("\\");
  return installPath.substring(lastSlash + 1);
}

function findKind(containerElement, kindValue) {
  return containerElement.querySelector(`[data-kind="${kindValue}"]`);
}

const alertContainer = document.getElementById("alert-container");
const alertMessage = document.getElementById("alert-message");

var alertTimeout;
function hideAlert() {
  alertContainer.classList.add("w3-hide");
  alertContainer.classList.remove("alert-success");
  alertContainer.classList.remove("alert-error");

  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
}
alertContainer.addEventListener("click", hideAlert);

function displayErrorAlert(message) {
  alertContainer.classList.add("alert-error");
  alertContainer.classList.remove("w3-hide");
  alertMessage.textContent = message;
}

function displaySuccessAlert(message) {
  alertContainer.classList.add("alert-success");
  alertContainer.classList.remove("w3-hide");
  alertMessage.textContent = message;
  alertTimeout = setTimeout(function () {
    hideAlert();
  }, 1500);
}

const parentContainer = document.getElementById("installs-container");
const template = document.getElementById("install-template");

function addInstallNode(install) {
  const installId = install.id;

  const cloned = template.cloneNode(true);
  cloned.classList.remove("w3-hide");
  cloned.id = installId;

  const envSpan = findKind(cloned, "environment");
  envSpan.textContent = getEnvFromPath(install.location);

  const removeIcon = findKind(cloned, "remove-install");
  removeIcon.addEventListener("click", () => removeInstall(installId));

  const locationInput = findKind(cloned, "install-location");
  locationInput.value = install.location;

  const trashcanIcon = findKind(cloned, "purge-install");
  trashcanIcon.addEventListener("click", async () => purgeInstall(installId));

  const backupInput = findKind(cloned, "backup-location");
  setBackupValue(backupInput, install.backup);

  const pickBackupIcon = findKind(cloned, "select-backup");
  pickBackupIcon.addEventListener("click", async () => selectBackup(installId));

  const removeBackupIcon = findKind(cloned, "remove-backup");
  removeBackupIcon.addEventListener("click", async () =>
    removeBackup(installId),
  );

  console.log(JSON.stringify(install));
  parentContainer.appendChild(cloned);
}

async function addInstall(path) {
  const filePath = await window.byecache.directory.select();
  console.log("[addInstall] selected path", filePath);

  // cancelled
  if (!filePath) {
    return;
  }

  const result = await window.byecache.installs.add(filePath);
  console.log("[addInstall] response", JSON.stringify(result));

  // succeeded and actually added
  if (result.success && result.data) {
    addInstallNode(result.data);
  }

  if (!result.success) {
    displayErrorAlert(result.error);
  }
}

async function removeInstall(id) {
  const node = document.getElementById(id);

  const result = await window.byecache.installs.remove(id);

  // todo check status
  node.parentNode.removeChild(node);
}

async function purgeInstall(id) {
  // todo get info to display ENV
  const result = await window.byecache.installs.purge(id);
  if (result.success) {
    displaySuccessAlert("USER directory purged.");
  }
}

function setBackupValue(backupInput, value) {
  const prettyValue = value ? value : "";
  backupInput.value = prettyValue;
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

const deleteShaders = document.getElementById("game-shaders");
deleteShaders.addEventListener("click", async () => {
  const result = await window.cacheManager.deleteShaders();
  console.log(JSON.stringify(result));
});

const btn = document.getElementById("btn");
btn.addEventListener("click", addInstall);

// TODO change to on did load?
window.byecache.installs.get().then((res) => {
  for (var install of res) {
    addInstallNode(install);
  }
});
