"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "replace-text") {
        const { newText } = msg;
        yield replaceText(newText);
        // await replaceText(oldText, newText);
    }
    else if (msg.type === "replace-image") {
        const { imageName, newImageUrl } = msg;
        // await replaceImage(imageName, newImageUrl);
    }
});
function replaceText(newText) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        else {
            selection.forEach((node) => {
                if (node && (node.type === "COMPONENT" || node.type === "INSTANCE")) {
                    figma.notify("A component is selected!");
                    console.log(node, node.type);
                    console.log('node');
                    node.children.forEach((child, index) => {
                        console.log(`Child ${index + 1}: ${child.name} (Type: ${child.type})`);
                        if (child.type === "TEXT") {
                            child.name === newText;
                        }
                    });
                    // Do something with the selected component
                }
                else {
                    figma.notify("Please select a component or instance.");
                    console.log(node, node.type);
                }
            });
        }
        //   figma.notify(`Replaced ${textNodes.length} text elements`);
    });
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
