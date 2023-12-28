export const firstNonRepeatingCharacter = (str: string): string | null =>{
  const charCount = new Map<string, number>();

  for (const char of str) {
    if (/[a-zA-Z]/.test(char)) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
  }

  for (const char of str) {
    if (/[a-zA-Z]/.test(char) && charCount.get(char) === 1) {
      return char;
    }
  }

  return null;
}

export const findOddOccurringElements = (arr)=> {

  let xorResult = arr.reduce((acc, num) => acc ^ num, 0);


  let rightmostSetBit = 1;
  while ((rightmostSetBit & xorResult) === 0) {
    rightmostSetBit <<= 1;
  }


  let oddElement1 = 0, oddElement2 = 0;

  for (let num of arr) {
    if ((num & rightmostSetBit) !== 0) {
      oddElement1 ^= num;
    } else {
      oddElement2 ^= num;
    }
  }

  return [oddElement1, oddElement2];

}

