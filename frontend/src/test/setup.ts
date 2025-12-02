// Minimal test setup
import '@testing-library/jest-dom'
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true,
    mediaDevices: {
      getUserMedia: () => Promise.resolve(new MediaStream()),
    },
  },
  writable: true,
})

// Mock external dependencies
vi.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: () => {},
    capture: () => {},
  },
}))

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: { text: () => 'Mock response' }
        })
      })
    }))
  }
})

vi.mock('lucide-react', () => ({
  Camera: () => 'Camera',
  AlertCircle: () => 'AlertCircle',
  CheckCircle: () => 'CheckCircle',
  Shield: () => 'Shield',
  Zap: () => 'Zap',
  AlertTriangle: () => 'AlertTriangle',
  Send: () => 'Send',
}))