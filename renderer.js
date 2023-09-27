const btn320 = document.getElementById('btn-320')
btn320.addEventListener('click', async () => {
  const result = await window.cacheManager.delete('3.20');
  console.log(result);
})