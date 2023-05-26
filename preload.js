const { contextBridge } = require('electron');
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type])
	}

	// eslint-disable-next-line no-new
	new CustomTitlebar({
		backgroundColor: TitlebarColor.fromHex('#1f1f1f'),
		menuPosition: 'left',
		titleAlignment: 'center',
		// enableMnemonics: false,
	})
})
contextBridge.exposeInMainWorld('api', {
	title: `Loading Productions`
})
