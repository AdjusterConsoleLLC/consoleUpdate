const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const versionKeyPath = 'C:\\Users\\MechP\\oneDrive\\Desktop\\AdjusterConsoleDotCom\\tool\\Build\\versionKey.txt';
const htmlDir = 'C:\\Users\\MechP\\oneDrive\\Desktop\\AdjusterConsoleDotCom';
const now = new Date();
const date_time = now.getFullYear().toString() + pad(now.getMonth() + 1) + pad(now.getDate()) + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
let search_this = '';

function pad(n) {
    return n < 10 ? '0' + n : n.toString();
}

function updateHtmlFiles(directory) {
	const entries = fs.readdirSync(directory, { withFileTypes: true });
	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			updateHtmlFiles(entryPath);
		} else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
			replaceVersionKey(entryPath);
		}
	}
}

function replaceVersionKey(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const escapedSearchString = search_this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedSearchString, 'g');
        content = content.replace(regex, date_time);
        const tempFilePath = filePath + '.tmp';
        fs.writeFileSync(tempFilePath, content, 'utf8');
        fs.renameSync(tempFilePath, filePath);
    } catch (error) {
        console.error(`Error replacing version key in file ${filePath}:`, error);
        holdConsole();
    }
}

function updateIndexFile() {
    const indexSourceDir = 'C:\\Users\\MechP\\oneDrive\\Desktop\\AdjusterConsoleDotCom\\tool\\editIndex.html';
    const indexDestDir = 'C:\\Users\\MechP\\oneDrive\\Desktop\\AdjusterConsoleDotCom\\tool\\index.html';
    fsExtra.copySync(indexSourceDir, indexDestDir, { overwrite: true });
    let fileContent = fs.readFileSync(indexDestDir, 'utf8');
    let lines = fileContent.split('\n');
    const startLineIndex = lines.findIndex(line => line.includes('<!--'));
    if (startLineIndex !== -1) {
        lines.splice(startLineIndex, 1);
    }
    const endLineIndex = lines.findIndex(line => line.includes('-->'));
    if (endLineIndex !== -1) {
        lines.splice(endLineIndex, 1);
    }
    fs.writeFileSync(indexDestDir, lines.join('\n'), 'utf8');
}

if (fs.existsSync(versionKeyPath)) {
    search_this = fs.readFileSync(versionKeyPath, 'utf8').trim();
} else {
    console.error(`Error: ${versionKeyPath} does not exist.`);
    holdConsole();
}

updateHtmlFiles(htmlDir); // remove the second argument


try {
    fs.writeFileSync(versionKeyPath, date_time, 'utf8');
} catch (error) {
    console.error(`Error writing to versionKey.txt:`, error);
    holdConsole();
}

updateIndexFile();
console.log('WIN!!!!!');

function holdConsole(message = 'Press any key to exit...') {
	console.log(message);
	require('readline')
		.createInterface({ input: process.stdin, output: process.stdout })
		.question('', () => process.exit(0));
}
