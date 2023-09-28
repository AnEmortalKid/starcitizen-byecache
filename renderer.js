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

// TODO make better rows
window.byecache.installs.get().then((res) => {
  const parentContainer = document.getElementById('installs-container');
  for (var p of res) {
    // probably need to safe format paths for display but keep
    // the data safe
    // avocapture does this iirc
    const rowData = document.createElement('span');
    rowData.textContent = p;
    parentContainer.appendChild(rowData);
  }
});
