figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "replace-text") {
    //   const {  newText } = msg;

    console.log("msg");
    console.log(msg);
    console.log("msg");
    await replaceText(msg.newText);
    9;
    // await replaceText(oldText, newText);
  } else if (msg.type === "replace-image") {
    const { imageName, newImageUrl } = msg;
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

async function replaceText(newText: string) {
  //   const textNodes = figma.currentPage.findAll(
  //     (node) => node.type === "TEXT" && node.characters === oldText
  //   );

  //   for (const node of textNodes) {
  //     if (node.type === "TEXT") {
  //       await figma.loadFontAsync(node.fontName as FontName);
  //       node.characters = newText;
  //     }
  //   }
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("No nodes selected!");
  } else {
    selection.forEach(async (node) => {
      if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
        figma.notify("A component is selected!");
        console.log(node, node.type, node.id);
        const componentId = node.id;
        const newInstance = await createComponentInstance(
          componentId,
          100,
          100
        );
        if (newInstance) {
          // If you want to inspect the newly created instance
          inspectComponent(newInstance);
        }
        console.log("node");
        if (newInstance) {
          // If you want to inspect the newly created instance
          inspectComponent(newInstance);
        }
        console.log("node");
        newInstance?.children.forEach((child, index) => {
          console.log(
            `Child ${index + 1}: ${child.name} (Type: ${child.type})`
          );
          if (child.type === "TEXT") {
            await figma.loadFontAsync()
            console.log(newText);
            console.log(`child characters ${child.characters} `);
            console.log(`child name ${child.name} `);
            child.characters = 'I am a boy';
              console.log(newInstance);
          }
        });

        // Do something with the selected component
      } else {
        figma.notify("Please select a component or instance.");
        console.log(node, node.type);
      }
    });
  }

  //   figma.notify(`Replaced ${textNodes.length} text elements`);
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
