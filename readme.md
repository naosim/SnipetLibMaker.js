# SnipetLibMaker
SnipetLibMaker generates a library from the snippets, such as gists.

## Getting Start
genarate library form snipetListSample.json

### Define SnipetList

```json
[
  {
    "name": "zerofill",
    "var": ["zerofill"],
    "url": "https://gist.githubusercontent.com/naosim/fc1877495149a0e2366a/raw/965c3ea537089e965b57d0d380469f7a0a3ff86c/zerofill.js"
  }
]
```
### Genarate

```
node SnipetLibMaker snipetListSample.json
```
=> snipetListSample.js genarated.  
"zerofill" method is loaded from gists.

```javascript
(function(global) {
  var snipet = (function() {
    // zerofill
    var zerofill = function(num, zeros) { return (Array(zeros).join('0') + num).slice(-zeros); };
    return {
      'zerofill': zerofill,
    };
  })();
  if ("process" in global) module["exports"] = snipet;
  global["snipet"] = snipet;
})((this || 0).self || global);

```
