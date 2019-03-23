
function init() {
	if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
	var $ = go.GraphObject.make;  // for conciseness in defining templates
	myDiagram = $(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
					{
					initialContentAlignment: go.Spot.Center,  // center the content
					"undoManager.isEnabled": true,  // enable undo & redo
					layout: $(go.TreeLayout, // расположение диограммы (вертникально \ горизонтально \ под улгом)
											{ angle: 90, layerSpacing: 35 })
					});
	// Внешний вид связей между блоками
	myDiagram.linkTemplate =
		$(go.Link,
		// default routing is go.Link.Normal
		// default corner is 0
		{ routing: go.Link.Orthogonal, corner: 1 },
		$(go.Shape, { 
			//toArrow: "Standard", stroke: "#555", 
			strokeWidth: 1, stroke: "#555" 
		}) // the link shape
	);
									
	// define a simple Node template
	myDiagram.nodeTemplate =
		$(go.Node, "Auto",  // the Shape will go around the TextBlock
		$(go.Shape, "Rectangle", { strokeWidth: 1, fill: "white" },
			// Shape.fill is bound to Node.data.color
			new go.Binding("fill", "color")),
		$(go.TextBlock,
			{ margin: 8 },  // some room around the text
			// TextBlock.text is bound to Node.data.key
			new go.Binding("text", "key"))
		);

	// Кнопки редактирования 
		myDiagram.contextMenu =
		$(go.Adornment, "Vertical",
			$("ContextMenuButton",
			$(go.TextBlock, "Undo"),
			{ click: function(e, obj) { e.diagram.commandHandler.undo(); } },
			new go.Binding("visible", "", function(o) {
				return o.diagram.commandHandler.canUndo();
				}).ofObject()),
			$("ContextMenuButton",
			$(go.TextBlock, "Redo"),
			{ click: function(e, obj) { e.diagram.commandHandler.redo(); } },
			new go.Binding("visible", "", function(o) {
				return o.diagram.commandHandler.canRedo();
				}).ofObject())
		);

	// but use the default Link template, by not setting Diagram.linkTemplate
	// create the model data that will be represented by Nodes and Links
	myDiagram.model = new go.GraphLinksModel(
	[
		{ key: "Block 1", color: "lightblue" },
		{ key: "New block", color: "orange" },
		{ key: "Следующий блок", color: "lightgreen" },
		{ key: "Ещё блок", color: "lightgreen" },
		{ key: "Последний блок", color: "white" }
	],
	[
		{ from: "Block 1", to: "New block" },
		{ from: "New block", to: "Следующий блок" },
		{ from: "Следующий блок", to: "Ещё блок" },
		{ from: "Ещё блок", to: "Последний блок" },
		{ from: "Последний блок", to: "Последний блок" }
	]);
}