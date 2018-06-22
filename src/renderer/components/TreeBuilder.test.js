const assert = require('assert');
const { growTree, createTree } = require('./TreeBuilder.js')

const tests = {
  'createTree should be a function': function () {
    const actual = typeof createTree;
    assert(actual === "function", `Expected ${actual} to be "function"`);
  },
  'createTree should return an array': function () {
    const actual = createTree(['']);
    assert(Array.isArray(actual), 'Array not returned');
  },
  'createTree should handle a single file, stripping out ./': function () {
    const actual = createTree(['./myfile.js']);
    const expected = [{
      title: 'myfile.js',
      expand: true,
      children: [],
      checked: true
    }]
    assert.deepStrictEqual(actual, expected);
  },
  'createTree should handle straight filename without ./': function () {
    const actual = createTree(['myfile.js']);
    const expected = [{
      title: 'myfile.js',
      expand: true,
      children: [],
      // checked: true
    }]
    assert.deepStrictEqual(actual, expected);
  },
  'createTree should handle multiple files on root level': function () {
    const actual = createTree(['file1.js', 'file2.js']);
    const expected = [{
      title: 'file1.js',
      expand: true,
      children: [],
      checked: true
    }, {
      title: 'file2.js',
      expand: true,
      children: [],
      checked: true
    }]
    assert.deepStrictEqual(actual, expected);
  },
  'createTree should handle file in folder': function () {
    const actual = createTree(['./test/file1.js']);
    const expected = [{
      title: 'test',
      expand: true,
      children: [{
        title: 'file1.js',
        expand: true,
        children: []
      }],
      checked: true
    }]
    assert.deepStrictEqual(actual[0], expected[0]);
  },
  'createTree should handle multiple files in folder': function () {
    const actual = createTree(['./test/file1.js', './test/file2.js']);
    const expected = [{
      title: 'test',
      expand: true,
      children: [{
        title: 'file1.js',
        expand: true,
        children: []
      }, {
        title: 'file2.js',
        expand: true,
        children: []
      }],
      checked: true
    }]
    assert.deepStrictEqual(actual[0], expected[0]);
  },
  'createTree should handle nested folders': function () {
    const actual = createTree(['./test/specs/file1.js']);
    const expected = [{
      title: 'test',
      expand: true,
      children: [{
        title: 'specs',
        expand: true,
        children: [{
          title: 'file1.js',
          expand: true,
          children: []
        }]
      }],
      checked: true
    }]
    assert.deepStrictEqual(actual[0], expected[0]);
  },
  'createTree should handle multiple files in nested folders': function () {
    const actual = createTree(['./test/specs/file1.js', './test/specs/file2.js']);
    const expected = [{
      title: 'test',
      expand: true,
      children: [{
        title: 'specs',
        expand: true,
        children: [{
          title: 'file1.js',
          expand: true,
          children: []
        }, {
          title: 'file2.js',
          expand: true,
          children: []
        }]
      }],
      checked: true
    }]
    assert.deepStrictEqual(actual[0], expected[0]);
  },
  'createTree should handle it all': function () {
    const actual = createTree([
      './test/specs/file1.js',
      './test/specs/a/file2.js',
      './test/specs/b/file3.js',
      ]);
    const expected = [{
      title: 'test',
      expand: true,
      children: [{
        title: 'specs',
        expand: true,
        children: [{
          title: 'file1.js',
          expand: true,
          children: []
        }, {
          title: 'a',
          expand: true,
          children: [{
            title: 'file2.js',
            expand: true,
            children: []
          }]
        }, {
          title: 'b',
          expand: true,
          children: [{
            title: 'file3.js',
            expand: true,
            children: []
          }]
        }]
      }],
      checked: true
    }]
    assert.deepStrictEqual(actual[0].children[0], expected[0].children[0]);
    assert.deepStrictEqual(actual[0], expected[0]);
  },
};

let exitCode = 0;
Object.keys(tests).forEach((test) => {
  try {
    tests[test]()
    console.log(`Passed: '${test}'`)
  } catch (e) {
    exitCode = 1
    console.error('\x1b[1m', `Failed: '${test}' - ${e.message}`, '\x1b[0m')
  }
})

process.exit(exitCode)