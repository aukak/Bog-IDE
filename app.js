let editorInstance;
let outputElement;
let commandPalette;
let commandInput;
let commandList;
let isCommandPaletteOpen = false;

let fileListEl;
let currentFile = null;

// Virtual file system (persisted in localStorage)
let fileSystem = {};

// Default file
const defaultFileName = "main.bog";
const defaultFileContent = `suckin "std.bog"

bogfn main(): num {
    fen PI = 3.14
    mire(true) {
        gurgle("Hello Bog World!")
    } sludge {
        gurgle("Flag is false!")
    }
    drain 0
}`;

// Load files from localStorage or initialize with default
function loadFileSystem() {
    const storedFiles = localStorage.getItem('bogFileSystem');
    if (storedFiles) {
        fileSystem = JSON.parse(storedFiles);
    } else {
        fileSystem = {};
        fileSystem[defaultFileName] = defaultFileContent;
        saveFileSystem();
    }
}

// Save files to localStorage
function saveFileSystem() {
    localStorage.setItem('bogFileSystem', JSON.stringify(fileSystem));
}

// Load settings from localStorage
function loadSettings() {
    return JSON.parse(localStorage.getItem('bogSettings')) || {};
}

// Save settings to localStorage
function saveSettings(settings = {}) {
    const existingSettings = loadSettings();
    const updatedSettings = { ...existingSettings, ...settings };
    localStorage.setItem('bogSettings', JSON.stringify(updatedSettings));
    applyTheme(updatedSettings.defaultTheme || 'bog-dark'); // Apply the theme globally
    return updatedSettings;
}

window.addEventListener('DOMContentLoaded', () => {
    loadFileSystem();

    outputElement = document.getElementById('output');
    commandPalette = document.getElementById('commandPalette');
    commandInput = document.getElementById('commandInput');
    commandList = document.getElementById('commandList');
    fileListEl = document.getElementById('fileList');

    // Initialize Monaco Editor
    require(['vs/editor/editor.main'], function() {
        const savedSettings = loadSettings();
        editorInstance = monaco.editor.create(document.getElementById('editor'), {
            value: fileSystem[defaultFileName],
            language: 'bog',
            theme: savedSettings.defaultTheme || 'bog-dark',
            automaticLayout: true,
            minimap: { enabled: savedSettings.showMinimap !== undefined ? savedSettings.showMinimap : true },
            wordWrap: savedSettings.enableWordWrap ? 'on' : 'off',
            fontSize: savedSettings.fontSize || 14,
            lineNumbers: 'on'
        });
        currentFile = defaultFileName;
        highlightSelectedFile();
        applyTheme(savedSettings.defaultTheme || 'bog-dark');
    });

    // Event Listeners
    document.getElementById('runButton').addEventListener('click', runBogCode);
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        const theme = e.target.value;
        monaco.editor.setTheme(theme);
        saveSettings({ defaultTheme: theme });
    });
    document.getElementById('commandPaletteButton').addEventListener('click', toggleCommandPalette);
    document.getElementById('newFileBtn').addEventListener('click', initiateNewFileCreation);
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    // Removed downloadBtn event listener since the button has been removed
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('infoBtn').addEventListener('click', toggleInfoPanel);
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('closeSettings').addEventListener('click', closeSettingsModal);
    document.getElementById('saveSettings').addEventListener('click', saveSettingsFromModal);

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            runCommand(commandInput.value);
        }
    });

    commandList.addEventListener('click', (e) => {
        const cmd = e.target.getAttribute('data-command');
        if (cmd) runCommand(cmd);
    });

    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+P to open command palette
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
            toggleCommandPalette();
        }
    });

    // Right-click context menu
    fileListEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const target = e.target.closest('li');
        if (target && !target.classList.contains('editing')) {
            const fileName = target.textContent;
            showContextMenu(e.clientX, e.clientY, fileName);
        }
    });

    document.addEventListener('click', (e) => {
        const contextMenu = document.getElementById('fileContextMenu');
        if (!contextMenu.contains(e.target)) {
            contextMenu.classList.add('hidden');
        }
    });

    const contextMenu = document.getElementById('fileContextMenu');
    contextMenu.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const fileName = contextMenu.getAttribute('data-file');
        if (action && fileName) {
            handleContextMenuAction(action, fileName);
            contextMenu.classList.add('hidden');
        }
    });

    // Draggable Vertical Divider
    const dividerVertical = document.getElementById('dividerVertical');
    dividerVertical.addEventListener('mousedown', initDragVertical);

    // Draggable Horizontal Divider
    const dividerHorizontal = document.getElementById('dividerHorizontal');
    dividerHorizontal.addEventListener('mousedown', initDragHorizontal);

    renderFileList();
});

// Apply theme globally using CSS variables
function applyTheme(themeName) {
    document.body.classList.remove('bog-dark', 'bog-light', 'swamp-green', 'bog-ocean', 'bog-grey', 'bog-highContrast');
    document.body.classList.add(themeName);
}

// Render file list in sidebar
function renderFileList() {
    fileListEl.innerHTML = '';
    for (let fname in fileSystem) {
        const li = document.createElement('li');
        li.textContent = fname;
        li.tabIndex = 0; // Make it focusable
        li.addEventListener('click', () => openFile(fname));
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                openFile(fname);
            }
        });
        fileListEl.appendChild(li);
    }
    highlightSelectedFile();
}

// Highlight the selected file in the list
function highlightSelectedFile() {
    Array.from(fileListEl.children).forEach(li => {
        li.classList.toggle('selected', li.textContent === currentFile);
    });
}

// Open a file in the editor
function openFile(fname) {
    if (!fileSystem[fname]) {
        alert(`File "${fname}" does not exist.`);
        return;
    }
    currentFile = fname;
    editorInstance.setValue(fileSystem[fname]);
    highlightSelectedFile();
}

// Run Bog code (mock)
function runBogCode() {
    const code = editorInstance.getValue();
    outputElement.innerText = mockBogRun(code);
    saveFile();
}

// Mock Bog code execution
function mockBogRun(code) {
    let lines = code.split('\n');
    let output = '';
    for (let line of lines) {
        let match = line.match(/gurgle\("([^"]+)"\)/);
        if (match) {
            output += match[1] + "\n";
        }
    }
    return output || "[No Output]";
}

// Toggle Command Palette
function toggleCommandPalette() {
    isCommandPaletteOpen = !isCommandPaletteOpen;
    commandPalette.classList.toggle('hidden', !isCommandPaletteOpen);
    if (isCommandPaletteOpen) {
        commandInput.focus();
    }
}

// Run Command from Command Palette
function runCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    switch (cmd) {
        case 'compile':
            outputElement.innerText = "Compiled successfully (mock).";
            break;
        case 'format':
            let formatted = editorInstance.getValue().replace(/\s+$/gm, '');
            editorInstance.setValue(formatted);
            outputElement.innerText = "Formatted code.";
            break;
        case 'togglecomment':
            toggleCommentOnCurrentLine();
            outputElement.innerText = "Toggled comment.";
            break;
        case 'lint':
            outputElement.innerText = "No lint issues found (mock).";
            break;
        case 'build':
            outputElement.innerText = "Build successful (mock).";
            break;
        case 'runtests':
            outputElement.innerText = "All tests passed (mock).";
            break;
        case 'showdocs':
            toggleInfoPanel();
            outputElement.innerText = "Toggled docs panel.";
            break;
        case 'togglelinenumbers':
            toggleLineNumbers();
            outputElement.innerText = "Toggled line numbers.";
            break;
        default:
            outputElement.innerText = `Unknown command: ${cmd}`;
    }
    toggleCommandPalette();
}

// Toggle comment on the current line
function toggleCommentOnCurrentLine() {
    let position = editorInstance.getPosition();
    let lineContent = editorInstance.getModel().getLineContent(position.lineNumber);
    if (lineContent.trim().startsWith('~~')) {
        let uncommented = lineContent.replace(/~~\s?/, '');
        editorInstance.executeEdits(null, [{
            range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
            text: uncommented
        }]);
    } else {
        let commented = '~~ ' + lineContent;
        editorInstance.executeEdits(null, [{
            range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
            text: commented
        }]);
    }
}

// Toggle line numbers in the editor
function toggleLineNumbers() {
    const currentOption = editorInstance.getOption(monaco.editor.EditorOption.lineNumbers);
    editorInstance.updateOptions({ lineNumbers: currentOption === 'on' ? 'off' : 'on' });
}

// Initiate Inline New File Creation
function initiateNewFileCreation() {
    // Prevent multiple inline creations
    if (fileListEl.querySelector('li.editing')) return;

    // Create a new list item with an input field at the end
    const li = document.createElement('li');
    li.classList.add('editing');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'NewFile.bog';
    li.appendChild(input);
    fileListEl.appendChild(li); // Insert at the end
    input.focus();

    // Handle input events
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawName = input.value.trim();
            if (rawName === '') {
                alert('File name cannot be empty.');
                return;
            }

            // Check if it already ends with '.bog'
            let fileName = rawName.endsWith('.bog') ? rawName : `${rawName}.bog`;

            // Validate: No additional dots before '.bog'
            const nameWithoutExtension = fileName.slice(0, -4);
            if (nameWithoutExtension.includes('.')) {
                alert('File name cannot contain dots before the .bog extension.');
                return;
            }

            // Check for invalid characters
            const invalidChars = /[\/\\?%*:|"<>]/;
            if (invalidChars.test(nameWithoutExtension)) {
                alert('File name contains invalid characters.');
                return;
            }

            // Check if file already exists
            if (fileSystem[fileName]) {
                alert('File already exists!');
                return;
            }

            // Create the file
            fileSystem[fileName] = `bogfn main(): num {\n    gurgle("New File")\n    drain 0\n}`;
            saveFileSystem();
            renderFileList();
            openFile(fileName);
        } else if (e.key === 'Escape') {
            // Remove the editing list item if escape is pressed
            li.remove();
        } else if (e.key === 'ArrowUp') {
            navigateFileList(input, 'up');
        } else if (e.key === 'ArrowDown') {
            navigateFileList(input, 'down');
        }
    });

    // Handle blur event to cancel creation if clicked outside
    input.addEventListener('blur', () => {
        // Remove the editing list item if it loses focus and no name was entered
        if (input.value.trim() === '') {
            li.remove();
        }
    });

    // Prevent clicking inside the input from closing it
    li.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Navigate File List with Arrow Keys
function navigateFileList(currentInput, direction) {
    const items = Array.from(fileListEl.querySelectorAll('li:not(.editing)'));
    if (items.length === 0) return;

    // Determine the current index
    let currentIndex = items.findIndex(li => li === currentInput.parentElement.previousElementSibling);
    if (currentIndex === -1) currentIndex = 0;

    if (direction === 'up') {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (direction === 'down') {
        currentIndex = (currentIndex + 1) % items.length;
    }

    items[currentIndex].focus();
}

// Handle File Upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.bog')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const fileName = file.name;

            // Check if file already exists
            if (fileSystem[fileName]) {
                alert('File already exists!');
                return;
            }

            // Create the file
            fileSystem[fileName] = content;
            saveFileSystem();
            renderFileList();
            openFile(fileName);
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid .bog file.');
    }

    // Reset the input value to allow uploading the same file again if needed
    event.target.value = '';
}

// Show custom context menu
function showContextMenu(x, y, fileName) {
    const menu = document.getElementById('fileContextMenu');
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.classList.remove('hidden');
    menu.setAttribute('data-file', fileName);
}

// Handle context menu actions
function handleContextMenuAction(action, fileName) {
    switch(action) {
        case 'newFile':
            initiateNewFileCreation();
            break;
        case 'renameFile':
            renameFilePrompt(fileName);
            break;
        case 'deleteFile':
            deleteFilePrompt(fileName);
            break;
        case 'downloadFile':
            downloadSpecificFile(fileName);
            break;
    }
}

// Rename a file
function renameFilePrompt(fileName) {
    let newName = prompt("Enter new file name:", fileName);
    if (newName === null) return; // User cancelled

    newName = newName.trim();
    if (newName === '') {
        alert('File name cannot be empty.');
        return;
    }

    // Check if it already ends with '.bog'
    let newFileName = newName.endsWith('.bog') ? newName : `${newName}.bog`;

    // Validate: No additional dots before '.bog'
    const nameWithoutExtension = newFileName.slice(0, -4);
    if (nameWithoutExtension.includes('.')) {
        alert('File name cannot contain dots before the .bog extension.');
        return;
    }

    // Check for invalid characters
    const invalidChars = /[\/\\?%*:|"<>]/;
    if (invalidChars.test(nameWithoutExtension)) {
        alert('File name contains invalid characters.');
        return;
    }

    // Check if file already exists
    if (fileSystem[newFileName] && newFileName !== fileName) {
        alert('File already exists!');
        return;
    }

    // Rename the file
    fileSystem[newFileName] = fileSystem[fileName];
    delete fileSystem[fileName];
    if (currentFile === fileName) {
        currentFile = newFileName;
        editorInstance.setValue(fileSystem[newFileName]);
    }
    saveFileSystem();
    renderFileList();
}

// Delete a file
function deleteFilePrompt(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        delete fileSystem[fileName];
        if (currentFile === fileName) {
            currentFile = null;
            const keys = Object.keys(fileSystem);
            if (keys.length > 0) {
                openFile(keys[0]);
            } else {
                editorInstance.setValue('');
            }
        }
        saveFileSystem();
        renderFileList();
    }
}

// Download a specific file
function downloadSpecificFile(fileName) {
    const content = fileSystem[fileName];
    const blob = new Blob([content], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

// Toggle Info Panel
function toggleInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.classList.toggle('hidden');
}

// Open Settings Modal
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('hidden');
    populateSettings();
}

// Close Settings Modal
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('hidden');
}

// Populate settings modal with current settings
function populateSettings() {
    const settings = loadSettings();
    document.getElementById('toggleMinimap').checked = settings.showMinimap !== undefined ? settings.showMinimap : true;
    document.getElementById('toggleWordWrap').checked = settings.enableWordWrap !== undefined ? settings.enableWordWrap : false;
    document.getElementById('fontSize').value = settings.fontSize || 14;
}

// Save settings from modal
function saveSettingsFromModal() {
    const showMinimap = document.getElementById('toggleMinimap').checked;
    const enableWordWrap = document.getElementById('toggleWordWrap').checked;
    const fontSize = parseInt(document.getElementById('fontSize').value, 10) || 14;

    // Validate font size
    if (fontSize < 12 || fontSize > 24) {
        alert('Font size must be between 12 and 24.');
        return;
    }

    const settings = { showMinimap, enableWordWrap, fontSize };
    saveSettings(settings);

    // Apply settings to editor
    editorInstance.updateOptions({
        minimap: { enabled: showMinimap },
        wordWrap: enableWordWrap ? 'on' : 'off',
        fontSize: fontSize
    });

    closeSettingsModal();
    alert("Settings saved!");
}

// Save current file to virtual file system and localStorage
function saveFile() {
    if (currentFile) {
        fileSystem[currentFile] = editorInstance.getValue();
        saveFileSystem();
    }
}

// Draggable Vertical Divider
let isDraggingVertical = false;
let startX, startWidth;

function initDragVertical(e) {
    isDraggingVertical = true;
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector('.sidebar')).width, 10);
    document.documentElement.addEventListener('mousemove', doDragVertical, false);
    document.documentElement.addEventListener('mouseup', stopDragVertical, false);
}

function doDragVertical(e) {
    if (!isDraggingVertical) return;
    const dx = e.clientX - startX;
    const newWidth = startWidth + dx;
    if (newWidth > 150 && newWidth < 500) { // Minimum and Maximum width
        document.querySelector('.sidebar').style.width = `${newWidth}px`;
    }
}

function stopDragVertical() {
    isDraggingVertical = false;
    document.documentElement.removeEventListener('mousemove', doDragVertical, false);
    document.documentElement.removeEventListener('mouseup', stopDragVertical, false);
}

// Draggable Horizontal Divider
let isDraggingHorizontal = false;
let startY, startHeight;

function initDragHorizontal(e) {
    isDraggingHorizontal = true;
    startY = e.clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(document.querySelector('.output-panel')).height, 10);
    document.documentElement.addEventListener('mousemove', doDragHorizontal, false);
    document.documentElement.addEventListener('mouseup', stopDragHorizontal, false);
}

function doDragHorizontal(e) {
    if (!isDraggingHorizontal) return;
    const dy = e.clientY - startY;
    const newHeight = startHeight + dy;
    if (newHeight > 100 && newHeight < 500) { // Minimum and Maximum height
        document.querySelector('.output-panel').style.height = `${newHeight}px`;
    }
}

function stopDragHorizontal() {
    isDraggingHorizontal = false;
    document.documentElement.removeEventListener('mousemove', doDragHorizontal, false);
    document.documentElement.removeEventListener('mouseup', stopDragHorizontal, false);
}
