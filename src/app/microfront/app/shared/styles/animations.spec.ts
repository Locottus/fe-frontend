import { Animations } from './animations';

describe('Animations', () => {
  it('should have validatorsInOutAnimation trigger', () => {
    expect(Animations.validatorsInOutAnimation).toBeDefined();
  });

  it('should have collapse trigger', () => {
    expect(Animations.collapse).toBeDefined();
  });

  it('should have childAnimation trigger', () => {
    expect(Animations.childAnimation).toBeDefined();
  });
});
