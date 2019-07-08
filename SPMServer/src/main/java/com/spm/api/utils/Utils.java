package com.spm.api.utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;

//import javax.rmi.CORBA.Util;

import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.BpmnModelElementInstance;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.graphstream.graph.Edge;
import org.graphstream.graph.Node;
import org.graphstream.graph.implementations.SingleGraph;
import org.graphstream.ui.swingViewer.ViewPanel;
import org.graphstream.ui.view.Camera;
import org.graphstream.ui.view.Viewer;

public class Utils {


	public static SingleGraph GenerateGraph(String name) {
		SingleGraph graph;graph =new SingleGraph(name);
		System.setProperty("org.graphstream.ui.renderer", "org.graphstream.ui.j2dviewer.J2DGraphRenderer");
		graph.addAttribute("ui.stylesheet", "url(style.css)");

		graph.setStrict(false);
		graph.setAutoCreate(true);

		graph.addAttribute("ui.quality");
		graph.addAttribute("ui.antialias");
		graph.addAttribute("ui.default.title", name);
		return graph;

	}
	public static void showGraph(org.graphstream.graph.Graph graph){
		Viewer viewer = graph.display();
		viewer.enableAutoLayout();
		viewer.setCloseFramePolicy(Viewer.CloseFramePolicy.CLOSE_VIEWER);

		ViewPanel view = viewer.getDefaultView();
		view.resizeFrame(2048, 1080);
		view.setAutoscrolls(true);
		Camera camera = view.getCamera();
		camera.setAutoFitView(true);
//		camera.setViewPercent(0.5);
	}

	public static SequenceFlow createSequenceFlow(BpmnModelInstance modelInstance, FlowNode from, FlowNode to) {

		Process process = ((ArrayList<Process>) modelInstance.getModelElementsByType(Process.class)).get(0);
		String identifier = from.getId() + "-" + to.getId();
		SequenceFlow sequenceFlow = Utils.createElement(process, identifier, SequenceFlow.class, modelInstance);
		process.addChildElement(sequenceFlow);
		sequenceFlow.setSource(from);
		from.getOutgoing().add(sequenceFlow);
		sequenceFlow.setTarget(to);
		to.getIncoming().add(sequenceFlow);
		return sequenceFlow;
	}
	public static <T extends BpmnModelElementInstance> T createElement(BpmnModelElementInstance parentElement, String id, Class<T> elementClass, BpmnModelInstance modelInstance) {
		T element = modelInstance.newInstance(elementClass);
		element.setAttributeValue("id", id, true);
		parentElement.addChildElement(element);
		return element;
	}


	public static String generatemAUTFile(SingleGraph graph,File outputFile){
		String data = "des(0," + graph.getEdgeCount() + "," + graph.getNodeCount() + ")\n";
		for (Edge e : graph.getEdgeSet()) {
			String label=e.getAttribute("ui.label");
			if (label.equals("tau")) {
				data += "(" + e.getSourceNode().getId() + "," + e.getAttribute("ui.label") + ","
						+ e.getTargetNode().getId() + ")\n";
			}else{
				data += "(" + e.getSourceNode().getId() + ",\'" + e.getAttribute("ui.label") + "\',"
					+ e.getTargetNode().getId() + ")\n";
			}
		}
		String currentDir = System.getProperty("user.dir");

		// Create the file
		try {
			outputFile.createNewFile();
			//System.out.println(outputFile.getAbsolutePath());
			// Write Content
			FileWriter writer = new FileWriter(outputFile);
			writer.write(data);
			writer.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return outputFile.getAbsolutePath();
	}

	public static String generatemmCRL2File(SingleGraph graph){
		String data = "act \n  tau";
		for (Edge e : graph.getEdgeSet()) {
			String label=e.getAttribute("ui.label");
			if (!label.equals("tau")) {
				data += ", " + e.getAttribute("ui.label");
			}
		}
		data+=";\nproc \n";
		System.out.println(graph.getNode(1).getOutDegree());

		for (Node node : graph) {
			if (!(node.getOutDegree()==0)) {
				data+="  "+node.getId()+"=";
			}
			int degree=node.getOutDegree();
			for (Edge edge : node.getEachLeavingEdge()) {
				if(degree<=1){
					data+=edge.getAttribute("ui.label")+"."+graph.getNode(edge.getTargetNode().getId()).getId();
				}
				else{
					data+=edge.getAttribute("ui.label")+"."+graph.getNode(edge.getTargetNode().getId()).getId()+" + ";
					degree--;
				}
			}
			if (!(node.getOutDegree()==0)) {
				data+=";\n";
			}

		}
		data+="init\n  0;";




		String currentDir = System.getProperty("user.dir");
		File collaborationFile = new File(currentDir + "/collaboration.mrcl2");

		// Create the file
		try {
			collaborationFile.createNewFile();
			System.out.println(collaborationFile.getAbsolutePath());
			// Write Content
			FileWriter writer = new FileWriter(collaborationFile);
			writer.write(data);
			writer.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return collaborationFile.getAbsolutePath();
	}


	public static void allTrace(Node root, String trace){

		for (Edge edge : root.getEachLeavingEdge()) {
			String newTrace=new String(trace);
			newTrace+=" --"+edge.getAttribute("ui.label")+"--> "+edge.getTargetNode();
			allTrace(edge.getTargetNode(), newTrace);
			if (edge.getTargetNode().getOutDegree()==0) {
				System.out.println(newTrace);
			}

		}

	}




}