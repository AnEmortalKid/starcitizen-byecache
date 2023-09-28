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

window.byecache.installs.get().then((res) => console.log(res));
