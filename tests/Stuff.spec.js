import {describe, test} from "vitest";
import {DBConn} from "../src/DBConn.js";

describe('testing stuff', () => {
   test('see if this works', async () => {
      const database = await DBConn.connect();
      const result = await database.db.exec('INSERT INTO users VALUES ("taco")');
      console.log(await database.db.all('SELECT * FROM users'));

      console.log(process.cwd())

      // const filePath = process.cwd();
      //need to use this to point to database file in project

      // console.log("FILE PATH:", filePath);
   });
});