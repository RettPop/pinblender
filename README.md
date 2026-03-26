# PinBlender

**PinBlender** is a steampunk-themed, privacy-first web application designed to obfuscate and deobfuscate PINs or short secret codes. It uses a custom "clockwork" algorithm to bury your secret within a stream of noise, making it unreadable to the naked eye while remaining easily recoverable with the correct mechanical settings.

## 🛠 How It Works

The core logic relies on two primary "gears": **Initial Gear Lag** and **Position Offset**.

### The Algorithm
1.  **Initial Gear Lag**: A specified number of random noise characters are prepended to the output. This shifts the starting point of the PIN, thwarting simple pattern matching.
2.  **Position Offset**: The $i$-th character of your PIN is placed at a specific interval.
    *   If the Offset is $P$, then $P-1$ noise characters are generated, followed by the $i$-th PIN character.
3.  **Dynamic Noise Pool**:
    *   If your PIN contains only digits (`0-9`), the noise is also strictly numeric.
    *   If your PIN contains any non-numeric character (letters, symbols), the noise pool expands to include `0-9`, `a-z`, and `A-Z`.
4.  **Trailing Noise**: A random amount of noise is added at the end to mask the true length of the PIN.

### Example
**PIN**: `1234` | **Offset**: `3` | **Lag**: `5`
1. Prepend 5 noise characters: `abcde`
2. First PIN digit (`1`) after 2 noise: `abcde XX 1`
3. Second PIN digit (`2`) after 2 noise: `abcde XX 1 XX 2` ... and so on.

## 🔒 Security Protocol

PinBlender is designed for **local obfuscation**. No data is ever sent to a server.

*   **Manual Mode (Recommended)**: Do not use any prefixes. You must remember both your **Position Offset** and your **Initial Gear Lag** to recover the PIN.
*   **Simple Prefix**: Adds `<LENGTH>x` to the start (e.g., `4x...`). This helps you remember how many digits to expect but requires you to know the Offset and Lag.
*   **UNSECURE Mode**: Adds `<LENGTH>@<OFFSET>:<LAG>x` (e.g., `4@3:5x...`). This stores all calibration data in the string itself. **Use this only for testing**, as it makes the obfuscation trivial to reverse.

## 🚀 Deployment

Since this is a single-page application (HTML/CSS/JS), it is perfect for **GitHub Pages**.

1.  Push these files to a GitHub repository.
2.  Go to **Settings > Pages**.
3.  Select the `main` branch and click **Save**.
4.  Your mechanical obfuscator is now live!

## ⚙️ Requirements
*   A modern web browser with JavaScript enabled.
*   No external libraries or dependencies are required (all assets are linked via CDN or embedded).

---
*Created for the discerning engineer of the late 19th century. (v.1.1.0)*
