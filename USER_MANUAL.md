# Tree Traversal Animator - User Manual

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Getting Started](#2-getting-started)
3.  [User Interface Overview](#3-user-interface-overview)
    *   [Control Panel](#control-panel)
    *   [Visualization Canvas](#visualization-canvas)
    *   [Status Bar](#status-bar)
4.  [Core Functionality](#4-core-functionality)
    *   [Selecting Tree Type](#selecting-tree-type)
    *   [Node Operations](#node-operations)
        *   [Inserting a Node](#inserting-a-node)
        *   [Deleting a Node](#deleting-a-node)
        *   [Searching for a Node](#searching-for-a-node)
    *   [Tree Traversal Algorithms](#tree-traversal-algorithms)
        *   [Inorder Traversal](#inorder-traversal)
        *   [Preorder Traversal](#preorder-traversal)
        *   [Postorder Traversal](#postorder-traversal)
    *   [Animation Controls](#animation-controls)
        *   [Adjusting Animation Speed](#adjusting-animation-speed)
        *   [Undo/Redo Actions](#undoredo-actions)
        *   [Clearing the Tree](#clearing-the-tree)
5.  [Exporting Visualizations](#5-exporting-visualizations)
    *   [Export as GIF](#export-as-gif)
    *   [Export as PNG](#export-as-png)
    *   [Export as SVG](#export-as-svg)
    *   [Export as JPEG](#export-as-jpeg)
6.  [Status and Feedback](#6-status-and-feedback)
7.  [Troubleshooting](#7-troubleshooting)
8.  [Conclusion](#8-conclusion)

---

## 1. Introduction

Welcome to the Tree Traversal Animator! This application is designed to provide an interactive and visual way to understand various tree data structures and their associated traversal algorithms. By animating each step of an operation or traversal, you can gain deeper insights into how these fundamental computer science concepts work.

This manual will guide you through all the features and functionalities of the application, helping you to make the most of your learning experience.

## 2. Getting Started

Before you can use the application, ensure it is installed and running on your local machine. Please refer to the `INSTALL.md` file for detailed instructions on how to set up and run the application.

Once the development server is running, open your web browser and navigate to the `localhost` address provided in your terminal (e.g., `http://localhost:5173`).

## 3. User Interface Overview

The application's interface is divided into three main sections:

[User Interface Overview] (./asset/user-interface.png)

### Control Panel
Located on the left side of the screen, the Control Panel houses all the input fields, buttons, and settings for interacting with the tree. Here you can select tree types, perform operations, trigger traversals, and adjust animation settings.

### Visualization Canvas
The central and largest area of the screen, the Visualization Canvas, is where the tree is dynamically rendered. Nodes and edges will appear, move, and change color according to the operations and animations you trigger.

### Status Bar
At the bottom of the Visualization Canvas, the Status Bar provides real-time feedback. It displays messages about the current operation, animation status, and the values processed during traversals.


## 4. Core Functionality

This section details how to use the various features of the application.

### Selecting Tree Type

At the top of the Control Panel, you will find an option to select the type of tree you want to visualize.

[Tree Type Selection] (./asset/tree-type-selection.png)

*   Currently, only **Binary Search Tree (BST)** is fully supported.
*   Future updates may include support for AVL Trees and Red-Black Trees.

To change the tree type:
1.  Click the dropdown menu or radio buttons (depending on the implementation) in the Control Panel.
2.  Select the desired tree type.
    *   **Note**: Changing the tree type will clear the current tree, undo/redo history, and start with a fresh, empty tree of the selected type.

### Node Operations

You can perform fundamental operations on the tree through the Control Panel.

[Node Operations] (./asset/node-operations.png)

#### Inserting a Node
To add a new node to the tree:
1.  Enter a numerical value into the "Insert" input field in the Control Panel.
2.  Click the "Insert" button.
3.  Observe as the node is inserted into its correct position with animated steps. The Status Bar will provide messages about the process.
    *   **Note**: Only valid numbers can be inserted. Invalid input will result in a status message.

#### Deleting a Node
To remove an existing node from the tree:
1.  Enter the numerical value of the node you wish to delete into the "Delete" input field.
2.  Click the "Delete" button.
3.  Watch the animation as the node is removed and the tree is re-structured.
    *   **Note**: If the value does not exist in the tree, a status message will indicate this.

#### Searching for a Node
To locate a specific node in the tree:
1.  Enter the numerical value of the node you are searching for into the "Search" input field.
2.  Click the "Search" button.
3.  The animation will highlight the path taken to find the node, indicating if it was found or not.

### Tree Traversal Algorithms

The application supports three common tree traversal algorithms. When a traversal is initiated, the Status Feed will display the order in which nodes are visited.

*   **Note**: You cannot perform other operations while a traversal animation is active. You have to stop the current traversal , then you can perform other operations.

[Tree Traversal Algorithms] (./asset/tree-traversal-algo.png)

#### Inorder Traversal
1.  Click the "Inorder" button in the "Traversals" section of the Control Panel.
2.  The tree will animate, visiting nodes in sorted order (for BSTs). The Status Feed will update with the values as they are visited.

#### Preorder Traversal
1.  Click the "Preorder" button in the "Traversals" section.
2.  The animation will show the root-left-right visiting order. The Status Feed will display the sequence.

#### Postorder Traversal
1.  Click the "Postorder" button in the "Traversals" section.
2.  The animation will follow the left-right-root visiting order. The Status Feed will show the resulting sequence of nodes.

### Animation Controls

Manage the flow and history of your tree interactions.

[Animation Control] (./asset/utility.png)

#### Adjusting Animation Speed
1.  Use the "Animation Speed" slider or input field in the Control Panel to change the duration of each animation step (in milliseconds).
2.  Moving the slider to a lower millisecond value will make animations faster; a higher value will make them slower.
    *   **Note**: Changes to animation speed apply immediately to ongoing and subsequent animations.

#### Undo/Redo Actions
The application keeps a history of your tree operations (insert, delete, clear).

*   **Undo**: Click the "Undo" button to revert the tree to its previous state. This is useful for correcting mistakes or re-observing previous states.
*   **Redo**: Click the "Redo" button to re-apply an action that was previously undone.
    *   **Note**: Undo/Redo is disabled during animations and when no history is available.

#### Clearing the Tree
1.  Click the "Clear Tree" button in the Control Panel.
2.  This will remove all nodes from the current tree, resetting it to an empty state. The action is recorded in the undo history.

## 5. Exporting Visualizations

You can export the current state or an animated sequence of your tree visualization.

*   **Note**: Export functions are disabled while an animation or traversal is in progress.

[Export Functionalities] (./asset/export-functionality.png)

### Export as GIF
1.  Click the "Export GIF" button, from the Dropdown Menu on the left-bottom corner.
2.  The application will record the current state of the visualization canvas and then export it as an animated GIF file. This will typically download automatically to your browser's default downloads folder.

### Export as PNG
1.  Click the "Export PNG" button, from the Dropdown Menu on the left-bottom corner.
2.  A static image of the current tree visualization will be saved as a PNG file.

### Export as SVG
1.  Click the "Export SVG" button, from the Dropdown Menu on the left-bottom corner.
2.  The current tree visualization will be exported as a Scalable Vector Graphics (SVG) file, which can be scaled without loss of quality.

### Export as JPEG
1.  Click the "Export JPEG" button, from the Dropdown Menu on the left-bottom corner.
2.  A static image of the current tree visualization will be saved as a JPEG file.

## 6. Status and Feedback

*   **Status Message**: Located in the Status Bar, this area displays brief messages about the current state of the application, such as "Ready to start", "Inserting 10", "Animation complete", or error messages.
*   **Status Feed**: During traversals, this section of the Status Bar will list the values of nodes as they are visited, providing a clear record of the traversal path. You can clear the Status Feed by clicking the **"Clear Status"** button next to it.

## 7. Troubleshooting

*   **"Please enter a valid number"**: Ensure you are entering only numerical values into the input fields for insert, delete, and search operations.
*   **Buttons are disabled**: This usually means an animation or traversal is currently active. Wait for the animation to complete before attempting another action.
*   **Tree doesn't update**: If you perform an action and the tree doesn't visually change, check the Status Message for any error or informational feedback.
*   **Performance issues**: For very large trees or extremely fast animation speeds, you might experience minor performance dips. Adjusting the animation speed can help.

## 8. Conclusion

We hope this User Manual helps you effectively use the Tree Traversal Animator. This tool is designed to be an educational aid, and we encourage you to experiment with different operations and traversals to deepen your understanding of tree data structures.

Happy visualizing!