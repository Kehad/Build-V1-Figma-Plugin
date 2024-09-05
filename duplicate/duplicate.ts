figma.showUI(__html__);

// Show the plugin UI (optional, if you have one)
// figma.showUI(__html__);

// Check if the user has selected a component
// const selectedNode = figma.currentPage.selection[0];
// function duplicateComponent(node: SceneNode, xOffset: number = 100, yOffset: number = 100): SceneNode {
//     const duplicatedNode = node.clone(); // Clone the selected node
//     duplicatedNode.x = node.x + xOffset; // Offset the new node's x-position
//     duplicatedNode.y = node.y + yOffset; // Offset the new node's y-position
//     figma.currentPage.appendChild(duplicatedNode); // Add the duplicated node to the page
//     return duplicatedNode;
// }

// if (!selectedNode || (selectedNode.type !== 'COMPONENT' && selectedNode.type !== 'INSTANCE')) {
//     figma.notify("Please select a component or instance to duplicate.");
//     figma.closePlugin();
// } else {
//     // Function to duplicate a component

//     // Define the offset (adjust as needed)
//     const xOffset = 200;
//     const yOffset = 0; // You can adjust this for more vertical or grid-like layouts

//     // Duplicate the selected component
//     duplicateComponent(selectedNode, xOffset, yOffset);

//     figma.notify("Component duplicated successfully!");
//     figma.closePlugin();
// }

// const spacing: number = 20; // Define the spacing variable//+

function duplicateComponent(
  node: SceneNode,
  xOffset: number = 100,
    yOffset: number = 100,
  repetition: number = 0
): SceneNode {
  const duplicatedNode = node.clone(); // Clone the selected node
  duplicatedNode.x = node.x +  (repetition + 100) ; // Offset the new node's x-position
  duplicatedNode.y = node.y + yOffset ; // Offset the new node's y-position
  figma.currentPage.appendChild(duplicatedNode); // Add the duplicated node to the page
  return duplicatedNode;
}
figma.ui.onmessage = (msg) => {
  if (msg.type === "duplicateComponent") {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.notify("No nodes selected!");
    } else {
      selection.forEach((node) => {
        if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
          figma.notify("A component is selected!");
          console.log(node, node.type);
          
            for (let i = 0; i < msg.count; i++) {
                duplicateComponent(node, 100 + (i * 10), 100, i);
              // Clone the component
            }

          // Do something with the selected component
        } else {
          figma.notify("Please select a component or instance.");
          console.log(node, node.type);
        }
      });
    }
    //     if ("opacity" in node) {
    //       node.opacity = 0.2;
    //   }
    //   for (const node of figma.currentPage.selection) {
    //     // const xOffset = 200;

    //      const duplicatedNode = node.clone();
    //      duplicatedNode.x = node.x + 100; // Offset the new node's x-position
    //      duplicatedNode.y = node.y + 200; // Offset the new node's y-position
    //      //     const yOffset = 0;
    //      figma.currentPage.appendChild(duplicatedNode);
    //       // duplicateComponent(node, xOffset, yOffset);
    //       if ("opacity" in node) {
    //           node.opacity = 0.2;
    //       }
    //   }
  } else if (msg.type === "cancel") {
    figma.closePlugin();
    // console.a('aa')
  }

};
