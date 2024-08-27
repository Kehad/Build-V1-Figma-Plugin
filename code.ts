// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  (msg: {type: string, count: number}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [
        { type: "SOLID", color: { r: 1, g: 0.5, b: 0 }, boundVariables: {} },
      ];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};


// figma.on("selectionchange", () => {
//   const selectedComponent = figma.currentPage.selection[0];
//   if (selectedComponent.type === "COMPONENT") {
//     figma.ui.postMessage({
//       type: "componentSelected",
//       component: selectedComponent,
//     });
//   }
// });

// Handle duplication and AI text/image replacement
// figma.ui.onmessage = async (msg) => {
//   if (msg.type === "duplicateComponent") {
//     const { component, rows, cols, prompts } = msg;

//     // Duplicate the component based on selected rows and cols
//     for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < cols; j++) {
//         const newInstance = component.createInstance();
//         newInstance.x += j * (component.width + spacing);
//         newInstance.y += i * (component.height + spacing);
//         figma.currentPage.appendChild(newInstance);

//         // Replace dummy text and images with AI-generated content
//         const textNodes = newInstance.findAll((node) => node.type === "TEXT");
//         const imageNodes = newInstance.findAll(
//           (node) => node.type === "RECTANGLE"
//         );

//         // Loop through selected text/image nodes and replace content
//         textNodes.forEach((textNode, index) => {
//           textNode.characters = prompts.text[index]; // AI text here
//         });
//         // Similar process for images...
//       }
//     }
//   }
// };