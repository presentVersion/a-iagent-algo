import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImpactDashboard from '../components/ImpactDashboard';
import ReelCard from '../components/ReelCard';
import { DEMO_REELS } from '../data/demoReels';

describe('Component & UI Integration Tests', () => {

  it('renders ImpactDashboard with correct metrics data', () => {
    const mockMetrics = {
      reelsDiscovered: 4,
      topicsExplored: 3,
      careerTopicsFound: 2,
      learningMinutes: 60,
      educationalRatio: 0.75
    };

    render(<ImpactDashboard metrics={mockMetrics} />);

    // Check title presence
    expect(screen.getByText('ScrollSense AI Impact Dashboard')).toBeInTheDocument();

    // Check counts are rendered
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('60m')).toBeInTheDocument();
    expect(screen.getByText('75% Educational')).toBeInTheDocument();
  });

  it('renders ReelCard with title, creator, and categories', () => {
    const mockReel = DEMO_REELS[0];
    const mockInteract = vi.fn();
    const mockInteractions = {};

    render(
      <ReelCard
        reel={mockReel}
        onInteract={mockInteract}
        interactions={mockInteractions}
      />
    );

    // Verify creator details
    expect(screen.getByText(mockReel.creator)).toBeInTheDocument();
    
    // Verify title text
    expect(screen.getAllByText(mockReel.title)[0]).toBeInTheDocument();
    
    // Verify category label
    expect(screen.getByText(mockReel.category)).toBeInTheDocument();
  });

});
