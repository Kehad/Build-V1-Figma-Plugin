figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "replace-text") {
    await replaceText(msg.newText, msg.instanceValue);
    // 9;
    // await replaceText(oldText, newText);
  } else if (msg.type === "replace-image") {
    // await replaceImage(imageName, newImageUrl);
  }
};

async function createComponentInstance(
  componentId: string,
  x: number,
  y: number
) {
  // Get the component by its ID
  const component = (await figma.getNodeByIdAsync(
    componentId
  )) as ComponentNode;

  if (!component || component.type !== "COMPONENT") {
    console.error("Invalid component ID or node is not a component");
    return null;
  }

  // Create an instance of the component
  const instance = component.createInstance();

  // Set the position of the instance
  instance.x = x;
  instance.y = y;

  console.log(
    `Created instance of component "${component.name}" at (${x}, ${y})`
  );

  return instance;
}

function inspectComponent(node: ComponentNode | InstanceNode) {
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
    for (const [propertyName, propertyDefinition] of Object.entries(
      propertyDefinitions
    )) {
      console.log(`Property Name: ${propertyName}`);
      console.log(`Type: ${propertyDefinition.type}`);
      console.log(`Default Value: ${propertyDefinition.defaultValue}`);
    }
  }
}

async function modifyTextNode(textNode: TextNode, newText: string) {
  // Check if the font is available for this text node
  const fontName = textNode.fontName as FontName;

  // Load the font asynchronously
  //    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
  await figma.loadFontAsync(fontName);

  // Once the font is loaded, you can safely modify the text
  textNode.characters = newText;
}

async function replaceText(newText: string, instanceValue: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("No nodes selected!");
  } else {
    selection.forEach(async (node) => {
      if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
        figma.notify("A component is selected!");
          const componentId = node.id;
          for (let i = 0; i < instanceValue; i++) {
              const newInstance = await createComponentInstance(componentId,100,100);
                if (newInstance) {
                  inspectComponent(newInstance); // If you want to inspect the newly created instance
                }
              newInstance?.children.forEach(async (child, index) => {
                console.log(
                  `Child ${index + 1}: ${child.name} (Type: ${child.type})`
                );
                if (child.type === "TEXT") {
                  modifyTextNode(child, newText);
                }
              });
          }
      } else {
        figma.notify("Please select a component or instance.");
      }
    });
  }
}

async function replaceImage(imageName: string, newImageUrl: string) {
  const imageNodes = figma.currentPage.findAll(
    (node) => node.type === "RECTANGLE" && node.name === imageName
  );

  try {
    const image = await figma.createImage();

    for (const node of imageNodes) {
      if (node.type === "RECTANGLE") {
        node.fills = [
          { type: "IMAGE", scaleMode: "FILL", imageHash: image.hash },
        ];
      }
    }

    figma.notify(`Replaced ${imageNodes.length} image elements`);
  } catch (error) {
    figma.notify("Error loading image: " + error);
  }
}

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
