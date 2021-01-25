abstract sig Node {}
sig Leaf extends Node {}
sig Branch extends Node {
  left: one Node,
  right: one Node
}

pred binaryTree {
  some r: Node {
    Node in r.^(left + right) + r
  }
  all n: Node {
    n not in n.^(left + right)
    lone n.~(left + right)
    no n.left & n.right
  }
}

run binaryTree for exactly 4 Branch, 5 Leaf
