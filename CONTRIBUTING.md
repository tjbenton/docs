<!-- # NOTE: DO NOT OPEN ISSUES FOR QUESTIONS AND SUPPORT. SEE THE README FOR MORE INFO. -->

----

<p align="center">
   <strong><a href="#setup">Setup</a></strong>
   |
   <strong><a href="#running-tests">Running tests</a></strong>
   |
   <strong><a href="#writing-tests">Writing tests</a></strong>
</p>

----

# Contributing

Contributions are always welcome, no matter how large or small.


#### Setup

```bash
git clone github.com/tjbenton/docs
cd docs
make install
```

Then you can either run:

```bash
make build
```

to build Docs **once** or:

```bash
make watch
```

to have Docs build itself and incrementally build files on change.

You can access the built files for individual packages from `packages/<package-name>/lib`.

#### Running tests

You can run tests for all packages via:

```bash
make test
```

To run tests for a specific package, you can pass a glob path to `make test`:

```bash
make test -- glob/path/to/file(s)
```


#### Writing tests

Most packages in [`/packages`](/packages) have a `tests` folder

##### `docs-plugin-x`

All the Docs plugins (and other packages) that have a `/tests/fixtures` are written in a similar way.

To generate your test result run `create-test <package> 'glob'`. For example to create a test case for `docs-parser` you would do the following

  1. Create a test in `packages/docs-parser/tests/fixtures/cases/`
  2. If a `create.js` is not located under `tests/fixtures` then you must create one and author how you want this test to be created. See [docs-parser](/packages/docs-parser/tests/fixtures/create.js) for an example.
  3. Write the input in what ever language you want to (not `json` because it doesn't support comments)
  4. run `create-test docs-parser 'cases/name-of-test.js'`
  5. ensure that the output of `cases/name-of-test.json` is correct.
