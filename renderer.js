const btn320 = document.getElementById('btn-320')
btn320.addEventListener('click', () => {
  window.cacheManager.delete('3.20')
})