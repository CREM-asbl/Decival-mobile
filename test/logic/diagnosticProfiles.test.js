import { describe, it, expect } from 'vitest';
import { detectComparisonProfile } from '../../src/logic/diagnosticProfiles';

describe('Diagnostic Profiles Logic', () => {
  
  it('should detect Natural Profile', () => {
    // Type 0 (0,1 vs 0,3): correct
    // Type 1 (0,1 vs 0,10): says < (natural 1 < 10)
    // Type 2 (0,1 vs 0,01): says = (natural 1 = 01)
    // Type 3 (0,2 vs 0,01): correct
    // Type 4 (0,13 vs 0,3): says > (natural 13 > 3)
    // Type 5 (0,10 vs 0,1): says > (natural 10 > 1)
    // Type 6 (0,80 vs 0,9): says > (natural 80 > 9)
    
    const items = [];
    for (let type = 0; type < 7; type++) {
      for (let i = 0; i < 7; i++) {
        let userAnswer = '';
        let isCorrect = false;
        
        switch(type) {
          case 0: userAnswer = '<'; isCorrect = true; break;
          case 1: userAnswer = '<'; isCorrect = false; break;
          case 2: userAnswer = '='; isCorrect = false; break;
          case 3: userAnswer = '>'; isCorrect = true; break;
          case 4: userAnswer = '>'; isCorrect = false; break;
          case 5: userAnswer = '>'; isCorrect = false; break;
          case 6: userAnswer = '>'; isCorrect = false; break;
        }
        
        items.push({ type, userAnswer, isCorrect });
      }
    }
    
    const result = detectComparisonProfile(items);
    expect(result.profile).toBe('NATURAL');
  });

  it('should detect Length Profile', () => {
    // Length profile: chooses the number with more decimal digits
    const items = [];
    for (let type = 0; type < 7; type++) {
      for (let i = 0; i < 7; i++) {
        let userAnswer = '';
        let isCorrect = false;
        let firstNumberDisplay = '0,1';
        let secondNumberDisplay = '0,2';

        switch(type) {
          case 0: 
            userAnswer = '<'; isCorrect = true; 
            break;
          case 1: // 0,1 vs 0,10
            firstNumberDisplay = '0,1'; secondNumberDisplay = '0,10';
            userAnswer = '<'; isCorrect = false; 
            break;
          case 2: // 0,1 vs 0,01
            firstNumberDisplay = '0,1'; secondNumberDisplay = '0,01';
            userAnswer = '<'; isCorrect = false; 
            break;
          case 3: // 0,2 vs 0,01
            firstNumberDisplay = '0,2'; secondNumberDisplay = '0,01';
            userAnswer = '<'; isCorrect = false; 
            break;
          case 4: // 0,13 vs 0,3
            firstNumberDisplay = '0,13'; secondNumberDisplay = '0,3';
            userAnswer = '>'; isCorrect = false; 
            break;
          case 5: // 0,10 vs 0,1
            firstNumberDisplay = '0,10'; secondNumberDisplay = '0,1';
            userAnswer = '>'; isCorrect = false; 
            break;
          case 6: // 0,80 vs 0,9
            firstNumberDisplay = '0,80'; secondNumberDisplay = '0,9';
            userAnswer = '>'; isCorrect = false; 
            break;
        }
        
        items.push({ type, userAnswer, isCorrect, firstNumberDisplay, secondNumberDisplay });
      }
    }
    
    const result = detectComparisonProfile(items);
    expect(result.profile).toBe('LENGTH');
  });

  it('should detect Expert Profile', () => {
    const items = Array(49).fill(0).map((_, i) => ({
      type: i % 7,
      userAnswer: '=',
      isCorrect: true
    }));
    
    const result = detectComparisonProfile(items);
    expect(result.profile).toBe('EXPERT');
  });
});
