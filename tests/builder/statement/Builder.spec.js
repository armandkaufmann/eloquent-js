import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Builder from "../../../src/builder/statement/Builder.js";

describe('Statement: Where Statement Builder', () => {
   test('It builds complete statement string', () => {
      const first = new Where('name', '=', 'John');
      const second = new Where('age', '>', 20, 'OR');
      const third = new Where('sex', '=', 'M');

      const expectedResult = "WHERE name = 'John' OR age > 20 AND sex = 'M'"

      const builder = new Builder();
      builder.push(first).push(second).push(third);

      const result = builder.toString();

      expect(result).toEqual(expectedResult);
   });
});