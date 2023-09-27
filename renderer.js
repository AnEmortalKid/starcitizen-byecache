const deleteContainer = document.getElementById('delete-buttons');
const deletionButtons = deleteContainer.getElementsByTagName('button');

for (btn of deletionButtons) {
  btn.addEventListener('click', async () => {
    const scVersion = btn.dataset.scVersion
    const result = await window.cacheManager.delete(scVersion);
    console.log(JSON.stringify(result));
  });
}
