figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "replace-text") {
      const {  newText } = msg;
      await replaceText(newText);
    // await replaceText(oldText, newText);
  } else if (msg.type === "replace-image") {
    const { imageName, newImageUrl } = msg;
    // await replaceImage(imageName, newImageUrl);
  }
};

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
       selection.forEach((node) => {
         if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
           figma.notify("A component is selected!");
             console.log(node, node.type);
             console.log('node')
             node.children.forEach((child, index) => {
               console.log(
                 `Child ${index + 1}: ${child.name} (Type: ${child.type})`
                 );
                 if (child.type === "TEXT") {
                    child.name === newText;
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
