import { firstNonRepeatingCharacter, findOddOccurringElements } from './functions.js';
import * as mocha from 'mocha';
import { expect } from 'chai';

mocha.describe('findOddOccurringElements', () => {
    it('should return the correct odd occurring elements', () => {
        const arr = [4, 3, 6, 2, 4, 2, 3, 4, 3, 3];
        const result = findOddOccurringElements(arr);
        console.log({result})
        expect(result).to.deep.equal([6, 4]);
    });


});


mocha.describe('firstNonRepeatingCharacter', () => {
    
    it('should return the correct odd occurring elements', () => {
        const string = "harsh";
        const result = firstNonRepeatingCharacter(string);
        console.log({result})
        expect(result).to.deep.equal("a");
    });

});


