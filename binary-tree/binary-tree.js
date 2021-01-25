// Select the rendering stage
const stage = d3.select(svg);

// Some layout variables
const radius = 25;
const row_sep = 75;
const col_sep = 50;

// Layout the rest of the tree
const [tree, tree_width, tree_depth] = knuth($binaryTree_r);

// Render links
const links = treeLinks(tree);
const line = d3.line().x(x).y(y);

stage.selectAll('path')
  .data(links)
  .join('path')
  .attr('d', line)
  .style('stroke', 'black');

// Render nodes
const nodes = treeNodes(tree);
stage.selectAll('circle')
  .data(nodes)
  .join('circle')
  .attr('cx', x)
  .attr('cy', y)
  .attr('r', radius)
  .style('stroke', 'black')
  .style('fill', 'white');

stage.selectAll('text')
  .data(nodes)
  .join('text')
  .attr('x', x)
  .attr('y', y)
  .attr('dy', '0.31em')
  .style('text-anchor', 'middle')
  .style('user-select', 'none')
  .text(n => n.name.slice(0, 1) + n.name.slice(-1))

// Build a knuth tree layout
function knuth (root) {
  let i = 0;
  let d = 0;
  function layout (node, depth) {
    if (depth > d ) d = depth;
    const lnode = node.left;
    const rnode = node.right;
    const l = lnode.empty() ? null : layout(lnode, depth+1);
    const x = i++;
    const y = depth;
    const r = rnode.empty() ? null : layout(rnode, depth+1);
    return {
      name: node.toString(),
      x, y, l, r
    }
  }
  return [layout(root, 0), i, d];
}

// Calculate the x-coordinate of a node
function x (n) {
  return n.x * col_sep + width/2 - col_sep * ((tree_width-1) / 2);
}

// Calculate the y-coordinate of a node
function y (n) {
  return n.y * row_sep + height/2 - row_sep * (tree_depth / 2);
}

// Get a list of all nodes in a tree
function treeNodes (root) {
  const nodes = [];
  each(root, n => nodes.push(n));
  return nodes;
}

// Get a list of all links in a tree
function treeLinks (root) {
  const links = [];
  each(root, n => {
    if (n.l) links.push([n, n.l]);
    if (n.r) links.push([n, n.r]);
  });
  return links;
}

// Tree traversal
function each (node, callback) {
  let nd = node,
      current,
      next = [node];
  
  do {
    current = next;
    next = [];
    while (!!(nd = current.pop())) {
      callback(nd);
      if (nd.l) next.push(nd.l);
      if (nd.r) next.push(nd.r);
    }
  } while (next.length);
}
