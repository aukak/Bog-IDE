// bog-auk-lang-config.js

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

window.BOG_KEYWORDS = ["bogfn", "mire", "sludge", "peat", "drain", "suckin", "fen", "gurgle"];
window.BOG_TYPES = ["num", "dec", "txt", "bool"];

window.AUK_KEYWORDS = ["fen-color", "mire-background"]; // Example Auk keywords

require(['vs/editor/editor.main'], function() {
    // Register Bog Language
    monaco.languages.register({ id: 'bog' });

    monaco.languages.setMonarchTokensProvider('bog', {
        tokenizer: {
            root: [
                // Multi-line comments
                [/~\~\~\~([\s\S]*?)\~\~\~/, 'comment'],

                // Single-line comments
                [/~~.*$/, 'comment'],

                // Strings (double quotes)
                [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
                [/"([^"\\]|\\.)*"/, 'string'],

                // Keywords
                [new RegExp("\\b(" + window.BOG_KEYWORDS.join("|") + ")\\b"), 'keyword'],

                // Types
                [new RegExp("\\b(" + window.BOG_TYPES.join("|") + ")\\b"), 'type'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Identifiers
                [/[a-zA-Z_]\w*/, 'identifier'],

                // Operators
                [/[=+\-*/]+/, 'operator'],

                // Delimiters
                [/[{}()\[\].,]/, 'delimiter']
            ]
        }
    });

    // Register Auk Language
    monaco.languages.register({ id: 'auk' });

    monaco.languages.setMonarchTokensProvider('auk', {
        tokenizer: {
            root: [
                // Single-line comments
                [/\/\/.*$/, 'comment'],

                // Selectors
                [/[.#]?[a-zA-Z_]\w*/, 'keyword'],

                // Properties
                [/[a-zA-Z-]+(?=:)/, 'property'],

                // Values
                [/:\s*[^;]+;/, 'string'],

                // Brackets
                [/[{}]/, 'delimiter'],

                // Strings
                [/"([^"\\]|\\.)*"/, 'string']
            ]
        }
    });

    // Define Themes
    monaco.editor.defineTheme('bog-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '66ff66' },
            { token: 'type', foreground: '66bfff' },
            { token: 'string', foreground: 'ffcc66' },
            { token: 'comment', foreground: '999999', fontStyle: 'italic' },
            { token: 'number', foreground: 'f08080' },
            { token: 'operator', foreground: 'ffffff' },
            { token: 'delimiter', foreground: 'ffffff' },
            { token: 'property', foreground: 'ff69b4' }, // HotPink for Auk properties
        ],
        colors: {
            'editor.background': '#1e1e1e'
        }
    });

    monaco.editor.defineTheme('bog-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '228B22' },
            { token: 'type', foreground: '0000CD' },
            { token: 'string', foreground: 'B22222' },
            { token: 'comment', foreground: '999999', fontStyle: 'italic' },
            { token: 'number', foreground: 'f08080' },
            { token: 'operator', foreground: '000000' },
            { token: 'delimiter', foreground: '000000' },
            { token: 'property', foreground: 'FF1493' }, // DeepPink for Auk properties
        ],
        colors: {
            'editor.background': '#ffffff'
        }
    });

    monaco.editor.defineTheme('swamp-green', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '00ff00' },
            { token: 'type', foreground: '66ff66' },
            { token: 'string', foreground: '22ee22' },
            { token: 'comment', foreground: '888888', fontStyle: 'italic' },
            { token: 'number', foreground: 'ff8c00' },
            { token: 'operator', foreground: 'ffffff' },
            { token: 'delimiter', foreground: 'ffffff' },
            { token: 'property', foreground: 'ffa500' }, // Orange for Auk properties
        ],
        colors: {
            'editor.background': '#003300'
        }
    });

    monaco.editor.defineTheme('bog-ocean', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '1E90FF' }, // DodgerBlue
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: '7FFFD4', fontStyle: 'italic' }, // Aquamarine
            { token: 'number', foreground: 'FF4500' }, // OrangeRed
            { token: 'operator', foreground: 'ffffff' },
            { token: 'delimiter', foreground: 'ffffff' },
            { token: 'property', foreground: '20B2AA' }, // LightSeaGreen for Auk properties
        ],
        colors: {
            'editor.background': '#001f3f' // Navy Blue
        }
    });

    monaco.editor.defineTheme('bog-grey', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'D3D3D3' }, // LightGrey
            { token: 'type', foreground: 'A9A9A9' }, // DarkGrey
            { token: 'string', foreground: 'C0C0C0' }, // Silver
            { token: 'comment', foreground: '696969', fontStyle: 'italic' }, // DimGrey
            { token: 'number', foreground: 'B0C4DE' }, // LightSteelBlue
            { token: 'operator', foreground: 'ffffff' },
            { token: 'delimiter', foreground: 'ffffff' },
            { token: 'property', foreground: 'ADD8E6' }, // LightBlue for Auk properties
        ],
        colors: {
            'editor.background': '#2f4f4f' // DarkSlateGray
        }
    });

    monaco.editor.defineTheme('bog-highContrast', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FFFF00', fontStyle: 'bold' }, // Yellow
            { token: 'type', foreground: '00FFFF', fontStyle: 'bold' }, // Aqua
            { token: 'string', foreground: 'FF00FF', fontStyle: 'bold' }, // Magenta
            { token: 'comment', foreground: '00FF00', fontStyle: 'italic' }, // Lime
            { token: 'number', foreground: 'FF0000' }, // Red
            { token: 'operator', foreground: 'FFFFFF' },
            { token: 'delimiter', foreground: 'FFFFFF' },
            { token: 'property', foreground: '00CED1', fontStyle: 'bold' }, // DarkTurquoise for Auk properties
        ],
        colors: {
            'editor.background': '#000000',
            'editor.foreground': '#FFFFFF'
        }
    });

    monaco.editor.defineTheme('auk-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF69B4' }, // HotPink
            { token: 'property', foreground: 'FFD700' }, // Gold
            { token: 'string', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'comment', foreground: '808080', fontStyle: 'italic' }, // Gray
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'operator', foreground: 'FFFFFF' }, // White
        ],
        colors: {
            'editor.background': '#2e2e2e'
        }
    });

    monaco.editor.defineTheme('auk-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF1493' }, // DeepPink
            { token: 'property', foreground: 'DAA520' }, // GoldenRod
            { token: 'string', foreground: '32CD32' }, // LimeGreen
            { token: 'comment', foreground: '696969', fontStyle: 'italic' }, // DimGray
            { token: 'delimiter', foreground: '000000' }, // Black
            { token: 'operator', foreground: '000000' }, // Black
        ],
        colors: {
            'editor.background': '#FFFFFF'
        }
    });
});
