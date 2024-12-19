// app.js

// Configure RequireJS for Monaco Editor
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

// Initialize variables
let editorInstance;
let outputElement;
let commandPalette;
let commandInput;
let commandList;
let isCommandPaletteOpen = false;

let fileListEl;
let currentFile = null;

// Virtual file system (persisted in localStorage)
// Structure: { name: { type: 'file', content: '...', language: 'bog'/'auk' } }
let fileSystem = {};

// Load files from localStorage or initialize with default
function loadFileSystem() {
    const storedFiles = localStorage.getItem('bogAukFileSystem');
    if (storedFiles) {
        fileSystem = JSON.parse(storedFiles);
    } else {
        // Initialize with a default structure
        fileSystem = {
            "main.bog": { type: 'file', content: `suckin "std.bog"

bogfn main(): num {
    fen count = 10
    mire(count > 5) {
        gurgle("Count is greater than 5")
    } sludge {
        gurgle("Count is 5 or less")
    }
    drain 0
}`, language: 'bog' },
            "styles.auk": { type: 'file', content: `fen-color: #ff0000
mire-background: #00ff00
~~ This is a comment ~~`, language: 'auk' }
        };
        saveFileSystem();
    }
}

// Save files to localStorage
function saveFileSystem() {
    localStorage.setItem('bogAukFileSystem', JSON.stringify(fileSystem));
}

// Load settings from localStorage
function loadSettings() {
    return JSON.parse(localStorage.getItem('bogAukSettings')) || {};
}

// Save settings to localStorage
function saveSettings(settings = {}) {
    const existingSettings = loadSettings();
    const updatedSettings = { ...existingSettings, ...settings };
    localStorage.setItem('bogAukSettings', JSON.stringify(updatedSettings));
    applyTheme(updatedSettings.defaultTheme || 'bog-dark'); // Apply the theme globally
    return updatedSettings;
}

// Apply theme to Monaco Editor
function applyTheme(theme) {
    if (monaco && monaco.editor) {
        monaco.editor.setTheme(theme);
    }
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
            value: '', // Initially empty
            language: 'bog', // Default language
            theme: savedSettings.defaultTheme || 'bog-dark',
            automaticLayout: true,
            minimap: { enabled: savedSettings.showMinimap !== undefined ? savedSettings.showMinimap : true },
            wordWrap: savedSettings.enableWordWrap ? 'on' : 'off',
            fontSize: savedSettings.fontSize || 14,
            lineNumbers: savedSettings.lineNumbers || 'on'
        });
        renderFileList();
        highlightSelectedFile();
    });

    // Event Listeners
    document.getElementById('runButton').addEventListener('click', runCode);
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        const theme = e.target.value;
        applyTheme(theme);
        saveSettings({ defaultTheme: theme });
    });
    document.getElementById('commandPaletteButton').addEventListener('click', toggleCommandPalette);
    document.getElementById('newFileBtn').addEventListener('click', () => initiateNewItemCreation('file'));
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
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
            const path = target.getAttribute('data-path');
            const type = target.getAttribute('data-type');
            showContextMenu(e.clientX, e.clientY, path, type);
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
        const path = contextMenu.getAttribute('data-path');
        const type = contextMenu.getAttribute('data-type');
        if (action && path) {
            handleContextMenuAction(action, path, type);
            contextMenu.classList.add('hidden');
        }
    });

    // Draggable Vertical Divider
    const dividerVertical = document.getElementById('dividerVertical');
    dividerVertical.addEventListener('mousedown', initDragVertical);

    // Draggable Horizontal Divider
    const dividerHorizontal = document.getElementById('dividerHorizontal');
    dividerHorizontal.addEventListener('mousedown', initDragHorizontal);

    // Enable Drag-and-Drop
    enableDragAndDrop();
});

// Helper Functions

// Get language based on file extension
function getLanguage(fileName) {
    if (!fileName) return 'bog';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'bog') return 'bog';
    if (ext === 'auk') return 'auk';
    return 'plaintext'; // Default to plaintext
}

// Get file content from the file system based on path
function getFileContent(fs, path) {
    if (!path) return '';
    const parts = path.split('/');
    let current = fs;
    for (let part of parts) {
        if (current[part]) {
            current = current[part];
        } else {
            return '';
        }
    }
    return current.type === 'file' ? current.content : '';
}

// Set file content in the file system
function setFileContent(fs, path, content) {
    const parts = path.split('/');
    let current = fs;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
            // For simplicity, all files are in root; folders removed
            current[part] = { type: 'folder', children: {} };
        }
        current = current[part].children;
    }
    const fileName = parts[parts.length - 1];
    if (current[fileName]) {
        current[fileName].content = content;
    } else {
        current[fileName] = { type: 'file', content: content, language: getLanguage(fileName) };
    }
    saveFileSystem();
}

// Get path from a DOM element
function getPath(element) {
    let path = [];
    while (element && element.id !== 'fileList') {
        if (element.tagName === 'LI') {
            path.unshift(element.getAttribute('data-path'));
        }
        element = element.parentElement;
    }
    return path.join('/');
}

// Render the file list with files only
function renderFileList() {
    fileListEl.innerHTML = '';
    traverseFileSystem(fileSystem, fileListEl, '');
}

// Traverse the file system recursively to build the file list
function traverseFileSystem(fs, parentEl, currentPath) {
    for (let name in fs) {
        const item = fs[name];
        if (item.type === 'file') {
            const li = document.createElement('li');
            li.textContent = name;
            li.setAttribute('data-path', currentPath ? `${currentPath}/${name}` : name);
            li.setAttribute('data-type', 'file');
            li.setAttribute('draggable', 'true');
            li.classList.add('file');
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                openFile(li.getAttribute('data-path'));
            });
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    openFile(li.getAttribute('data-path'));
                }
            });
            li.setAttribute('tabindex', '0'); // Make it focusable
            parentEl.appendChild(li);
        }
    }
}

// Highlight the selected file in the list
function highlightSelectedFile() {
    Array.from(fileListEl.querySelectorAll('li.file')).forEach(li => {
        li.classList.toggle('selected', li.getAttribute('data-path') === currentFile);
    });
}

// Open a file in the editor
function openFile(path) {
    if (!path) return;
    const content = getFileContent(fileSystem, path);
    if (content === '') {
        alert(`File "${path}" does not exist or is empty.`);
        return;
    }
    currentFile = path;
    editorInstance.setValue(content);
    editorInstance.updateOptions({ language: getLanguage(path) });
    highlightSelectedFile();
}

// Run code (mock implementation)
function runCode() {
    const code = editorInstance.getValue();
    const lang = getLanguage(currentFile);
    if (lang === 'bog' || lang === 'auk') {
        outputElement.innerText = mockRun(code, lang);
    } else {
        outputElement.innerText = "No executable code found.";
    }
    saveFile();
}

// Mock code execution for Bog and Auk
function mockRun(code, lang) {
    let output = '';
    if (lang === 'bog') {
        const lines = code.split('\n');
        for (let line of lines) {
            let match = line.match(/gurgle\("([^"]+)"\)/);
            if (match) {
                output += match[1] + "\n";
            }
        }
    } else if (lang === 'auk') {
        const lines = code.split('\n');
        for (let line of lines) {
            let match = line.match(/fen-([^:]+):\s*(.+)/);
            if (match) {
                const property = match[1];
                const value = match[2];
                output += `Property "${property}" set to "${value}"\n`;
            }
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
            runCode();
            break;
        case 'format':
            formatCode();
            break;
        case 'togglecomment':
            toggleCommentOnCurrentLine();
            break;
        case 'lint':
            lintCode();
            break;
        case 'runtests':
            runTests();
            break;
        case 'showdocs':
            toggleInfoPanel();
            break;
        case 'togglelinenumbers':
            toggleLineNumbers();
            break;
        default:
            outputElement.innerText = `Unknown command: ${cmd}`;
    }
    toggleCommandPalette();
}

// Example implementations of commands
function formatCode() {
    const content = editorInstance.getValue();
    const lang = getLanguage(currentFile);
    let formatted = content;
    if (lang === 'bog') {
        formatted = content.replace(/\s+$/gm, ''); // Simple trim trailing spaces
    } else if (lang === 'auk') {
        formatted = content.replace(/\s+$/gm, ''); // Similarly for Auk
    }
    editorInstance.setValue(formatted);
    outputElement.innerText = "Code formatted successfully.";
}

function toggleCommentOnCurrentLine() {
    let position = editorInstance.getPosition();
    let lineContent = editorInstance.getModel().getLineContent(position.lineNumber);
    let trimmed = lineContent.trim();

    const lang = getLanguage(currentFile);

    if (lang === 'bog') {
        if (trimmed.startsWith('~~')) {
            // Uncomment
            let uncommented = lineContent.replace(/^~~\s?/, '');
            editorInstance.executeEdits(null, [{
                range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
                text: uncommented
            }]);
        } else {
            // Comment
            let commented = '~~ ' + lineContent;
            editorInstance.executeEdits(null, [{
                range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
                text: commented
            }]);
        }
    } else if (lang === 'auk') {
        if (trimmed.startsWith('//')) {
            // Uncomment
            let uncommented = lineContent.replace(/^\/\/\s?/, '');
            editorInstance.executeEdits(null, [{
                range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
                text: uncommented
            }]);
        } else {
            // Comment
            let commented = '// ' + lineContent;
            editorInstance.executeEdits(null, [{
                range: new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1),
                text: commented
            }]);
        }
    }
}

function lintCode() {
    // Mock linting based on language
    const lang = getLanguage(currentFile);
    if (lang === 'bog') {
        outputElement.innerText = "No lint issues found in Bog code (mock).";
    } else if (lang === 'auk') {
        outputElement.innerText = "No lint issues found in Auk code (mock).";
    } else {
        outputElement.innerText = "No linting available for this language.";
    }
}

function runTests() {
    // Mock test execution
    const lang = getLanguage(currentFile);
    if (lang === 'bog') {
        outputElement.innerText = "All Bog tests passed (mock).";
    } else if (lang === 'auk') {
        outputElement.innerText = "All Auk tests passed (mock).";
    } else {
        outputElement.innerText = "No tests available for this language.";
    }
}

function toggleLineNumbers() {
    const currentOptions = editorInstance.getOptions();
    const currentLineNumbers = currentOptions.getOption('lineNumbers');
    const newLineNumbers = currentLineNumbers === 'on' ? 'off' : 'on';
    editorInstance.updateOptions({ lineNumbers: newLineNumbers });
    saveSettings({ lineNumbers: newLineNumbers });
    outputElement.innerText = `Line numbers turned ${newLineNumbers}.`;
}

// Initiate Inline New File Creation
function initiateNewItemCreation(type) {
    // Prevent multiple inline creations
    if (fileListEl.querySelector('li.editing')) return;

    // Create a new list item with an input field at the end
    const li = document.createElement('li');
    li.classList.add('editing');
    li.classList.add('file');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'NewFile';
    li.appendChild(input);
    fileListEl.appendChild(li); // Insert at the end
    input.focus();

    // Handle input events
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawName = input.value.trim();
            if (rawName === '') {
                alert(`File name cannot be empty.`);
                return;
            }

            // Determine file type based on extension
            let selectedType = '';
            if (rawName.endsWith('.bog')) {
                selectedType = '.bog';
            } else if (rawName.endsWith('.auk')) {
                selectedType = '.auk';
            } else {
                selectedType = prompt("Enter file type (.bog or .auk):", ".bog");
                if (!selectedType) {
                    alert('File type selection canceled.');
                    li.remove();
                    return;
                }
                if (!['.bog', '.auk'].includes(selectedType.toLowerCase())) {
                    alert('Invalid file type. Only .bog and .auk are allowed.');
                    li.remove();
                    return;
                }
                // Append extension if not present
                const ext = selectedType.toLowerCase().replace('.', '');
                const fileName = rawName.endsWith(`.${ext}`) ? rawName : `${rawName}.${ext}`;
                selectedType = `.${ext}`;
            }

            const extension = selectedType.toLowerCase().replace('.', '');
            const fileName = rawName.endsWith(`.${extension}`) ? rawName : `${rawName}.${extension}`;

            // Validate: No additional dots before extension
            const nameWithoutExtension = fileName.slice(0, -(extension.length + 1));
            if (nameWithoutExtension.includes('.')) {
                alert('File name cannot contain dots before the extension.');
                return;
            }

            // Check for invalid characters
            const invalidChars = /[\/\\?%*:|"<>]/;
            if (invalidChars.test(nameWithoutExtension)) {
                alert('File name contains invalid characters.');
                return;
            }

            // Determine the parent path (for simplicity, root directory)
            const fullPath = fileName;

            // Check if file already exists
            if (getItemByPath(fileSystem, fullPath)) {
                alert('File already exists!');
                return;
            }

            // Initialize file content based on language
            let fileContent = '';
            let language = 'bog';
            if (extension === 'bog') {
                fileContent = `suckin "std.bog"

bogfn main(): num {
    fen count = 10
    mire(count > 5) {
        gurgle("Count is greater than 5")
    } sludge {
        gurgle("Count is 5 or less")
    }
    drain 0
}`;
                language = 'bog';
            } else if (extension === 'auk') {
                fileContent = `fen-color: #ff0000
mire-background: #00ff00
~~ This is a comment ~~`;
                language = 'auk';
            }

            // Add file to the root directory
            fileSystem[fileName] = { type: 'file', content: fileContent, language: language };

            saveFileSystem();
            renderFileList();
            openFile(fullPath);
        } else if (e.key === 'Escape') {
            // Remove the editing list item if escape is pressed
            li.remove();
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

// Handle File Upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const fileName = file.name;

            // Validate extension
            const ext = fileName.split('.').pop().toLowerCase();
            if (!['bog', 'auk'].includes(ext)) {
                alert('Only .bog and .auk files are supported.');
                return;
            }

            // Validate name
            const nameWithoutExtension = fileName.slice(0, -(ext.length + 1));
            if (nameWithoutExtension.includes('.')) {
                alert('File name cannot contain dots before the extension.');
                return;
            }

            // Check for invalid characters
            const invalidChars = /[\/\\?%*:|"<>]/;
            if (invalidChars.test(nameWithoutExtension)) {
                alert('File name contains invalid characters.');
                return;
            }

            // Determine the parent path (for simplicity, root directory)
            const fullPath = fileName;

            // Check if file already exists
            if (getItemByPath(fileSystem, fullPath)) {
                alert(`File "${fileName}" already exists!`);
                return;
            }

            // Determine language based on extension
            let language = 'bog';
            if (ext === 'auk') language = 'auk';

            // Add file to the root directory
            fileSystem[fileName] = { type: 'file', content: content, language: language };
            saveFileSystem();
            renderFileList();
            openFile(fullPath);
        };
        reader.readAsText(file);
    });

    // Reset the input value to allow uploading the same file again if needed
    event.target.value = '';
}

function traverseFileSystem(fs, parentEl, currentPath) {
    for (let name in fs) {
        const item = fs[name];
        if (item.type === 'file') {
            const li = document.createElement('li');
            li.classList.add('file-item');
            li.setAttribute('data-path', currentPath ? `${currentPath}/${name}` : name);
            li.setAttribute('data-type', 'file');

            // File Name Element
            const fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = name;
            fileNameSpan.classList.add('file-name');
            li.appendChild(fileNameSpan);

            // Three-Dots Button
            const dotsButton = document.createElement('button');
            dotsButton.classList.add('three-dots-button');
            dotsButton.innerHTML = '&#x22EE;'; // Vertical Ellipsis (⋮)
            dotsButton.title = 'Options';
            li.appendChild(dotsButton);

            // Click Event for Opening File
            fileNameSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                openFile(li.getAttribute('data-path'));
            });

            // Click Event for Three-Dots Button
            dotsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = dotsButton.getBoundingClientRect();
                showContextMenu(rect.right, rect.bottom, li.getAttribute('data-path'), li.getAttribute('data-type'));
            });

            // Keyboard Accessibility for Three-Dots Button
            dotsButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const rect = dotsButton.getBoundingClientRect();
                    showContextMenu(rect.right, rect.bottom, li.getAttribute('data-path'), li.getAttribute('data-type'));
                }
            });

            parentEl.appendChild(li);
        }
    }
}

// app.js

// Rename a file
function renameItemPrompt(path, type) {
    let newName = prompt("Enter new name:", path.split('/').pop());
    if (newName === null) return; // User cancelled

    newName = newName.trim();
    if (newName === '') {
        alert('Name cannot be empty.');
        return;
    }

    if (type === 'file') {
        // Validate extension
        const ext = newName.split('.').pop().toLowerCase();
        if (!['bog', 'auk'].includes(ext)) {
            alert('Invalid file type. Only .bog and .auk are allowed.');
            return;
        }

        const fileName = newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`;

        // Validate: No additional dots before extension
        const nameWithoutExtension = fileName.slice(0, -(ext.length + 1));
        if (nameWithoutExtension.includes('.')) {
            alert('File name cannot contain dots before the extension.');
            return;
        }

        // Check for invalid characters
        const invalidChars = /[\/\\?%*:|"<>]/;
        if (invalidChars.test(nameWithoutExtension)) {
            alert('File name contains invalid characters.');
            return;
        }

        // Determine parent path (root directory)
        const fullPath = fileName;

        // Check if new name already exists
        if (getItemByPath(fileSystem, fullPath)) {
            alert('A file with this name already exists.');
            return;
        }

        // Perform rename
        fileSystem[fileName] = fileSystem[path];
        delete fileSystem[path];

        // Update language if extension changed
        fileSystem[fileName].language = ext === 'bog' ? 'bog' : 'auk';

        // If renaming the current open file
        if (currentFile === path) {
            currentFile = fileName;
            editorInstance.updateOptions({ language: getLanguage(currentFile) });
        }

        saveFileSystem();
        renderFileList();
    } else {
        alert('Rename operation is only available for files.');
    }
}

// Delete a file
function deleteItemPrompt(path, type) {
    if (!confirm(`Are you sure you want to delete "${path}"?`)) return;

    if (type === 'file') {
        // Determine parent path (root directory)
        delete fileSystem[path];
    }

    // If deleting the current open file
    if (currentFile === path) {
        currentFile = null;
        editorInstance.setValue('');
    }

    saveFileSystem();
    renderFileList();
    updatePreview(); // Update preview if the current file is deleted
}

// Download a file
function downloadItem(path) {
    const item = getItemByPath(fileSystem, path);
    if (item.type !== 'file') {
        alert('Only files can be downloaded.');
        return;
    }

    const blob = new Blob([item.content], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop();
    a.click();
    URL.revokeObjectURL(url);
}

// app.js

// ... Existing Code ...

// Show custom context menu
function showContextMenu(x, y, path, type) {
    const menu = document.getElementById('fileContextMenu');
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.classList.remove('hidden');
    menu.setAttribute('data-path', path);
    menu.setAttribute('data-type', type);

    // Adjust position if the menu goes beyond the viewport
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
        menu.style.left = `${viewportWidth - rect.width - 10}px`; // 10px padding
    }

    if (rect.bottom > viewportHeight) {
        menu.style.top = `${viewportHeight - rect.height - 10}px`; // 10px padding
    }
}

// Hide context menu
function hideContextMenu() {
    const menu = document.getElementById('fileContextMenu');
    menu.classList.add('hidden');
    menu.removeAttribute('data-path');
    menu.removeAttribute('data-type');
}

// Handle context menu actions
function handleContextMenuAction(action, path, type) {
    switch(action) {
        case 'rename':
            renameItemPrompt(path, type);
            break;
        case 'delete':
            deleteItemPrompt(path, type);
            break;
        case 'download':
            if (type === 'file') downloadItem(path);
            else alert('Only files can be downloaded.');
            break;
    }
}

// Event Listener for Context Menu Actions
document.getElementById('fileContextMenu').addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    const menu = document.getElementById('fileContextMenu');
    const path = menu.getAttribute('data-path');
    const type = menu.getAttribute('data-type');

    if (action && path) {
        handleContextMenuAction(action, path, type);
        hideContextMenu();
    }
});

// Close context menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('fileContextMenu');
    if (!menu.contains(e.target)) {
        hideContextMenu();
    }
});

// Prevent default context menu from appearing elsewhere (optional)
document.addEventListener('contextmenu', (e) => {
    // Allow default context menu unless it's on a file-item
    const target = e.target.closest('.file-item');
    if (target) {
        e.preventDefault(); // Prevent default if right-clicking on a file
        const dotsButton = target.querySelector('.three-dots-button');
        if (dotsButton) {
            const rect = dotsButton.getBoundingClientRect();
            showContextMenu(rect.right, rect.bottom, target.getAttribute('data-path'), target.getAttribute('data-type'));
        }
    }
});

// app.js

// Modify showContextMenu to hide any existing open context menu
function showContextMenu(x, y, path, type) {
    // Hide any existing context menu
    hideContextMenu();

    const menu = document.getElementById('fileContextMenu');
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.classList.remove('hidden');
    menu.setAttribute('data-path', path);
    menu.setAttribute('data-type', type);

    // Adjust position if the menu goes beyond the viewport
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
        menu.style.left = `${viewportWidth - rect.width - 10}px`; // 10px padding
    }

    if (rect.bottom > viewportHeight) {
        menu.style.top = `${viewportHeight - rect.height - 10}px`; // 10px padding
    }
}


// Handle context menu actions
function handleContextMenuAction(action, path, type) {
    switch(action) {
        case 'rename':
            renameItemPrompt(path, type);
            break;
        case 'delete':
            deleteItemPrompt(path, type);
            break;
        case 'download':
            if (type === 'file') downloadItem(path);
            else alert('Only files can be downloaded.');
            break;
    }
}

// Rename a file or folder
function renameItemPrompt(path, type) {
    let newName = prompt("Enter new name:", path.split('/').pop());
    if (newName === null) return; // User cancelled

    newName = newName.trim();
    if (newName === '') {
        alert('Name cannot be empty.');
        return;
    }

    if (type === 'file') {
        // Validate extension
        const ext = newName.split('.').pop().toLowerCase();
        if (!['bog', 'auk'].includes(ext)) {
            alert('Invalid file type. Only .bog and .auk are allowed.');
            return;
        }

        const fileName = newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`;

        // Validate: No additional dots before extension
        const nameWithoutExtension = fileName.slice(0, -(ext.length + 1));
        if (nameWithoutExtension.includes('.')) {
            alert('File name cannot contain dots before the extension.');
            return;
        }

        // Check for invalid characters
        const invalidChars = /[\/\\?%*:|"<>]/;
        if (invalidChars.test(nameWithoutExtension)) {
            alert('File name contains invalid characters.');
            return;
        }

        // Determine parent path (root directory)
        const parentPath = ''; // All files are in root
        const fullPath = fileName;

        // Check if new name already exists
        if (getItemByPath(fileSystem, fullPath)) {
            alert('A file with this name already exists.');
            return;
        }

        // Perform rename
        fileSystem[fileName] = fileSystem[path];
        delete fileSystem[path];

        // Update language if extension changed
        fileSystem[fileName].language = ext === 'bog' ? 'bog' : 'auk';

        // If renaming the current open file
        if (currentFile === path) {
            currentFile = fileName;
            editorInstance.updateOptions({ language: getLanguage(currentFile) });
        }

        saveFileSystem();
        renderFileList();
    } else {
        alert('Rename operation is only available for files.');
    }
}

// Delete a file or folder
function deleteItemPrompt(path, type) {
    if (!confirm(`Are you sure you want to delete "${path}"?`)) return;

    if (type === 'file') {
        // Determine parent path (root directory)
        const parentPath = ''; // All files are in root
        delete fileSystem[path];
    }

    // If deleting the current open file
    if (currentFile === path) {
        currentFile = null;
        editorInstance.setValue('');
    }

    saveFileSystem();
    renderFileList();
}

// Download a file
function downloadItem(path) {
    const item = getItemByPath(fileSystem, path);
    if (item.type !== 'file') {
        alert('Only files can be downloaded.');
        return;
    }

    const blob = new Blob([item.content], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop();
    a.click();
    URL.revokeObjectURL(url);
}

// Get item by path
function getItemByPath(fs, path) {
    if (!path) return fs;
    const parts = path.split('/');
    let current = fs;
    for (let part of parts) {
        if (current[part]) {
            current = current[part];
        } else {
            return null;
        }
    }
    return current;
}

// Save current file to virtual file system and localStorage
function saveFile() {
    if (currentFile) {
        fileSystem[currentFile].content = editorInstance.getValue();
        saveFileSystem();
    }
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

// Enable Drag-and-Drop Functionality for Files Only
function enableDragAndDrop() {
    let draggedItem = null;

    fileListEl.addEventListener('dragstart', (e) => {
        const target = e.target.closest('li.file');
        if (target && target.getAttribute('data-path')) {
            draggedItem = target.getAttribute('data-path');
            e.dataTransfer.setData('text/plain', draggedItem);
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    fileListEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        // No drop targets as folders are removed
    });

    fileListEl.addEventListener('drop', (e) => {
        e.preventDefault();
        // No drop targets as folders are removed
    });
}

function exportProject() {
    // Mock export functionality
    outputElement.innerText = "Exporting project...";
    setTimeout(() => {
        outputElement.innerText += "\nProject exported successfully as project.zip!";
    }, 2000);
}

function clearOutput() {
    outputElement.innerText = "";
}

function showFileStatistics() {
    if (!currentFile) {
        outputElement.innerText = "No file is currently open.";
        return;
    }
    const content = getFileContent(fileSystem, currentFile);
    const lineCount = content.split('\n').length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    outputElement.innerText = `File: ${currentFile}\nLines: ${lineCount}\nWords: ${wordCount}`;
}

function searchInFiles() {
    const query = prompt("Enter search keyword:");
    if (query) {
        // Mock search functionality
        outputElement.innerText = `Searching for "${query}" in files...\nFound 3 occurrences.`;
    } else {
        outputElement.innerText = "Search canceled.";
    }
}

function openDocumentation() {
    window.open('https://official-bog-docs.com', '_blank');
}

function buildProject() {
    // Mock build process
    outputElement.innerText = "Building project...";
    setTimeout(() => {
        outputElement.innerText += "\nBuild completed successfully!";
    }, 2000);
}