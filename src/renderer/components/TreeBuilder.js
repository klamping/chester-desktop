const path = require('path')

function growTree (tree, nodes, parentPath) {
  // check if branch exists
  let branch = tree.find((item) => item.title === nodes[0]);

  // if not, create it
  if (!branch) {
    branch = {
      title: nodes[0],
      expand: false,
      path: parentPath,
      children: []
    }
    tree.push(branch);
  }

  if (nodes.length > 1) {
    const newParentPath = parentPath + path.sep + branch.title;
    // go down the stem, creating more if necessary
    growTree(branch.children, nodes.slice(1), newParentPath);
  }

  return tree;
}

function createTree (files, parent) {
  let tree = [];

  files.forEach(file => {
    let nodes = file.split(path.sep);
    if (nodes.length > 1) {
      nodes = nodes.slice(1)
    }
    tree = growTree(tree, nodes, '');
  })

  // check all at the root level
  tree = tree.map(file => {
    file.checked = true;
    file.expand = true;
    return file;
  });

  return tree;
}

module.exports = {
  growTree,
  createTree
};
