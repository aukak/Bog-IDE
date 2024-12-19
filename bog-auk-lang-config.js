// bog-auk-lang-config.js

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

window.BOG_KEYWORDS = ["bogfn", "mire", "sludge", "peat", "drain", "suckin", "fen", "gurgle"];
window.BOG_TYPES = ["num", "dec", "txt", "bool"];

window.AUK_KEYWORDS = ["fen-color", "mire-background", "tall"]; // Example Auk keywords

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

    // Define Existing Themes
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

    // Additional Themes

    // 1. Bog Sunset Theme
    monaco.editor.defineTheme('bog-sunset', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF4500' }, // OrangeRed
            { token: 'type', foreground: 'FF8C00' }, // DarkOrange
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: 'FFA07A', fontStyle: 'italic' }, // LightSalmon
            { token: 'number', foreground: 'CD5C5C' }, // IndianRed
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'FF6347' }, // Tomato for Auk properties
        ],
        colors: {
            'editor.background': '#2e1e0f' // Dark Brown
        }
    });

    // 2. Auk Spring Theme
    monaco.editor.defineTheme('auk-spring', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '32CD32' }, // LimeGreen
            { token: 'property', foreground: '00FA9A' }, // MediumSpringGreen
            { token: 'string', foreground: '7FFF00' }, // Chartreuse
            { token: 'comment', foreground: '228B22', fontStyle: 'italic' }, // ForestGreen
            { token: 'delimiter', foreground: '008000' }, // Green
            { token: 'operator', foreground: '008000' }, // Green
        ],
        colors: {
            'editor.background': '#F0FFF0' // Honeydew
        }
    });

    // 3. Bog Twilight Theme
    monaco.editor.defineTheme('bog-twilight', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '9370DB' }, // MediumPurple
            { token: 'type', foreground: 'BA55D3' }, // MediumOrchid
            { token: 'string', foreground: 'FF69B4' }, // HotPink
            { token: 'comment', foreground: 'C71585', fontStyle: 'italic' }, // MediumVioletRed
            { token: 'number', foreground: 'DA70D6' }, // Orchid
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'FFB6C1' }, // LightPink for Auk properties
        ],
        colors: {
            'editor.background': '#301934' // Dark Purple
        }
    });

    // 4. Auk Autumn Theme
    monaco.editor.defineTheme('auk-autumn', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF8C00' }, // DarkOrange
            { token: 'property', foreground: 'FFA500' }, // Orange
            { token: 'string', foreground: 'FF6347' }, // Tomato
            { token: 'comment', foreground: 'D2691E', fontStyle: 'italic' }, // Chocolate
            { token: 'delimiter', foreground: 'FFD700' }, // Gold
            { token: 'operator', foreground: 'FFD700' }, // Gold
        ],
        colors: {
            'editor.background': '#4B2E2E' // Dark Brownish
        }
    });

    // 5. Bog Forest Theme
    monaco.editor.defineTheme('bog-forest', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '228B22' }, // ForestGreen
            { token: 'type', foreground: '006400' }, // DarkGreen
            { token: 'string', foreground: '32CD32' }, // LimeGreen
            { token: 'comment', foreground: '6B8E23', fontStyle: 'italic' }, // OliveDrab
            { token: 'number', foreground: '7CFC00' }, // LawnGreen
            { token: 'operator', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'delimiter', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'property', foreground: '98FB98' }, // PaleGreen for Auk properties
        ],
        colors: {
            'editor.background': '#013220' // Dark Greenish
        }
    });

    // 6. Auk Winter Theme
    monaco.editor.defineTheme('auk-winter', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '00BFFF' }, // DeepSkyBlue
            { token: 'property', foreground: '1E90FF' }, // DodgerBlue
            { token: 'string', foreground: '4682B4' }, // SteelBlue
            { token: 'comment', foreground: '708090', fontStyle: 'italic' }, // SlateGray
            { token: 'delimiter', foreground: '0000FF' }, // Blue
            { token: 'operator', foreground: '0000FF' }, // Blue
        ],
        colors: {
            'editor.background': '#E6F0FA' // LightBlue background
        }
    });

    // 7. Bog Lava Theme
    monaco.editor.defineTheme('bog-lava', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF0000' }, // Red
            { token: 'type', foreground: 'FF4500' }, // OrangeRed
            { token: 'string', foreground: 'FF6347' }, // Tomato
            { token: 'comment', foreground: 'B22222', fontStyle: 'italic' }, // FireBrick
            { token: 'number', foreground: 'DC143C' }, // Crimson
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'FF7F50' }, // Coral for Auk properties
        ],
        colors: {
            'editor.background': '#330000' // Very Dark Red
        }
    });

    // 8. Auk Neon Theme
    monaco.editor.defineTheme('auk-neon', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '39FF14' }, // Neon Green
            { token: 'property', foreground: 'FF1493' }, // DeepPink
            { token: 'string', foreground: '00FFFF' }, // Aqua
            { token: 'comment', foreground: '7FFF00', fontStyle: 'italic' }, // Chartreuse
            { token: 'delimiter', foreground: 'FF00FF' }, // Magenta
            { token: 'operator', foreground: 'FF00FF' }, // Magenta
        ],
        colors: {
            'editor.background': '#000000' // Black
        }
    });

    // 9. Bog Solarized Theme
    monaco.editor.defineTheme('bog-solarized', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '268BD2' }, // Blue
            { token: 'type', foreground: '2AA198' }, // Cyan
            { token: 'string', foreground: '859900' }, // Green
            { token: 'comment', foreground: '586E75', fontStyle: 'italic' }, // Base02
            { token: 'number', foreground: 'D33682' }, // Magenta
            { token: 'operator', foreground: '93A1A1' }, // Base1
            { token: 'delimiter', foreground: '93A1A1' }, // Base1
            { token: 'property', foreground: 'CB4B16' }, // Orange for Auk properties
        ],
        colors: {
            'editor.background': '#002B36' // Base02
        }
    });

    // 10. Auk Retro Theme
    monaco.editor.defineTheme('auk-retro', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FFD700' }, // Gold
            { token: 'property', foreground: '00FF7F' }, // SpringGreen
            { token: 'string', foreground: 'FF1493' }, // DeepPink
            { token: 'comment', foreground: '7CFC00', fontStyle: 'italic' }, // LawnGreen
            { token: 'delimiter', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'operator', foreground: 'ADFF2F' }, // GreenYellow
        ],
        colors: {
            'editor.background': '#8B0000' // DarkRed
        }
    });

    // 11. Bog Aurora Theme
    monaco.editor.defineTheme('bog-aurora', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '7FFFD4' }, // Aquamarine
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FF69B4' }, // HotPink
            { token: 'comment', foreground: '00FA9A', fontStyle: 'italic' }, // MediumSpringGreen
            { token: 'number', foreground: 'FFB6C1' }, // LightPink
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '00FFFF' }, // Aqua for Auk properties
        ],
        colors: {
            'editor.background': '#1E1E1E' // Very Dark Gray
        }
    });

    // 12. Auk Vintage Theme
    monaco.editor.defineTheme('auk-vintage', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '800000' }, // Maroon
            { token: 'property', foreground: '8B4513' }, // SaddleBrown
            { token: 'string', foreground: 'FF8C00' }, // DarkOrange
            { token: 'comment', foreground: '808080', fontStyle: 'italic' }, // Gray
            { token: 'delimiter', foreground: '000000' }, // Black
            { token: 'operator', foreground: '000000' }, // Black
        ],
        colors: {
            'editor.background': '#FFF8DC' // Cornsilk
        }
    });

    // 13. Bog Galaxy Theme
    monaco.editor.defineTheme('bog-galaxy', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '9400D3' }, // DarkViolet
            { token: 'type', foreground: '00FFFF' }, // Aqua
            { token: 'string', foreground: 'FF00FF' }, // Magenta
            { token: 'comment', foreground: '7FFF00', fontStyle: 'italic' }, // Chartreuse
            { token: 'number', foreground: 'FF4500' }, // OrangeRed
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'DA70D6' }, // Orchid for Auk properties
        ],
        colors: {
            'editor.background': '#0B0C10' // Very Dark Blue
        }
    });

    // 14. Auk Cyberpunk Theme
    monaco.editor.defineTheme('auk-cyberpunk', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF00FF' }, // Magenta
            { token: 'property', foreground: '00FFFF' }, // Aqua
            { token: 'string', foreground: 'FFFF00' }, // Yellow
            { token: 'comment', foreground: 'FF1493', fontStyle: 'italic' }, // DeepPink
            { token: 'delimiter', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: 'FF69B4' }, // HotPink
        ],
        colors: {
            'editor.background': '#1A1A1A' // Very Dark Gray
        }
    });

    // 15. Bog Pastel Theme
    monaco.editor.defineTheme('bog-pastel', {
        base: 'vs-light',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FFB6C1' }, // LightPink
            { token: 'type', foreground: '87CEFA' }, // LightSkyBlue
            { token: 'string', foreground: '98FB98' }, // PaleGreen
            { token: 'comment', foreground: 'D3D3D3', fontStyle: 'italic' }, // LightGrey
            { token: 'number', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: '000000' }, // Black
            { token: 'delimiter', foreground: '000000' }, // Black
            { token: 'property', foreground: 'FFB347' }, // PastelOrange for Auk properties
        ],
        colors: {
            'editor.background': '#FFF0F5' // LavenderBlush
        }
    });

    // 16. Auk Midnight Theme
    monaco.editor.defineTheme('auk-midnight', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '00CED1' }, // DarkTurquoise
            { token: 'property', foreground: '1E90FF' }, // DodgerBlue
            { token: 'string', foreground: '7B68EE' }, // MediumSlateBlue
            { token: 'comment', foreground: 'B0C4DE', fontStyle: 'italic' }, // LightSteelBlue
            { token: 'delimiter', foreground: '4682B4' }, // SteelBlue
            { token: 'operator', foreground: '4682B4' }, // SteelBlue
        ],
        colors: {
            'editor.background': '#191970' // MidnightBlue
        }
    });

    // 17. Bog Candy Theme
    monaco.editor.defineTheme('bog-candy', {
        base: 'vs-light',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF69B4' }, // HotPink
            { token: 'type', foreground: 'FF1493' }, // DeepPink
            { token: 'string', foreground: 'BA55D3' }, // MediumOrchid
            { token: 'comment', foreground: 'D8BFD8', fontStyle: 'italic' }, // Thistle
            { token: 'number', foreground: 'FFB6C1' }, // LightPink
            { token: 'operator', foreground: '000000' }, // Black
            { token: 'delimiter', foreground: '000000' }, // Black
            { token: 'property', foreground: 'DA70D6' }, // Orchid for Auk properties
        ],
        colors: {
            'editor.background': '#FFF0F5' // LavenderBlush
        }
    });

    // 18. Auk Electric Theme
    monaco.editor.defineTheme('auk-electric', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '7FFF00' }, // Chartreuse
            { token: 'property', foreground: '00FFFF' }, // Aqua
            { token: 'string', foreground: '00FF7F' }, // SpringGreen
            { token: 'comment', foreground: 'ADFF2F', fontStyle: 'italic' }, // GreenYellow
            { token: 'delimiter', foreground: '7CFC00' }, // LawnGreen
            { token: 'operator', foreground: '7CFC00' }, // LawnGreen
        ],
        colors: {
            'editor.background': '#000000' // Black
        }
    });

    // 19. Bog Mirage Theme
    monaco.editor.defineTheme('bog-mirage', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '7B68EE' }, // MediumSlateBlue
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: '708090', fontStyle: 'italic' }, // SlateGray
            { token: 'number', foreground: 'FF6347' }, // Tomato
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '00FFFF' }, // Aqua for Auk properties
        ],
        colors: {
            'editor.background': '#191970' // MidnightBlue
        }
    });

    // 20. Auk Radiant Theme
    monaco.editor.defineTheme('auk-radiant', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF4500' }, // OrangeRed
            { token: 'property', foreground: 'FF1493' }, // DeepPink
            { token: 'string', foreground: '32CD32' }, // LimeGreen
            { token: 'comment', foreground: '556B2F', fontStyle: 'italic' }, // DarkOliveGreen
            { token: 'delimiter', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: 'FF69B4' }, // HotPink
        ],
        colors: {
            'editor.background': '#FFFFFF' // White
        }
    });

    // 21. Bog Ember Theme
    monaco.editor.defineTheme('bog-ember', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'DC143C' }, // Crimson
            { token: 'type', foreground: 'B22222' }, // FireBrick
            { token: 'string', foreground: 'FF6347' }, // Tomato
            { token: 'comment', foreground: '8B0000', fontStyle: 'italic' }, // DarkRed
            { token: 'number', foreground: 'CD5C5C' }, // IndianRed
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'FF4500' }, // OrangeRed for Auk properties
        ],
        colors: {
            'editor.background': '#1C1C1C' // Very Dark Gray
        }
    });

    // 22. Auk Spectrum Theme
    monaco.editor.defineTheme('auk-spectrum', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF00FF' }, // Magenta
            { token: 'property', foreground: '00FF00' }, // Lime
            { token: 'string', foreground: '00FFFF' }, // Aqua
            { token: 'comment', foreground: 'ADFF2F', fontStyle: 'italic' }, // GreenYellow
            { token: 'delimiter', foreground: 'FFA500' }, // Orange
            { token: 'operator', foreground: 'FFA500' }, // Orange
        ],
        colors: {
            'editor.background': '#2F4F4F' // DarkSlateGray
        }
    });

    // 23. Bog Blizzard Theme
    monaco.editor.defineTheme('bog-blizzard', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '87CEEB' }, // SkyBlue
            { token: 'type', foreground: '1E90FF' }, // DodgerBlue
            { token: 'string', foreground: '00BFFF' }, // DeepSkyBlue
            { token: 'comment', foreground: 'ADD8E6', fontStyle: 'italic' }, // LightBlue
            { token: 'number', foreground: '4682B4' }, // SteelBlue
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '00CED1' }, // DarkTurquoise for Auk properties
        ],
        colors: {
            'editor.background': '#1E1E1E' // Very Dark Gray
        }
    });

    // 24. Auk Prism Theme
    monaco.editor.defineTheme('auk-prism', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF69B4' }, // HotPink
            { token: 'property', foreground: 'FFD700' }, // Gold
            { token: 'string', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'comment', foreground: '7CFC00', fontStyle: 'italic' }, // LawnGreen
            { token: 'delimiter', foreground: '32CD32' }, // LimeGreen
            { token: 'operator', foreground: '32CD32' }, // LimeGreen
        ],
        colors: {
            'editor.background': '#000000' // Black
        }
    });

    // 25. Bog Aurora Borealis Theme
    monaco.editor.defineTheme('bog-aurora-borealis', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '7FFFD4' }, // Aquamarine
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: '66CDAA', fontStyle: 'italic' }, // MediumAquamarine
            { token: 'number', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '40E0D0' }, // Turquoise for Auk properties
        ],
        colors: {
            'editor.background': '#1A1A1A' // Very Dark Gray
        }
    });

    // 26. Auk Mirage Theme
    monaco.editor.defineTheme('auk-mirage', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '9400D3' }, // DarkViolet
            { token: 'property', foreground: '8A2BE2' }, // BlueViolet
            { token: 'string', foreground: 'BA55D3' }, // MediumOrchid
            { token: 'comment', foreground: 'DDA0DD', fontStyle: 'italic' }, // Plum
            { token: 'delimiter', foreground: 'FF1493' }, // DeepPink
            { token: 'operator', foreground: 'FF1493' }, // DeepPink
        ],
        colors: {
            'editor.background': '#4B0082' // Indigo
        }
    });

    // 27. Auk Neon Lights Theme
    monaco.editor.defineTheme('auk-neon-lights', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF00FF' }, // Magenta
            { token: 'property', foreground: '00FF00' }, // Lime
            { token: 'string', foreground: '00FFFF' }, // Aqua
            { token: 'comment', foreground: '7FFF00', fontStyle: 'italic' }, // Chartreuse
            { token: 'delimiter', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: 'FF69B4' }, // HotPink
        ],
        colors: {
            'editor.background': '#0D0D0D' // Very Dark Gray
        }
    });

    // 28. Bog Radiant Theme
    monaco.editor.defineTheme('bog-radiant', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF4500' }, // OrangeRed
            { token: 'type', foreground: '32CD32' }, // LimeGreen
            { token: 'string', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'comment', foreground: '7CFC00', fontStyle: 'italic' }, // LawnGreen
            { token: 'number', foreground: '00FA9A' }, // MediumSpringGreen
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '7FFF00' }, // Chartreuse for Auk properties
        ],
        colors: {
            'editor.background': '#2F4F4F' // DarkSlateGray
        }
    });

    // 29. Auk Cyberpunk Neon Theme
    monaco.editor.defineTheme('auk-cyberpunk-neon', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF1493' }, // DeepPink
            { token: 'property', foreground: '00FFFF' }, // Aqua
            { token: 'string', foreground: '7FFF00' }, // Chartreuse
            { token: 'comment', foreground: '00FF7F', fontStyle: 'italic' }, // SpringGreen
            { token: 'delimiter', foreground: 'FF00FF' }, // Magenta
            { token: 'operator', foreground: 'FF00FF' }, // Magenta
        ],
        colors: {
            'editor.background': '#1C1C1C' // Dark Gray
        }
    });

    // 30. Bog Ember Glow Theme
    monaco.editor.defineTheme('bog-ember-glow', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF6347' }, // Tomato
            { token: 'type', foreground: 'FF4500' }, // OrangeRed
            { token: 'string', foreground: 'FF8C00' }, // DarkOrange
            { token: 'comment', foreground: 'B22222', fontStyle: 'italic' }, // FireBrick
            { token: 'number', foreground: 'FF1493' }, // DeepPink
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: 'FF4500' }, // OrangeRed for Auk properties
        ],
        colors: {
            'editor.background': '#3B0B17' // Dark Maroon
        }
    });

    // 31. Auk Aurora Neon Theme
    monaco.editor.defineTheme('auk-aurora-neon', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '00FF7F' }, // SpringGreen
            { token: 'property', foreground: '7FFFD4' }, // Aquamarine
            { token: 'string', foreground: 'FF00FF' }, // Magenta
            { token: 'comment', foreground: '00FFFF', fontStyle: 'italic' }, // Aqua
            { token: 'delimiter', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'operator', foreground: 'ADFF2F' }, // GreenYellow
        ],
        colors: {
            'editor.background': '#000000' // Black
        }
    });

    // 32. Bog Prism Theme
    monaco.editor.defineTheme('bog-prism', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '9400D3' }, // DarkViolet
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'FFD700' }, // Gold
            { token: 'comment', foreground: '7FFF00', fontStyle: 'italic' }, // Chartreuse
            { token: 'number', foreground: 'FF6347' }, // Tomato
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '1E90FF' }, // DodgerBlue for Auk properties
        ],
        colors: {
            'editor.background': '#0B0C10' // MidnightBlue
        }
    });

    // 33. Auk Neon Glow Theme
    monaco.editor.defineTheme('auk-neon-glow', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'FF00FF' }, // Magenta
            { token: 'property', foreground: '00FFFF' }, // Aqua
            { token: 'string', foreground: 'FFFF00' }, // Yellow
            { token: 'comment', foreground: 'FF1493', fontStyle: 'italic' }, // DeepPink
            { token: 'delimiter', foreground: 'FF69B4' }, // HotPink
            { token: 'operator', foreground: 'FF69B4' }, // HotPink
        ],
        colors: {
            'editor.background': '#0D0D0D' // Very Dark Gray
        }
    });

    // 34. Bog Neon Lights Theme
    monaco.editor.defineTheme('bog-neon-lights', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '7FFF00' }, // Chartreuse
            { token: 'type', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: 'ADFF2F' }, // GreenYellow
            { token: 'comment', foreground: '7CFC00', fontStyle: 'italic' }, // LawnGreen
            { token: 'number', foreground: '00FA9A' }, // MediumSpringGreen
            { token: 'operator', foreground: 'FFFFFF' }, // White
            { token: 'delimiter', foreground: 'FFFFFF' }, // White
            { token: 'property', foreground: '7FFF00' }, // Chartreuse for Auk properties
        ],
        colors: {
            'editor.background': '#004225' // Dark Green
        }
    });

    // 35. Auk Electric Blue Theme
    monaco.editor.defineTheme('auk-electric-blue', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '1E90FF' }, // DodgerBlue
            { token: 'property', foreground: '00CED1' }, // DarkTurquoise
            { token: 'string', foreground: '7B68EE' }, // MediumSlateBlue
            { token: 'comment', foreground: 'ADD8E6', fontStyle: 'italic' }, // LightBlue
            { token: 'delimiter', foreground: '4682B4' }, // SteelBlue
            { token: 'operator', foreground: '4682B4' }, // SteelBlue
        ],
        colors: {
            'editor.background': '#000080' // Navy
        }
    });

    // You can continue adding more themes following the same structure.
});
