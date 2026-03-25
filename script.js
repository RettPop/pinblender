document.addEventListener('DOMContentLoaded', () => {
    const pinInput = document.getElementById('pinInput');
    const positionInput = document.getElementById('positionInput');
    const prefixCheckbox = document.getElementById('prefixCheckbox');
    const offsetCheckbox = document.getElementById('offsetCheckbox');
    const blendButton = document.getElementById('blendButton');
    const deobfuscateButton = document.getElementById('deobfuscateButton');
    const outputResult = document.getElementById('outputResult');
    const outputLabel = document.getElementById('outputLabel');
    const copyButton = document.getElementById('copyButton');
    const helpButton = document.getElementById('helpButton');
    const helpDialog = document.getElementById('helpDialog');
    const closeHelp = document.getElementById('closeHelp');
    const malfunctionDialog = document.getElementById('malfunctionDialog');
    const closeMalfunction = document.getElementById('closeMalfunction');

    // Generate a string of random noise based on a character pool
    function generateRandomNoise(length, pool) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += pool[Math.floor(Math.random() * pool.length)];
        }
        return result;
    }

    // Determine the "alphabet" pool based on the characters in the PIN
    function getNoisePool(pin) {
        const hasNonNumeric = /[^0-9]/.test(pin);
        
        if (hasNonNumeric) {
            return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        
        return '0123456789';
    }

    // Core blending logic
    function blendPin() {
        const pin = pinInput.value.trim();
        const position = parseInt(positionInput.value, 10);
        const addPrefix = prefixCheckbox.checked;
        const addUnsecureOffset = offsetCheckbox.checked;

        if (!pin || isNaN(position) || position < 1) return;

        const noisePool = getNoisePool(pin);
        let blendedOutput = '';

        for (let i = 0; i < pin.length; i++) {
            blendedOutput += generateRandomNoise(position - 1, noisePool);
            blendedOutput += pin[i];
        }

        const minTrailing = position * 2;
        const maxTrailing = position * 4;
        const trailingLength = Math.floor(Math.random() * (maxTrailing - minTrailing + 1)) + minTrailing;
        blendedOutput += generateRandomNoise(trailingLength, noisePool);

        if (addUnsecureOffset) {
            blendedOutput = `${pin.length}@${position}x${blendedOutput}`;
        } else if (addPrefix) {
            blendedOutput = `${pin.length}x${blendedOutput}`;
        }

        outputLabel.innerText = 'Obfuscated Output';
        outputResult.value = blendedOutput;
    }

    // Extraction (Deobfuscation) logic
    function extractPin() {
        const input = pinInput.value.trim();
        const currentOffset = parseInt(positionInput.value, 10);
        
        let pinLength = null;
        let offset = null;
        let stream = input;

        // Pattern 1: N@MxStream (Unsecure)
        const unsecureMatch = input.match(/^(\d+)@(\d+)x(.+)$/);
        // Pattern 2: NxStream (Prefix)
        const prefixMatch = input.match(/^(\d+)x(.+)$/);

        if (unsecureMatch) {
            pinLength = parseInt(unsecureMatch[1], 10);
            offset = parseInt(unsecureMatch[2], 10);
            stream = unsecureMatch[3];
        } else if (prefixMatch) {
            pinLength = parseInt(prefixMatch[1], 10);
            offset = currentOffset;
            stream = prefixMatch[2];
        } else {
            // Pattern 3: Raw Stream (Manual)
            offset = currentOffset;
            // Length is unknown, so we process until stream ends
        }

        if (isNaN(offset) || offset < 1) {
            malfunctionDialog.showModal();
            return;
        }

        // Explicitly ensure pinInput is not readonly (though it shouldn't be)
        pinInput.readOnly = false;

        let extracted = '';
        try {
            // If pinLength is known, extract exactly that many
            // If not, we extract based on the offset until the stream is exhausted
            let i = 0;
            let count = 0;
            while (i + offset - 1 < stream.length) {
                if (pinLength !== null && count >= pinLength) break;
                
                extracted += stream[i + offset - 1];
                i += offset;
                count++;
            }

            if (extracted === '') throw new Error('Empty result');
            outputLabel.innerText = 'Extracted Essence';
            outputResult.value = extracted;
        } catch (e) {
            malfunctionDialog.showModal();
        }
    }

    function updateButtonStates() {
        const pinValue = pinInput.value.trim();
        const positionValue = parseInt(positionInput.value, 10);
        const isPositionValid = !isNaN(positionValue) && positionValue >= 1;
        const isPinNotEmpty = pinValue !== '';

        // Engage requires both
        blendButton.disabled = !(isPinNotEmpty && isPositionValid);

        // Extract Essence logic:
        // 1. If it matches N@Mx... or Nx..., it's active
        // 2. If it's a raw string, it requires a valid position offset
        const isSelfContained = /^(\d+)@(\d+)x/.test(pinValue) || /^(\d+)x/.test(pinValue);
        deobfuscateButton.disabled = !isPinNotEmpty || (!isSelfContained && !isPositionValid);
    }

    // UI Event Listeners
    pinInput.addEventListener('input', updateButtonStates);
    positionInput.addEventListener('input', updateButtonStates);

    blendButton.addEventListener('click', blendPin);
    deobfuscateButton.addEventListener('click', extractPin);

    // Dialog Handlers
    helpButton.addEventListener('click', () => helpDialog.showModal());
    closeHelp.addEventListener('click', () => helpDialog.close());
    closeMalfunction.addEventListener('click', () => malfunctionDialog.close());

    [helpDialog, malfunctionDialog].forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                dialog.close();
            }
        });
    });

    copyButton.addEventListener('click', () => {
        if (!outputResult.value) return;
        outputResult.select();
        document.execCommand('copy');
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<span>✅</span>';
        setTimeout(() => copyButton.innerHTML = originalIcon, 2000);
    });

    // Initial state
    updateButtonStates();
});
