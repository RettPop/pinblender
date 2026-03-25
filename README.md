# PinBlender - The Clockwork Obfuscator

A simple, secure, and aesthetically pleasing web application to obfuscate your PIN codes using a "position-based" blending mechanism.

## Features
- **Customizable Blending**: Specify the exact position for your PIN digits within a stream of random numbers.
- **Randomized Trailing**: Automatically appends a random sequence of digits at the end to mask the length of your PIN.
- **Length Prefixing**: Optional "Nx" prefix (where N is your PIN length) to help you remember the original code's size.
- **Deobfuscation (Extract Essence)**: Reverse the process by providing an obfuscated string. The tool automatically detects embedded offsets or uses your manual "Position Offset" to retrieve the original PIN.
- **Unsecure Offset**: Optional (but discouraged) feature to include both PIN length and Offset in the output for testing purposes (e.g., `4@3x...`).
- **Steampunk Aesthetic**: A beautiful Victorian-industrial design featuring brass, copper, parchment, and clockwork gears.
- **One-Click Copy**: Easily copy your obfuscated code to the clipboard.

## How It Works
If you enter a PIN of `3579` and a Position of `4`:
1. The mechanism generates 3 random digits (Position - 1).
2. It places the 1st digit of your PIN (`3`).
3. It repeats this for the 2nd, 3rd, and 4th digits.
4. Finally, it adds a random trailing sequence of length between 8 and 16 (Position*2 to Position*4).

The result looks like a long, meaningless string of numbers to anyone but you!

## Credits
- Fonts: [Metamorphous](https://fonts.google.com/specimen/Metamorphous) and [Special Elite](https://fonts.google.com/specimen/Special+Elite) via Google Fonts.
- Patterns: Parchment texture from [Transparent Textures](https://www.transparenttextures.com/).
