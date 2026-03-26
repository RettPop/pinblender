document.addEventListener('DOMContentLoaded', () => {
    const pinInput = document.getElementById('pinInput');
    const positionInput = document.getElementById('positionInput');
    const lagInput = document.getElementById('lagInput');
    const prefixCheckbox = document.getElementById('prefixCheckbox');
    const offsetCheckbox = document.getElementById('offsetCheckbox');
    const blendButton = document.getElementById('blendButton');
    const deobfuscateButton = document.getElementById('deobfuscateButton');
    const outputResult = document.getElementById('outputResult');
    const outputLabel = document.getElementById('outputLabel');
    const copyButton = document.getElementById('copyButton');
    
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');
    
    const malfunctionModal = document.getElementById('malfunctionModal');
    const closeMalfunction = document.getElementById('closeMalfunction');
    const appContainer = document.getElementById('appContainer');

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
        const lag = parseInt(lagInput.value, 10) || 0;
        const addPrefix = prefixCheckbox.checked;
        const addUnsecureOffset = offsetCheckbox.checked;

        if (!pin || isNaN(position) || position < 1) return;

        const noisePool = getNoisePool(pin);
        let blendedOutput = '';

        // Add Initial Gear Lag
        blendedOutput += generateRandomNoise(lag, noisePool);

        // Add Offset-based PIN characters
        for (let i = 0; i < pin.length; i++) {
            blendedOutput += generateRandomNoise(position - 1, noisePool);
            blendedOutput += pin[i];
        }

        // Add Trailing Noise
        const minTrailing = position * 2;
        const maxTrailing = position * 4;
        const trailingLength = Math.floor(Math.random() * (maxTrailing - minTrailing + 1)) + minTrailing;
        blendedOutput += generateRandomNoise(trailingLength, noisePool);

        if (addUnsecureOffset) {
            blendedOutput = `${pin.length}@${position}:${lag}x${blendedOutput}`;
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
        const currentLag = parseInt(lagInput.value, 10) || 0;
        
        let pinLength = null;
        let offset = currentOffset;
        let lag = currentLag;
        let stream = input;

        const unsecureMatch = input.match(/^(\d+)@(\d+):(\d+)x(.+)$/);
        const prefixMatch = input.match(/^(\d+)x(.+)$/);

        if (unsecureMatch) {
            pinLength = parseInt(unsecureMatch[1], 10);
            offset = parseInt(unsecureMatch[2], 10);
            lag = parseInt(unsecureMatch[3], 10);
            stream = unsecureMatch[4];
        } else if (prefixMatch) {
            pinLength = parseInt(prefixMatch[1], 10);
            offset = currentOffset;
            lag = currentLag;
            stream = prefixMatch[2];
        }

        if (isNaN(offset) || offset < 1 || isNaN(lag) || lag < 0) {
            showMalfunction();
            return;
        }

        let extracted = '';
        try {
            let i = lag;
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
            showMalfunction();
        }
    }

    function updateButtonStates() {
        const pinValue = pinInput.value.trim();
        const positionValue = parseInt(positionInput.value, 10);
        const lagValue = parseInt(lagInput.value, 10);
        
        const isPositionValid = !isNaN(positionValue) && positionValue >= 1;
        const isLagValid = !isNaN(lagValue) && lagValue >= 0;
        const isPinNotEmpty = pinValue !== '';

        blendButton.disabled = !(isPinNotEmpty && isPositionValid && isLagValid);
        
        const isSelfContained = /^(\d+)@(\d+):(\d+)x/.test(pinValue) || /^(\d+)x/.test(pinValue);
        deobfuscateButton.disabled = !isPinNotEmpty || (!isSelfContained && (!isPositionValid || !isLagValid));
    }

    // Dialog Handlers
    function openModal(modal) {
        appContainer.style.display = 'none';
        modal.style.display = 'flex';
        window.scrollTo(0, 0);
        const heading = modal.querySelector('h2');
        if (heading) heading.focus();
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        appContainer.style.display = 'block';
        window.scrollTo(0, 0);
    }

    helpButton.addEventListener('click', () => openModal(helpModal));
    closeHelp.addEventListener('click', () => closeModal(helpModal));
    
    closeMalfunction.addEventListener('click', () => closeModal(malfunctionModal));

    function showMalfunction() {
        openModal(malfunctionModal);
    }

    // Modal background click to close
    [helpModal, malfunctionModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Copy logic
    copyButton.addEventListener('click', () => {
        if (!outputResult.value) return;
        outputResult.select();
        document.execCommand('copy');
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<span>✅</span>';
        setTimeout(() => copyButton.innerHTML = originalIcon, 2000);
    });

    // Event Listeners for inputs
    pinInput.addEventListener('input', updateButtonStates);
    positionInput.addEventListener('input', updateButtonStates);
    lagInput.addEventListener('input', updateButtonStates);

    blendButton.addEventListener('click', blendPin);
    deobfuscateButton.addEventListener('click', extractPin);

    updateButtonStates();
});
