# `eloquent-js`

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
``
                 _..__
                .' I   '.
                |.-"""-.|
               _;.-"""-.;_
           _.-' _..-.-.._ '-._
          ';--.-(_o_I_o_)-.--;'
           `. | |  | |  | | .`
             `-\|  | |  |/-'
                |  | |  |
                |  \_/  |
             _.'; ._._. ;'._
        _.-'`; | \  -  / | ;'-.
      .' :  /  |  |   |  |  \  '.
     /   : /__ \  \___/  / __\ : `.
    /    |   /  '._/_\_.'  \   :   `\
   /     .  `---;"""""'-----`  .     \
  /      |      |()    ()      |      \
 /      /|      |              |\      \
/      / |      |()    ()      | \      \
|         |
\     \   |][     |   |    ][ |   /     /
 \     \ ;=""====='"""'====""==; /     /
  |/`\  \/      |()    ()      \/  /`\|
   |_/.-';      |              |`-.\_|
     /   |      ;              :   \
     |__.|      |              |.__|
         ;      |              | 
         |      :              ;
         |      :              |
         ;      |              |
         ;      |              ;
         |      :              |
         |      |              ;
         |      |              ;
         '-._   ;           _.-'
             `;"--.....--";`
              |    | |    |
              |    | |    |
              |    | |    |
              T----T T----T
         _..._L____J L____J _..._
       .` "-. `%   | |    %` .-" `.
      /      \    .: :.     /      \
      '-..___|_..=:` `-:=.._|___..-'`
