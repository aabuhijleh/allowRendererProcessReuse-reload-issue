import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  document.getElementById("readdirBtn").addEventListener("click", async () => {
    await ipcRenderer.invoke("createWindow");
    console.log("before readdir");
    fs.readdir(path.dirname(process.execPath), async (err, items) => {
      console.log("readdir", err, items); // never reached after reload
      await ipcRenderer.invoke("closeWindow");
    });
  });
});
