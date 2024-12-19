require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

window.BOG_KEYWORDS = ["bogfn", "mire", "sludge", "peat", "drain", "suckin", "fen", "gurgle"];
window.BOG_TYPES = ["num", "dec", "txt", "bool"];

require(['vs/editor/editor.main'], function() {
    monaco.languages.register({ id: 'bog' });

    monaco.languages.setMonarchTokensProvider('bog', {
        tokenizer: {
            root: [
                // Comments
                [/~~.*$/, 'comment'],
                [/~{3}[\s\S]*?~{3}/, 'comment'],

                // Strings
                [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
                [/"([^"\\]|\\.)*"/, 'string'],

                // Keywords & Types
                [new RegExp("\\b(" + BOG_KEYWORDS.join("|") + ")\\b"), 'keyword'],
                [new RegExp("\\b(" + BOG_TYPES.join("|") + ")\\b"), 'type'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Identifiers
                [/[a-zA-Z_]\w*/, 'identifier'],

                // Operators
                [/[=+\-*/]+/, 'operator'],
                [/[{}()\[\].,]/, 'delimiter']
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
            { token: 'comment', foreground: '999999' },
            { token: 'number', foreground: 'f08080' }
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
            { token: 'comment', foreground: '999999' },
            { token: 'number', foreground: 'f08080' }
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
            { token: 'comment', foreground: '888888' },
            { token: 'number', foreground: 'ff8c00' }
        ],
        colors: {
            'editor.background': '#003300'
        }
    });

    // Additional Themes
    monaco.editor.defineTheme('bog-ocean', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '1E90FF' }, // DodgerBlue
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: '7FFFD4' }, // Aquamarine
            { token: 'number', foreground: 'FF4500' } // OrangeRed
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
            { token: 'comment', foreground: '696969' }, // DimGrey
            { token: 'number', foreground: 'B0C4DE' } // LightSteelBlue
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
            { token: 'comment', foreground: '00FF00' }, // Lime
            { token: 'number', foreground: 'FF0000' } // Red
        ],
        colors: {
            'editor.background': '#000000',
            'editor.foreground': '#FFFFFF'
        }
    });
});
