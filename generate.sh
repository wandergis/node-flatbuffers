#!/bin/sh

flatc -o src --js src/reflection.fbs
flatc -o tests --binary --schema tests/example.fbs
flatc -o tests --binary --schema tests/unicode.fbs
flatc -o tests tests/example.fbs --binary tests/example_input.json
