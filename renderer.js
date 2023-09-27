const deleteShaders = document.getElementById('game-shaders');
deleteShaders.addEventListener('click', async () => {
  const result = await window.cacheManager.deleteShaders();
  console.log(JSON.stringify(result));
});