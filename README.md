# Tree Traversal Animator

A powerful and interactive web application for visualizing tree data structures and their traversal algorithms, built with Vite and React. This tool allows users to observe the dynamic behavior of various tree operations and traversals with clear animations and controls.

## Features

Our Tree Traversal Animator offers a comprehensive set of features to enhance understanding and exploration of tree data structures:

*   **Supported Tree Types**: Visualize operations on different types of binary trees, including:
    *   **Binary Search Tree (BST)**
    *   **AVL Tree**
    *   **Red-Black Tree**
    
*   **Traversal Algorithms**: Observe the step-by-step execution of classic tree traversal algorithms:
    *   **Inorder Traversal**
    *   **Preorder Traversal**
    *   **Postorder Traversal**

*   **Interactive Operations**:
    *   **Insert Node**: Dynamically add new nodes to the tree and watch the rebalancing and positioning.
    *   **Delete Node**: Remove existing nodes and see how the tree reconstructs itself.
    *   **Search Node**: Highlight the path taken to find a specific node.
    *   **Clear Tree**: Reset the visualization to an empty tree.

*   **Animation Control**:
    *   **Animation Speed Control**: Adjust the speed of animations to suit your learning pace, allowing for detailed observation or quick reviews.
    *   **Undo/Redo Functionality**: Easily revert or re-apply tree operations, providing flexibility for experimentation and error correction.

*   **Export Options**:
    *   **GIF Export**: Create animated GIFs of your tree operations and traversals to share or include in presentations.
    *   **PNG Export**: Export the current state of the tree as a high-quality PNG image.
    *   **SVG Export**: Export the tree visualization as a scalable vector graphic (SVG).
    *   **JPEG Export**: Export the current state of the tree as a JPEG image.

## Technologies Used

This project is built with modern web technologies to deliver a smooth and responsive user experience:

*   **Vite**: A fast frontend build tool that provides an excellent development experience.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.

### Libraries

The application leverages the following key libraries:

*   `gif.js`: For creating animated GIFs directly in the browser.
*   `html-to-image`: For converting HTML elements to various image formats (PNG, JPEG, SVG).
*   `react`: The core React library.
*   `react-dom`: React package for working with the DOM.

## Installation and Running Locally

To get started with the Tree Traversal Animator on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/adithya-adee/Tree-Traversal-Animator.git
    cd Tree-Traversal-Animator
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    This command downloads and installs all the necessary project dependencies listed in `package.json`.

3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will start a local development server, usually accessible at `http://localhost:5173`.

4.  **Open in Browser**:
    Open your web browser and navigate to the `localhost` link provided in your terminal to view and interact with the application.