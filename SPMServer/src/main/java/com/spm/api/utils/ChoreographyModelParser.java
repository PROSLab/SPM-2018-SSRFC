package com.spm.api.utils;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.EndEvent;
import org.camunda.bpm.model.bpmn.instance.EventBasedGateway;
import org.camunda.bpm.model.bpmn.instance.ExclusiveGateway;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Message;
import org.camunda.bpm.model.bpmn.instance.ParallelGateway;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.StartEvent;
import org.camunda.bpm.model.xml.impl.instance.ModelElementInstanceImpl;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.graphstream.graph.implementations.SingleGraph;


public class ChoreographyModelParser {
	private static BpmnModelInstance modelInstance;
	
	static class Node {
		String local_name;
		String id;
		
		Node(String local_name, String id) {
			this.local_name = local_name;
			this.id = id;
		}
	}
	
	private HashMap<String, ArrayList<Node>> adj;
	private boolean new_list;
	private Node new_node;
	private HashMap<String, Boolean> visited;
	private String idStartNode;
	private SingleGraph choreographyGraph; // NEW
	public String choreographyPath; // NEW
	private ArrayList<String> names;
	
	public ArrayList<String> init(InputStream chor, File outputFile) {
		names = new ArrayList<String>();
		adj = new HashMap<String, ArrayList<Node>>();
		modelInstance = Bpmn.readModelFromStream(chor);
		choreographyGraph = Utils.GenerateGraph("Choreography"); // NEW
		
		// search start event
		for (StartEvent startEvent : modelInstance.getModelElementsByType(StartEvent.class)) {
			idStartNode = startEvent.getId();
			ArrayList<Node> adj_startevents = adj.get( idStartNode );
			new_list = false;
			
			if(adj_startevents == null) {
				adj_startevents = new ArrayList<Node>();
				new_list = true;
			}
			
			for (SequenceFlow outgoingEdge : startEvent.getOutgoing()) {
				ModelElementInstance outgoingNode = getFlowTargetRef(outgoingEdge);
				new_node = createNewNode(outgoingNode);
				
				if(!adj_startevents.contains(new_node)) adj_startevents.add(new_node);
				if(new_list == true) adj.put(startEvent.getId(), adj_startevents);
			}

		}
		
		// search flow node
		for (SequenceFlow flow : modelInstance.getModelElementsByType(SequenceFlow.class)) {
			ModelElementInstance node = getFlowTargetRef(flow);
			
			ArrayList<Node> adj_nodes = adj.get( node.getAttributeValue("id") );
			new_list = false;
			
			if(adj_nodes == null) {
				adj_nodes = new ArrayList<Node>();
				new_list = true;
			}
				
			if(checkNodeChor(node) == true) {
				ChoreographyTask task = new ChoreographyTask((ModelElementInstanceImpl) node, modelInstance);
				
				for (SequenceFlow outgoingEdge : task.getOutgoing()) {
					ModelElementInstance outgoingNode = getFlowTargetRef(outgoingEdge);
					new_node = createNewNode(outgoingNode);
					
					if(!adj_nodes.contains(new_node)) adj_nodes.add(new_node);
					if(new_list == true) adj.put(task.getId(), adj_nodes);
				}
				
			} else {
				if(node instanceof EndEvent) {
					if(new_list == true) adj.put(((FlowNode)node).getId(), adj_nodes);
				}
				
				for (SequenceFlow outgoingEdge : ((FlowNode)node).getOutgoing()) {
					ModelElementInstance outgoingNode = getFlowTargetRef(outgoingEdge);
					new_node = createNewNode(outgoingNode);
					
					if(!adj_nodes.contains(new_node)) adj_nodes.add(new_node);
					if(new_list == true) adj.put(((FlowNode)node).getId(), adj_nodes);
				}
			}		
		}
		
		printAdjList();
		DFS(idStartNode);
		choreographyPath = Utils.generatemAUTFile(choreographyGraph, outputFile);
		
		ArrayList<String> actions = new ArrayList<>();
		for (Message m : modelInstance.getModelElementsByType(Message.class)) {
			actions.add(m.getName());
		}

		return actions;		
	}
	
	private void DFS(String idStartNode) {
		visited = new HashMap<String, Boolean>();
		
		System.out.println("\n--- --- DFS ALGORITHM --- ---");
		DFSalg(idStartNode, visited);
		System.out.println("--- --- --- --- --- --- --- ");
	}
	
	private void DFSalg(String idNode, HashMap<String, Boolean> v) {
		v.put(idNode, true);
		ModelElementInstance currentElement = modelInstance.getModelElementById(idNode);
		System.out.println("\n-> Visited Node: " + currentElement.getDomElement().getLocalName() + " (" + idNode + ")");	
		
		Iterator<Node> i = adj.get(idNode).listIterator();
		while(i.hasNext()) {
			String next_id = i.next().id;
			buildGraph(currentElement, next_id); // NEW
			
			if(!v.containsKey(next_id)) {
				DFSalg(next_id, v);
			}
		}
	}
	
	private void buildGraph(ModelElementInstance currentElement, String idNextNode) {
		if(currentElement instanceof EventBasedGateway || checkNodeChor(currentElement) == true) {
			ChoreographyTask currNodeTask = new ChoreographyTask((ModelElementInstanceImpl) currentElement, modelInstance);
			String edgeLabel = null;
			if(currNodeTask.getInitialParticipant() != null && currNodeTask.getParticipantRef() != null && currNodeTask.getRequest() != null) {
				edgeLabel = currNodeTask.getInitialParticipant().getName()+"->"+currNodeTask.getParticipantRef().getName()+":"+currNodeTask.getRequest().getMessage().getName();
			}
			String idCurrentNode = String.valueOf( convertIdToSeqNumber(currNodeTask.getId()) );
			String nextNodeID = String.valueOf( convertIdToSeqNumber(idNextNode) );
			//choreographyGraph.addEdge(idCurrentNode+"_"+idNextNode, idCurrentNode, idNextNode, true).setAttribute("ui.label", edgeLabel);
			//choreographyGraph.getNode(idNextNode).setAttribute("ui.label", idNextNode);
			choreographyGraph.addEdge(idCurrentNode+"_"+nextNodeID, idCurrentNode, nextNodeID, true).setAttribute("ui.label", edgeLabel);
			choreographyGraph.getNode(nextNodeID).setAttribute("ui.label", nextNodeID);
			
			return;
		}
		
		// all other cases
		String idCurrentNode = String.valueOf(convertIdToSeqNumber( ((FlowNode)currentElement).getId() ));
		String nextNodeID = String.valueOf(convertIdToSeqNumber( idNextNode ));
		//choreographyGraph.addEdge(idCurrentNode+"_"+idNextNode, idCurrentNode, idNextNode, true).setAttribute("ui.label", "tau");
		//choreographyGraph.getNode(idNextNode).setAttribute("ui.label", idNextNode);
		choreographyGraph.addEdge(idCurrentNode+"_"+nextNodeID, idCurrentNode, nextNodeID, true).setAttribute("ui.label", "tau");
		choreographyGraph.getNode(nextNodeID).setAttribute("ui.label", nextNodeID);
		
	}
	
	private int convertIdToSeqNumber(String id) {
		if(names.contains(id)) {
			return names.indexOf(id); 
		}
		
		names.add(id);
		return names.indexOf(id);
	}
	
	private boolean checkNodeChor(ModelElementInstance node) {
		if (node instanceof ModelElementInstanceImpl 
			&& !(node instanceof EndEvent) 
			&& !(node instanceof ParallelGateway) 
			&& !(node instanceof ExclusiveGateway) 
			&& !(node instanceof EventBasedGateway) 
			&& !(node instanceof StartEvent))
		{
			return true; 
		}
		
		return false;
	}
	
	private ModelElementInstance getFlowTargetRef(SequenceFlow sf) {
		return modelInstance.getModelElementById(sf.getAttributeValue("targetRef"));
	}
	
	private Node createNewNode(ModelElementInstance outgoingNode) {
		Node node;
		
		if(checkNodeChor(outgoingNode) == true) {
			ChoreographyTask task = new ChoreographyTask((ModelElementInstanceImpl) outgoingNode, modelInstance);
			node = new Node(outgoingNode.getDomElement().getLocalName(), task.getId());
		
		} else {
			node = new Node(outgoingNode.getDomElement().getLocalName(), ((FlowNode)outgoingNode).getId());
		}
		
		return node;
	}
	
	private void printAdjList() {
		adj.forEach((k, arr_nodes) -> {
			String name = modelInstance.getModelElementById(k).getDomElement().getLocalName();
			System.out.println("\n-- Node: " + name + " (" + k + ")");			
			System.out.println("-- Adjacent list: ");
			arr_nodes.forEach(node -> {
				System.out.println("-- " + node.local_name + " (" + node.id + ")");
			});
		});
	}

}












