"use strict";
figma.showUI(__html__);
// figma.showUI(__html__, {
//   width: 400,
//   height: 300,
//   title: 'Componento',  // Hides the header with the close button
//   themeColors: false  // Uses your custom background (no default header)
// });
figma.ui.resize(350, 500);
figma.ui.onmessage = async (msg) => {
    if (msg.type === "replace-all") {
        await replaceText(msg.newText, msg.instanceValue, msg.imageBytes);
    }
};
async function createComponentInstance(componentId, x, y) {
    // Get the component by its ID
    const component = (await figma.getNodeByIdAsync(componentId));
    if (!component || component.type !== "COMPONENT") {
        console.error("Invalid component ID or node is not a component");
        return null;
    }
    // Create an instance of the component
    const instance = component.createInstance();
    // Set the position of the instance
    instance.x = x;
    instance.y = y;
    console.log(`Created instance of component "${component.name}" at (${x}, ${y})`);
    return instance;
}
// function inspectComponent(node: ComponentNode | InstanceNode) {
//   // Log the component's children
//   node.children.forEach((child, index) => {
//     console.log(`Child ${index + 1}: ${child.name} (Type: ${child.type})`);
//   });
//   // Check for component properties
//   if ("componentPropertyDefinitions" in node) {
//     const propertyDefinitions = node.componentPropertyDefinitions;
//     console.log(propertyDefinitions);
//     // Log the component property definitions
//     console.log("Component Property Definitions:", propertyDefinitions);
//     // Iterate through the properties and see what the component defines
//     for (const [propertyName, propertyDefinition] of Object.entries(
//       propertyDefinitions
//     )) {
//       console.log(`Property Name: ${propertyName}`);
//       console.log(`Type: ${propertyDefinition.type}`);
//       console.log(`Default Value: ${propertyDefinition.defaultValue}`);
//     }
//   }
// }
async function modifyTextNode(textNode, newText) {
    // Check if the font is available for this text node
    const fontName = textNode.fontName;
    // Load the font asynchronously
    // await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    await figma.loadFontAsync(fontName);
    // Once the font is loaded, you can safely modify the text
    textNode.characters = newText;
}
async function modifyImageNode(imageNode, imageBytes) {
    const rect = imageNode;
    //             // Check if the rectangle has image fills
    console.log(rect);
    if (rect.fills) {
        const fills = rect.fills;
        // Find the first fill that is of type 'IMAGE'
        const imageFill = fills.find((fill) => fill.type === "IMAGE");
        if (imageFill) {
            // Create a new image from the byte array
            const newImage = figma.createImage(imageBytes);
            const newImageFill = Object.assign({}, imageFill, {
                imageHash: newImage.hash,
            });
            const updatedFills = fills.map((fill) => {
                if (fill.type === "IMAGE") {
                    return newImageFill;
                }
                return fill;
            });
            // Set the updated fills on the rectangle
            rect.fills = updatedFills;
        }
    }
}
/// REPLACE TEST
async function replaceText(newText, instanceValue, imageBytes) {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify("No nodes selected!");
    }
    else {
        selection.forEach(async (node) => {
            if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
                const componentId = node.id;
                for (let i = 0; i < instanceValue; i++) {
                    const newInstance = await createComponentInstance(componentId, 100, 100);
                    // if (newInstance) {
                    //   inspectComponent(newInstance); // If you want to inspect the newly created instance
                    // }
                    newInstance === null || newInstance === void 0 ? void 0 : newInstance.children.forEach(async (child, index) => {
                        console.log(`Child ${index + 1}: ${child.name} (Type: ${child.type})`);
                        if (child.type === "TEXT") {
                            await modifyTextNode(child, newText);
                        }
                        if (child.type === "RECTANGLE") {
                            await modifyImageNode(child, imageBytes);
                        }
                    });
                }
            }
            else {
                figma.notify("Please select a component or instance.");
            }
        });
    }
}
function showUI(arg0) {
    throw new Error("Function not implemented.");
}
// REPLACE IMAGE
// async function replaceImage(imageBytes: Uint8Array) {
//   const selection = figma.currentPage.selection;
//   if (selection.length === 0) {
//     figma.notify("No nodes selected!");
//   } else {
//     selection.forEach(async (node) => {
//       if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
//         figma.notify("A component is selected!");
//         const componentId = node.id;
//         for (let i = 0; i < 5; i++) {
//           const newInstance = await createComponentInstance(
//             componentId,
//             100,
//             100
//           );
//           if (newInstance) {
//             inspectComponent(newInstance); // If you want to inspect the newly created instance
//           }
//           newInstance?.children.forEach(async (child, index) => {
//             console.log(
//               `Child ${index + 1}: ${child.name} (Type: ${child.type})`
//             );
//               if (child.type === "RECTANGLE") {
//                 console.log(`12rectangle child ${child} ${imageBytes}`);
//                 console.log(child, imageBytes);
//               await modifyImageNode(child, imageBytes);
//             }
//           });
//         }
//       } else {
//         figma.notify("Please select a component or instance.");
//       }
//     });
//   }
// }
