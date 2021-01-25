# Binary Tree

A binary tree representation.

## `binary-tree.js`

Renders the tree using the basic Knuth layout algorithm, pulled from 
[here](http://llimllib.github.io/pymag-trees/) (this page contains
other algorithms that give us different visual properties; could be 
fun to implement some of these).

Node names are shortened from, e.g., Branch$0 to B0 and Leaf$0 to L0.
The left and right labels are omitted from edges, as nodes are actually
laid out to the left and right of their parent.

Some screenshots are included in the `/images` directory.

Requires:
* Stage: `<svg>`
* Libraries:
  * D3