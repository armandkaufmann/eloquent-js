import {describe, expect, test, vi} from 'vitest';
import {Model} from "../src/Model.js";
import {Query} from "../src/builder/Query.js";

describe('Model Query Builder integration Test', () => {
   describe('Initialization', () => {

       test('can initialize query builder with model class name', () => {
           const queryBuilderTableSpy = vi.spyOn(Query.prototype, "table");
           class TestModel extends Model {}

           new TestModel();

           expect(queryBuilderTableSpy).toHaveBeenCalledWith('test_models');
       });

       test('can initialize with table override', () => {
           const queryBuilderTableSpy = vi.spyOn(Query.prototype, "table");

           const table = 'users';

           class TestModel extends Model {
               constructor() {
                   super({table});
               }
           }

           new TestModel();

           expect(queryBuilderTableSpy).toHaveBeenCalledWith(table);
       });

       test('static create on model loads config', () => {
           const queryBuilderTableSpy = vi.spyOn(Query.prototype, "table");

           const table = 'users';

           class TestModel extends Model {
               constructor() {
                   super({table});
               }
           }

           TestModel.first();

           expect(queryBuilderTableSpy).toHaveBeenCalledWith(table);
       });

   });
});