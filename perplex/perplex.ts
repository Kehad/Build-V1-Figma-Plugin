// src/code.js

figma.showUI(__html__);

figma.ui.resize(300, 400);

// figma.ui.postMessage({
//   type: "update-component-name",
//   elements: 'ssss'
// });

// figma.ui.onmessage = async (msg) => {
//     // postMessage();
//     console.log(msg);
//   if (msg.type === "duplicate-component") {
//     console.log("component");
//     const selectedNode = figma.currentPage.selection[0];

//     if (!selectedNode || selectedNode.type !== "COMPONENT") {
//       figma.notify("Please select a component.");
//       return;
//     }

//     // Notify user of selection
//     figma.notify(`Selected Component: ${selectedNode.name}`);

//     const variants = [];

//     //   postMessage();

//     // Generate variants based on user input
//     for (let i = 0; i < msg.variantCount; i++) {
//       const newVariant = selectedNode.clone();
//       newVariant.name = `${selectedNode.name} Variant ${i + 1}`;

//       // Replace specified elements based on AI prompts
//       for (const replacement of msg.replacements) {
//         const elementToReplace = newVariant.findOne(
//           (node) => node.name === replacement.elementName
//         );
//         if (elementToReplace) {
//           // Simulate AI response for the new value
//           const aiResponse = await getAIResponse(replacement.prompt);
//           if (elementToReplace.type === "TEXT") {
//             elementToReplace.characters = aiResponse as string; // Replace with AI-generated text
//           } else if (elementToReplace.type === "RECTANGLE") {
//             // Example: Change fill color based on AI response
//             if (typeof aiResponse === "string") {
//               elementToReplace.fills = [
//                 {
//                   type: "SOLID",
//                   color: hexToRgb(aiResponse),
//                   boundVariables: {},
//                 },
//               ];
//             } else {
//               console.error("Unexpected AI response type for RECTANGLE");
//             }
//           }
//         }
//       }

//       variants.push(newVariant);
//       figma.currentPage.appendChild(newVariant);
//     }

//     figma.notify(`${variants.length} variants created!`);
//     figma.closePlugin();
//   }
// };



// Simulated function to get AI response based on a prompt
async function getAIResponse(prompt: any) {
  // Here you would typically call an external API to get an AI-generated response.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI Response for: ${prompt}`);
    }, 1000); // Simulate network delay
  });
}

// Helper function to convert hex color to RGB format
function hexToRgb(hex: string) {
    console.log(hex)
  if (typeof hex !== "string" || !hex.startsWith("#") || hex.length !== 7) {
    throw new Error("Invalid hex color format");
  }
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 }; // Normalize to [0,1]
}



figma.ui.onmessage = async (msg) => {
    if (msg.type === 'get-selected-component') {
        const selectedNode = figma.currentPage.selection[0];

        if (!selectedNode || selectedNode.type !== 'COMPONENT') {
            figma.notify('Please select a component get selected component.');
            return;
        }

        // Get all child elements of the selected component
        const elements = selectedNode.children.map(child => ({ name: child.name }));

        // Send back the component name and its elements to the UI
        figma.ui.postMessage({ type: 'update-component-name', name: selectedNode.name, elements });
    
        return; // Exit after processing selection request.
    }
  if (msg.type === "duplicate-component") {
    console.log('duplicate-component')

      console.log("component");
      const selectedNode = figma.currentPage.selection[0];

      if (!selectedNode || selectedNode.type !== "COMPONENT") {
        figma.notify("Please select a component.");
        return;
      }

      // Notify user of selection
      figma.notify(`Selected Component: ${selectedNode.name}`);

      const variants = [];

      for (let i = 0; i < msg.variantCount; i++) {
        const newVariant = selectedNode.clone();
        newVariant.name = `${selectedNode.name} Variant ${i + 1}`;

        // Replace specified elements based on AI prompts
        for (const replacement of msg.replacements) {
          const elementToReplace = newVariant.findOne(
            (node) => node.name === replacement.elementName
          );
          if (elementToReplace) {
            // Simulate AI response for the new value
            const aiResponse = await getAIResponse(replacement.prompt);
            console.log(aiResponse)
            if (elementToReplace.type === "TEXT") {
              elementToReplace.characters = aiResponse as string; // Replace with AI-generated text
            } else if (elementToReplace.type === "RECTANGLE") {
              // Example: Change fill color based on AI response
              if (typeof aiResponse === "string") {
                elementToReplace.fills = [
                  {
                    type: "SOLID",
                    color: hexToRgb(aiResponse),
                    boundVariables: {},
                  },
                ];
              } else {
                console.error("Unexpected AI response type for RECTANGLE");
              }
            }
          }
        }

        variants.push(newVariant);
        figma.currentPage.appendChild(newVariant);
      }

      figma.notify(`${variants.length} variants created!`);
      figma.closePlugin();
  }    
}