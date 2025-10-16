export function calculateSafePosition(position, elementSize) {
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    const margin = 20; // Minimum margin from viewport edges

    // Calculate safe horizontal position
    let x = position.x;
    if (x + elementSize.width > viewport.width - margin) {
        x = viewport.width - elementSize.width - margin;
    }
    if (x < margin) {
        x = margin;
    }

    // Calculate safe vertical position
    let y = position.y;
    if (y + elementSize.height > viewport.height - margin) {
        y = viewport.height - elementSize.height - margin;
    }
    if (y < margin) {
        y = margin;
    }

    return { x, y };
}

export function calculateAbsolutePosition(viewportPosition) {
    return {
        x: viewportPosition.x + window.scrollX,
        y: viewportPosition.y + window.scrollY
    };
}

export function setupHeightObserver(elementToObserve, anchorBottomY) {
    let lastHeight = elementToObserve.offsetHeight;
    
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const newHeight = entry.contentRect.height;
            
            // Only adjust if height has actually changed
            if (lastHeight !== null && newHeight !== lastHeight) {
                const heightDelta = newHeight - lastHeight;
                
                // Get current top position
                const currentTop = parseInt(elementToObserve.style.top, 10);
                
                // Adjust top position to keep bottom anchored
                const newTop = currentTop - heightDelta;
                elementToObserve.style.top = `${newTop}px`;
                
                // Update for next comparison
                lastHeight = newHeight;
                
                console.log('Height changed, adjusted position:', {
                    heightDelta,
                    newHeight,
                    currentTop,
                    newTop
                });
            }
        }
    });
    
    return observer;
}