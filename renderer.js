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

// each install will have

// file location (backup location) button to clear cache , button to remove location
// default backups

// TODO add tag based on filepath (LIVE/PTU/EPTU)

function getEnvFromPath(installPath) {
  const lastSlash = installPath.lastIndexOf("\\");
  return installPath.substring(lastSlash + 1);
}


// TODO make better rows
window.byecache.installs.get().then((res) => {
  const parentContainer = document.getElementById('installs-container');

  const template = document.getElementById('install-template');
  for (var install of res) {
    const cloned = template.cloneNode(true);
    cloned.classList.remove('w3-hide')

    const envSpan = cloned.querySelector('[data-kind="environment"]');
    envSpan.textContent = getEnvFromPath(install.location);


    const removeIcon = cloned.querySelector('[data-kind="remove-install"');
    removeIcon.addEventListener('click', (evt) => console.log(evt));
    // need to find elements and set the data and clicks n stuff

    // probably need to safe format paths for display but keep
    // the data safe
    // avocapture does this iirc
    //const rowData = document.createElement('span');
    //rowData.textContent = install.location;
    console.log(JSON.stringify(install))
    parentContainer.appendChild(cloned);
    //parentContainer.appendChild(rowData);
  }
});
