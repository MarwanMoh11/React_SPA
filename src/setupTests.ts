// src/setupTests.ts

// --- START: Manual Polyfills for Jest's Node.js environment ---

// 1. Manual mock for BroadcastChannel to satisfy MSW in a Jest environment.
class MockBroadcastChannel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_name: string) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postMessage(_message: unknown) {} // Use 'unknown' which is a safer alternative to 'any'
    close() {}
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => unknown) | null = null;
    onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => unknown) | null = null;
    addEventListener() {}
    removeEventListener() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatchEvent(_event: Event): boolean {
        return false;
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.BroadcastChannel = MockBroadcastChannel as any;


// 2. Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// 3. Polyfill for Web Streams
import { TransformStream } from 'stream/web';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TransformStream = TransformStream as any;

// 4. Polyfill for the Fetch API
import 'whatwg-fetch';

// --- END: Manual Polyfills ---


// --- Jest-DOM Matchers ---
// This adds custom matchers like .toBeInTheDocument()
import '@testing-library/jest-dom';