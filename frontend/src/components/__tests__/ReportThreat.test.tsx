import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ReportThreat } from '../ReportThreat';

// Mock dependencies
vi.mock('../../services/storageService');
vi.mock('../../utils/analytics');

describe('ReportThreat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    // Simple render test without complex DOM interactions
    expect(() => {
      render(<ReportThreat />);
    }).not.toThrow();
  });

  it('has basic structure', () => {
    const { container } = render(<ReportThreat />);
    expect(container).toBeTruthy();
  });
});