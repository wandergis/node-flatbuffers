# FlatBuffers in JavaScript

This is an implementation of [FlatBuffers](https://github.com/google/flatbuffers) in pure JavaScript. Unlike the official compiler, this implementation generates JavaScript code to convert between JavaScript objects and FlatBuffers at run time using the JIT. It currently requires binary schemas compiled with the `flatc` compiler, which is written in C++ and has to be built (see the [build instructions](http://google.github.io/flatbuffers/flatbuffers_guide_building.html)).

### Example Usage

1. Create a schema called `example.fbs`:

    ```
    table Example {
      x: float;
      y: float;
    }

    root_type Example;
    ```

2. Generate the binary schema called `example.bfbs`:

    ```
    flatc --binary --schema example.fbs
    ```

3. Install this library:

    ```
    npm install node-fbs
    ```

4. Use the library:

    ```
    var flatbuffers = require('node-fbs');
    var fs = require('fs');

    var example = flatbuffers.compileSchema(fs.readFileSync('example.bfbs'));
    var generated = example.generate({ x: 1, y: 2 });
    var parsed = example.parse(generated);

    console.log('generated:', Array.from(generated));
    console.log('parsed:', parsed);
    ```

Running that code should print this:

```
generated: [ 12, 0, 0, 0, 8, 0, 12, 0, 8, 0, 4, 0, 8, 0, 0, 0, 0, 0, 0, 64, 0, 0, 128, 63 ]
parsed: { x: 1, y: 2 }
```
