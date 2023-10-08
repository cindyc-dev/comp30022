export const isObjectsEqual = (obj1: object, obj2: object) => {
  // Function to check if two objects are equal and make sure that the order of the keys is not important and it is typesafe

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    console.log("  not equal length");
    return false;
  }

  const obj1Entries = Object.entries(obj1).sort();
  const obj2Entries = Object.entries(obj2).sort();
  for (let i = 0; i < obj1Entries.length; i++) {
    if (obj1Entries[i][0] !== obj2Entries[i][0]) {
      console.log(`  0not equal key ${obj1Entries[i][0]} ${obj2Entries[i][0]}`);
      return false;
    }
    if (obj1Entries[i][1] !== obj2Entries[i][1]) {
      console.log(
        `  1not equal value ${obj1Entries[i][1]} ${obj2Entries[i][1]}`
      );
      return false;
    }
  }
  console.log("  equal");
  return true;
};
