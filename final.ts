figma.showUI(__html__);

figma.ui.resize(350, 500);

async function findComponentsWithCriteria() {
  // Load all pages asynchronously
  await figma.loadAllPagesAsync();

  // Now you can safely use findAllWithCriteria
  const components = figma.currentPage.findAllWithCriteria({
    // types: ["INSTANCE", "FRAME"],
    types: ["COMPONENT"],
  });

  return components;
}

findComponentsWithCriteria().then((components) => {
  console.log("after sending");
  console.log(components);
  console.log("after sending");
  // Extract component names and ids to send to UI
  const componentList = components.map((component) => ({
    name: component.name,
    id: component.id,
    children: component.children[1],
  }));
  figma.ui.postMessage({ type: "componentList", components: componentList });
//   figma.ui.postMessage({ type: "components", components: components });
});



// async function getAllComponents() {
//   await figma.loadAllPagesAsync(); // Add this line to fix the warning
//   const components: ComponentNode[] = [];
//   const nodes = figma.root.findAll(node => node.type === 'COMPONENT');
//   nodes.forEach(component => {
//       console.log(component);
//       components.push(component as ComponentNode);  // Send the whole component object
//   });
//     console.log(components)
//     return components;
// }
// (async () => {
//   const components = await getAllComponents();
//   console.log('componentlist', components);
//     figma.ui.postMessage(components);  // Send all components to the UI
// })();

// const components = figma.root.findAllWithCriteria({
//   types: ["COMPONENT"],
// });

figma.ui.onmessage = async (message) => {
  if (message.type === "insertComponent") {
    const component = await figma.getNodeByIdAsync(message.id);

    if (component && component.type === "COMPONENT") {
        // Clone the component and place it on the canvas

      const newComponent = component.createInstance();
      figma.currentPage.appendChild(newComponent);

      // Center the new component on the canvas
      newComponent.x = figma.viewport.center.x;
      newComponent.y = figma.viewport.center.y;

      // Select the new component
      figma.currentPage.selection = [newComponent];
      figma.viewport.scrollAndZoomIntoView([newComponent]);
    }
  }
};

// <<<<<<< Tabnine <<<<<<<
// figma.ui.onmessage = (message) => {//-
//     const component = figma.getNodeById(message.id);//-
