import {afterEach, describe, expect, test, vi} from 'vitest';
import {Model} from "../../src/model/Model.js";
import {QueryBuilder} from "../../src/model/QueryBuilder.js";

describe('Model Query Builder integration Test', () => {
   describe('Initialization', () => {

       test('can initialize query builder with model class name', () => {
           const queryBuilderTableSpy = vi.spyOn(QueryBuilder.prototype, "table");
           class TestModel extends Model {}

           new TestModel();

           expect(queryBuilderTableSpy).toHaveBeenCalledWith('test_models');
       });

       test('can initialize with table override', () => {
           const queryBuilderTableSpy = vi.spyOn(QueryBuilder.prototype, "table");

           const table = 'users';

           class TestModel extends Model {
               constructor() {
                   super({table});
               }
           }

           new TestModel();

           expect(queryBuilderTableSpy).toHaveBeenCalledWith('users');
       });

   });
});