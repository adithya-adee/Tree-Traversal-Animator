# Code Documentation
## Tree Traversal Animator - Implementation Details

This document provides detailed explanations of the key algorithms and design decisions in the codebase.

---

## Project Structure

```
src/
├── logic/           # Tree data structures and algorithms
│   ├── tree.js      # Binary Search Tree
│   ├── avl.js       # AVL Self-Balancing Tree  
│   ├── redBlackTree.js # Red-Black Self-Balancing Tree
│   ├── node.js      # Tree Node class
│   └── animations.js # Animation system
├── components/      # React UI components
│   ├── ControlPanel/
│   ├── VisualizationCanvas/
│   ├── Node/
│   └── Edge/
└── App.jsx         # Main application logic
```

---

## Core Algorithms

### 1. Binary Search Tree (BST) - `src/logic/tree.js`

#### Insert Algorithm
```
Time Complexity: O(h) where h = height
- Best case: O(log n) for balanced tree
- Worst case: O(n) for skewed tree

Algorithm:
1. Start at root
2. Compare value with current node
3. If value < current, go left; if value > current, go right
4. Repeat until find empty spot
5. Insert new node as leaf
6. No duplicates allowed - reject if value already exists
```

**Why this works**: BST property states left subtree < node < right subtree. By following this rule, we maintain the ordering property.

#### Delete Algorithm
```
Time Complexity: O(h)

Three cases to handle:
1. Leaf node (no children) - Simply remove it
2. One child - Replace node with its child
3. Two children - Replace with inorder successor (leftmost node in right subtree)

Why inorder successor? It's the next larger value, so it maintains BST property!
```

#### Tree Layout Algorithm
This was the trickiest part! The challenge: **dynamically fit any tree size on canvas**.

```
Steps:
1. Position root at center-top (fixed point)
2. Recursively position all children
3. Calculate tree bounds (how far it extends)
4. If tree overflows canvas:
   - Calculate scale factor needed
   - Scale all nodes around fixed root
   - Nodes shrink but maintain relative positions

Key insight: Keep root fixed, scale children around it!
```

**Horizontal Spacing Formula**:
```javascript
horizontal_spacing = baseWidth / (2^level)
```
This creates a nice tree shape where each level uses half the space of the parent level.

---

### 2. AVL Tree - `src/logic/avl.js`

AVL trees maintain **balance** after every insert/delete. Balance = height difference between left and right subtrees.

#### Balance Factor
```
balance_factor = height(left_subtree) - height(right_subtree)

Tree is balanced if: -1 ≤ balance_factor ≤ 1
```

#### Four Rotation Types

**1. LL Rotation (Left-Left Case)**
```
Problem: Left child's left subtree is too heavy
Solution: Right rotation

Before:        After:
    z            y
   /            / \
  y      -->   x   z
 /
x

Code: rotateRight(z)
```

**2. RR Rotation (Right-Right Case)**
```
Problem: Right child's right subtree is too heavy
Solution: Left rotation

Before:        After:
  x              y
   \            / \
    y    -->   x   z
     \
      z

Code: rotateLeft(x)
```

**3. LR Rotation (Left-Right Case)**
```
Problem: Left child's right subtree is too heavy
Solution: Left rotation on child, then right rotation on node

Before:         After:
    z             y
   /             / \
  x      -->    x   z
   \
    y

Code: rotateLeft(x), then rotateRight(z)
```

**4. RL Rotation (Right-Left Case)**
```
Problem: Right child's left subtree is too heavy
Solution: Right rotation on child, then left rotation on node

Before:        After:
  x              y
   \            / \
    z    -->   x   z
   /
  y

Code: rotateRight(z), then rotateLeft(x)
```

**Why rotations work**: They restructure the tree while maintaining BST property (left < parent < right).

#### Height Update
After every operation, we update heights bottom-up:
```javascript
height(node) = 1 + max(height(left), height(right))
```

**Time Complexity**: O(log n) guaranteed! Height never exceeds 1.44 * log(n).

---

### 3. Red-Black Tree - `src/logic/redBlackTree.js`

Red-Black trees maintain balance using **color properties**. More complex than AVL but same O(log n) guarantee.

#### Five Properties (Rules)
```
1. Every node is RED or BLACK
2. Root is always BLACK
3. All leaves (null) are BLACK
4. RED node cannot have RED child (no two reds in a row)
5. All paths from node to leaves have same # of BLACK nodes
```

**Why these rules?**: They ensure tree height ≤ 2 * log(n+1). Longest path can't be more than twice the shortest path.

#### Insertion Cases

**Case 1: Uncle is RED**
```
Solution: Recolor parent, uncle, and grandparent
- Parent: BLACK
- Uncle: BLACK
- Grandparent: RED
Then recurse upward
```

**Case 2: Uncle is BLACK, Node is Left-Left**
```
Solution:
1. Right rotation on grandparent
2. Swap colors of parent and grandparent
```

**Case 3: Uncle is BLACK, Node is Left-Right**
```
Solution:
1. Left rotation on parent
2. Now it's Case 2 - apply Case 2 fix
```

Similar cases for right-sided violations.

**Key insight**: Recoloring and rotations maintain all 5 properties!

#### Deletion Cases
Even more complex - 8 cases to handle! The algorithm:
1. Perform BST delete
2. If deleted node was BLACK, fix violations
3. Use sibling's color to determine which case

I won't lie - deletion is HARD. Took me forever to get right!

---

## Animation System - `src/logic/animations.js`

The animation system makes operations visual. Instead of instant changes, we generate "animation steps".

### Animation Types
```javascript
{
  type: 'highlight-node',    // Highlight a node (visiting it)
  type: 'update-tree',       // Update entire tree structure
  type: 'update-status',     // Update status message
  type: 'delay'              // Pause between steps
}
```

### How it Works
```
1. Each operation (insert/delete/search) generates animation array
2. App.jsx processes animations one by one
3. Each animation step updates React state
4. CSS animations handle the visual transitions
5. Result: Smooth, step-by-step visualization!
```

**Example - Insert Animation**:
```javascript
[
  { type: 'update-status', message: 'Searching for insert position' },
  { type: 'highlight-node', nodeId: 'node-5', state: 'visiting' },
  { type: 'highlight-node', nodeId: 'node-3', state: 'visiting' },
  { type: 'highlight-node', nodeId: 'node-7', state: 'inserted' },
  { type: 'update-tree', data: newTreeData }
]
```

---

## UI Components

### App.jsx - Main Application
This is the "brain" of the application. It manages:
- Current tree instance (BST/AVL/RB)
- Animation queue and playback
- State management (isAnimating, treeData, etc.)
- Undo/redo functionality

**Key Challenge**: Coordinating between animation system and React's re-render cycle. Used `flushSync` to force synchronous updates during animations.

### ControlPanel Component
Handles all user inputs:
- Insert/Delete/Search values
- Tree type selection (BST/AVL/RB)
- Traversal buttons
- Animation speed slider
- Export features (PNG/GIF)

**Design decision**: Disable all inputs during animation to prevent race conditions.

### VisualizationCanvas Component
Renders the actual tree visualization:
- Maps tree data to React components
- Positions nodes and edges based on calculated coordinates
- Applies animations via CSS classes
- Shows status messages

**Performance optimization**: Only re-renders when tree data changes, not on every animation step.

### Node Component
Individual node visualization:
- Displays node value
- Shows different colors based on state (default/visiting/found/inserted)
- Handles scale transformations for tree fitting
- CSS animations for pulse, bounce, fade effects

**Why CSS variables?**: To dynamically scale node sizes based on tree size. If tree is too big, nodes shrink proportionally.

### Edge Component
Renders connections between nodes:
- Calculates edge angle and length
- Rotates div element to connect parent to child
- Also scales with tree for consistent look
- Different styles for left vs right edges

**Math behind it**:
```javascript
distance = sqrt((x2-x1)² + (y2-y1)²)
angle = atan2(y2-y1, x2-x1) * 180/π
```

---

## Testing Strategy

### White-Box Testing
We test internal implementation:
- **Statement Coverage**: Execute every line
- **Branch Coverage**: Test all if/else branches  
- **Path Coverage**: Different execution sequences
- **Condition Coverage**: All boolean expressions

Example: For AVL insert, we test all 4 rotation cases explicitly.

### Black-Box Testing
We test external behavior:
- **Equivalence Partitioning**: Valid/invalid inputs
- **Boundary Value Analysis**: Edge cases (min/max, empty tree, single node)
- **Decision Tables**: Combinations of inputs
- **State Transitions**: Tree state changes

Example: Test inserting -2147483648 (minimum int) and 2147483647 (maximum int).

### Coverage Achieved
```
Statement Coverage: ~38% (before comprehensive tests)
After new tests: 96/100 tests passing
Key modules well-covered: tree.js, animations.js, components
```

**Why not 100%?**: Some edge cases in AVL/RB deletion are hard to trigger. Also, some code paths are for future features.

---

## Design Decisions & Trade-offs

### 1. Why Three Tree Types?
- **BST**: Simple, educational, shows why balancing matters
- **AVL**: Strictly balanced, good for search-heavy workloads
- **RB**: Less strict balancing, good for insert/delete-heavy workloads

Real-world: Many implementations (Java TreeMap, C++ map) use Red-Black trees!

### 2. Animation vs Performance
Trade-off: Animations slow down operations significantly.
- Without animations: Could process 1000s of operations/sec
- With animations: ~3-5 operations/sec

**Decision**: Animation more important than speed for educational tool.

### 3. Canvas Scaling vs Scrolling
Options considered:
- Make canvas scrollable
- Scale everything to fit

**Decision**: Dynamic scaling because it shows entire tree at once. Better user experience.

### 4. React vs Vanilla JS
**Why React?**
- Component reusability (Node, Edge)
- State management built-in
- Easy to animate with state changes
- Modern, maintainable codebase

**Trade-off**: Initial render slower, but smoother updates.

### 5. CSS Animations vs Canvas/SVG
Options:
- HTML/CSS (chosen)
- Canvas 2D
- SVG
- WebGL

**Why CSS?**:
- Easier to debug
- Better performance for small trees (<100 nodes)
- Declarative, readable code
- CSS animations handled by browser (smooth 60fps)

---

## Challenges Faced & Solutions

### Challenge 1: Tree Overflow
**Problem**: Large/skewed trees overflow canvas boundaries.

**Solution**: Dynamic scaling algorithm
- Calculate tree bounds
- Determine required scale factor
- Scale all nodes while keeping root fixed
- Apply safety margin (0.85x) to prevent edge touching

**Took forever to get right!** Had to account for asymmetric trees (all nodes on one side).

### Challenge 2: AVL Rotation Animations
**Problem**: How to show rotation visually?

**Solution**: 
- Generate animation steps showing color changes
- Update tree structure
- Recalculate layout
- Smooth transition via CSS

**Learning**: Rotations are conceptually simple but visually complex to show.

### Challenge 3: Red-Black Delete
**Problem**: 8 different cases, super complex!

**Solution**:
- Broke down into smaller functions
- Tested each case individually
- Added extensive comments
- Still the hardest part of the project!

**Honest admission**: I had to reference multiple sources (CLRS textbook, online tutorials) to get this right.

### Challenge 4: GIF Export
**Problem**: How to capture animation as GIF?

**Attempted solutions**:
1. Capture static frames - didn't show animation ❌
2. Manually step through animation - timing issues ❌
3. Replay animation while capturing frames - worked! ✓

**Final solution**: Store animation steps, replay them, capture each frame using `html-to-image`, combine into GIF using `gif.js`.

### Challenge 5: Stop & Reset During Animation
**Problem**: Users wanted to abort mid-animation.

**Solution**:
- Store tree state before animation starts
- Stop & Reset button clears animation queue
- Restores saved tree state
- Shows button only during animation

**Key learning**: Always save state before destructive operations!

---

## Future Improvements

If I had more time, I would add:
1. **More tree types**: B-trees, Splay trees, Treaps
2. **Step-by-step mode**: Manual control of each step
3. **Code visualization**: Show code executing alongside animation
4. **Performance graphs**: Plot height vs # of nodes
5. **Custom tree input**: Let users define initial tree structure
6. **Comparison mode**: Show BST vs AVL side-by-side
7. **Mobile responsive**: Currently desktop-only

---

## References & Learning Resources

**Books**:
- Introduction to Algorithms (CLRS) - For AVL and RB tree algorithms
- Data Structures and Algorithm Analysis (Weiss) - For BST fundamentals

**Online Resources**:
- VisuAlgo.net - Inspiration for visualization
- GeeksforGeeks - Algorithm references
- MDN Web Docs - React and JavaScript best practices

**Course Materials**:
- DSA lectures - Core concepts
- SWE principles - Testing strategies, code quality

---

## Conclusion

This project taught me:
1. **Data structures**: Deep understanding of tree algorithms
2. **Visualization**: How to make complex algorithms understandable
3. **React**: Modern web development practices
4. **Testing**: White-box and black-box methodologies
5. **Software Engineering**: Code organization, documentation, maintainability

The hardest part was definitely Red-Black tree deletion. The most rewarding part was seeing the animations work smoothly and receiving positive feedback!

**Total Time**: ~40-50 hours over 3-4 weeks

**Lines of Code**: ~3000+ lines (excluding tests and comments)

**Coffee consumed**: Too much ☕

