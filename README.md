# `eloquent-js`

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/armandkaufmann/eloquent-js)

`eloquent-js` is a simple and lightweight query builder for JavaScript, based on the syntax of  Laravel's *Eloquent ORM*.

One can build a query like so:

```javascript
import { Builder } from 'eloquent-db';

const builder = new Builder();

const users = builder.table('chocoate')
    .select('name', 'calories', 'sugar_content')
    .where('calories', '>', '150')
    .orderBy('name', 'asc')
    .limit(3)
    .get();
```
