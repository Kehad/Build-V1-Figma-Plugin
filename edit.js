"use strict";
figma.showUI(__html__);
figma.ui.onmessage = async (msg) => {
    if (msg.type === "replace-text") {
        await replaceText(msg.newText, msg.instanceValue);
        // 9;
        // await replaceText(oldText, newText);
    }
    else if (msg.type === "upload-image") {
        // await replaceImage(imageName, newImageUrl);
        console.log(msg.imageBytes);
        console.log('Upload Image');
        //   const image = figma.createImage(new Uint8Array(msg.imageBytes));
        //   console.log(image);
        //   modifyImage()
    }
};
function nodeSelection() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify("No nodes selected!");
    }
    else {
        selection.forEach(async (node) => {
            if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
                figma.notify("A component is selected!");
                const componentId = node.id;
                for (let i = 0; i < instanceValue; i++) {
                    const newInstance = await createComponentInstance(componentId, 100, 100);
                }
            }
            else {
                figma.notify("Please select a component or instance.");
            }
        });
    }
}
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
function inspectComponent(node) {
    console.log("Inspecting component:", node.name);
    // Log the component's children
    node.children.forEach((child, index) => {
        console.log(`Child ${index + 1}: ${child.name} (Type: ${child.type})`);
    });
    // Check for component properties
    if ("componentPropertyDefinitions" in node) {
        const propertyDefinitions = node.componentPropertyDefinitions;
        console.log(propertyDefinitions);
        // Log the component property definitions
        console.log("Component Property Definitions:", propertyDefinitions);
        // Iterate through the properties and see what the component defines
        for (const [propertyName, propertyDefinition] of Object.entries(propertyDefinitions)) {
            console.log(`Property Name: ${propertyName}`);
            console.log(`Type: ${propertyDefinition.type}`);
            console.log(`Default Value: ${propertyDefinition.defaultValue}`);
        }
    }
}
async function modifyTextNode(textNode, newText) {
    // Check if the font is available for this text node
    const fontName = textNode.fontName;
    // Load the font asynchronously
    //    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    await figma.loadFontAsync(fontName);
    // Once the font is loaded, you can safely modify the text
    textNode.characters = newText;
}
function modifyImage(imageNode, imageBytes) {
    const rect = imageNode;
    // Check if the rectangle has image fills
    if (rect.fills && rect.fills.length > 0) {
        const fills = rect.fills;
        // Find the first fill that is of type 'IMAGE'
        const imageFill = fills.find((fill) => fill.type === "IMAGE");
        if (imageFill) {
            // Create a new image from the byte array
            const newImage = figma.createImage(imageBytes);
            // Replace the old image fill with the new image
            const newFills = [...fills];
            const newImageFill = Object.assign(Object.assign({}, imageFill), { imageHash: newImage.hash });
            newFills.splice(fills.indexOf(imageFill), 1, newImageFill);
            // Apply the new fills to the rectangle
            rect.fills = newFills;
        }
    }
}
async function replaceText(newText, instanceValue) {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify("No nodes selected!");
    }
    else {
        selection.forEach(async (node) => {
            if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
                figma.notify("A component is selected!");
                const componentId = node.id;
                for (let i = 0; i < instanceValue; i++) {
                    const newInstance = await createComponentInstance(componentId, 100, 100);
                    if (newInstance) {
                        inspectComponent(newInstance); // If you want to inspect the newly created instance
                    }
                    newInstance === null || newInstance === void 0 ? void 0 : newInstance.children.forEach(async (child, index) => {
                        console.log(`Child ${index + 1}: ${child.name} (Type: ${child.type})`);
                        if (child.type === "TEXT") {
                            modifyTextNode(child, newText);
                        }
                        if (child.type === "RECTANGLE") {
                            console.log('rectangle');
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
// async function replaceImage(imageName: string, newImageUrl: string) {
//   const imageNodes = figma.currentPage.findAll(
//     (node) => node.type === "RECTANGLE" && node.name === imageName
//   );
//   try {
//     const image = await figma.createImage();
//     for (const node of imageNodes) {
//       if (node.type === "RECTANGLE") {
//         node.fills = [
//           { type: "IMAGE", scaleMode: "FILL", imageHash: image.hash },
//         ];
//       }
//     }
//     figma.notify(`Replaced ${imageNodes.length} image elements`);
//   } catch (error) {
//     figma.notify("Error loading image: " + error);
//   }
// }
// Assume `imageBytes` contains the byte array of your image
// async function addImageToRectangle(imageBytes: Uint8Array) {
//   // Create an image object from the byte array
//   const image = figma.createImage(imageBytes);
//   // Create a new rectangle
//   const rect = figma.createRectangle();
//   rect.resize(200, 200); // Set size of the rectangle
//   // Apply the image as a fill to the rectangle
//   rect.fills = [
//     {
//       type: "IMAGE",
//       imageHash: image.hash,
//       scaleMode: "FILL",
//     },
//   ];
//   // Append the rectangle to the current page
//   figma.currentPage.appendChild(rect);
//   // Center the viewport on the new rectangle
//   figma.viewport.scrollAndZoomIntoView([rect]);
// }
// Example usage: Fetch an image from a URL and use it
// fetch("https://example.com/image.png") // Replace with your image URL
//   .then((response) => response.arrayBuffer())
//   .then((buffer) => {
//     const imageBytes = new Uint8Array(buffer);
//     addImageToRectangle(imageBytes);
//   })
//   .catch((error) => {
//     console.error("Error loading image:", error);
//   });
// Function to modify children of a component instance
// function modifyComponentChildren(instance: InstanceNode) {
//   console.log('Modifying children of instance:', instance.name);
//   // Iterate through all children of the instance
//   instance.children.forEach((child, index) => {
//     // Check the type of the child and modify accordingly
//     switch (child.type) {
//       case 'TEXT':
//         child.characters = `Modified Text ${index + 1}`;
//         console.log(`Modified text of child ${index + 1}`);
//         break;
//       case 'RECTANGLE':
//       case 'ELLIPSE':
//         if ('fills' in child) {
//           // Change the fill color to a random color
//           const r = Math.random() * 255;
//           const g = Math.random() * 255;
//           const b = Math.random() * 255;
//           child.fills = [{ type: 'SOLID', color: { r: r/255, g: g/255, b: b/255 } }];
//           console.log(`Changed color of child ${index + 1}`);
//         }
//         break;
//       case 'FRAME':
//       case 'GROUP':
//         // For frames or groups, we could recursively modify their children
//         // This is left as an exercise for more complex scenarios
//         console.log(`Child ${index + 1} is a ${child.type}. Skipping for now.`);
//         break;
//       default:
//         console.log(`Child ${index + 1} is of type ${child.type}. No modification applied.`);
//     }
//   });
// }
