const assistantList = document.querySelector(".assistant-list");
const [askMe, tellMe, commandMe] = [...assistantList.children];

askMe.onclick = () => { window.location.href = "../ask-me/index.html"; }
tellMe.onclick = () => { window.location.href = "../tell-me/index.html"; }
commandMe.onclick = () => { window.location.href = "../command-me/index.html"; }