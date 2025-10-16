

// SImulates the create function of request to download model APIs
export async function simulateCreate(createOptions = {}) {
    const { monitor } = createOptions;

    // Create a mock monitor object that mimics the real API's monitor
    const mockMonitor = {
        _listeners: {},
        addEventListener(eventName, callback) {
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push(callback);
        },
        _dispatchEvent(eventName, eventData) {
            const listeners = this._listeners[eventName] || [];
            listeners.forEach(callback => {
                const event = {
                    type: eventName,
                    ...eventData
                };
                callback(event);
            });
        }
    };

    // Call the monitor callback if provided (just like the real API)
    if (typeof monitor === 'function') {
        monitor(mockMonitor);
    }

    // Simulate download progress over 3-5 seconds
    const duration = 3000 + Math.random() * 2000; // Random 3-5 seconds
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        const loaded = i / steps; // Progress from 0 to 1 (0% to 100%)

        // Dispatch downloadprogress event (matches real API format)
        mockMonitor._dispatchEvent('downloadprogress', {
            loaded: loaded,
            total: 1
        });
    }

    // Return a mock session object (mimics real API response)
    return {
        async prompt(text) {
            // Simulate AI response delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return `[SIMULATED] Response to: ${text}`;
        },
        async promptStreaming(text) {
            // Mock streaming response
            const stream = new ReadableStream({
                async start(controller) {
                    const chunks = ['[SIMULATED] ', 'Streaming ', 'response ', 'to: ', text];
                    for (const chunk of chunks) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        controller.enqueue(chunk);
                    }
                    controller.close();
                }
            });
            return stream;
        },
        destroy() {
            console.log('Mock session destroyed');
        }
    };
}
