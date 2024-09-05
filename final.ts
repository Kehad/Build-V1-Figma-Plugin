figma.showUI(__html__);

figma.ui.resize(350, 500);

async function findComponentsWithCriteria() {
  // Load all pages asynchronously
  await figma.loadAllPagesAsync();

  // Now you can safely use findAllWithCriteria
  const components = figma.currentPage.findAllWithCriteria({
    types: ["INSTANCE", "FRAME"],
  });

  return components;
}

findComponentsWithCriteria().then((components) => {
  console.log(components);
  const componentList = components.map((component) => ({
    name: component.name,
    id: component.id,
  }));
  figma.ui.postMessage({ type: "componentList", components: componentList });
});


// const components = figma.root.findAllWithCriteria({
//   types: ["COMPONENT"],
// });

// Extract component names and ids to send to UI


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
