package com.spm.api.utils;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.swing.JFileChooser;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.xml.stream.events.EndElement;

import org.camunda.bpm.engine.impl.bpmn.diagram.ProcessDiagramLayoutFactory;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.impl.instance.EventBasedGatewayImpl;
import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.BpmnModelElementInstance;
import org.camunda.bpm.model.bpmn.instance.BusinessRuleTask;
import org.camunda.bpm.model.bpmn.instance.EndEvent;
import org.camunda.bpm.model.bpmn.instance.EventBasedGateway;
import org.camunda.bpm.model.bpmn.instance.ExclusiveGateway;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.InclusiveGateway;
import org.camunda.bpm.model.bpmn.instance.IntermediateCatchEvent;
import org.camunda.bpm.model.bpmn.instance.IntermediateThrowEvent;
import org.camunda.bpm.model.bpmn.instance.ManualTask;
import org.camunda.bpm.model.bpmn.instance.MessageFlow;
import org.camunda.bpm.model.bpmn.instance.ParallelGateway;
import org.camunda.bpm.model.bpmn.instance.ReceiveTask;
import org.camunda.bpm.model.bpmn.instance.ScriptTask;
import org.camunda.bpm.model.bpmn.instance.SendTask;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.ServiceTask;
import org.camunda.bpm.model.bpmn.instance.StartEvent;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.graphstream.graph.Edge;
import org.graphstream.graph.Node;
import org.graphstream.graph.implementations.SingleGraph;

//<<<<<<< HEAD
import com.spm.api.utils.*;
import com.spm.api.utils.LTSNode.NodeType;
import com.spm.api.utils.LTSNode;

/*
=======
import utils.LTSNode;
import utils.LTSNode.NodeType;
import core.utils.*;
>>>>>>> 8a8f222e8099fb7026976e124303d07c8a41bceb*/
import org.camunda.bpm.model.bpmn.impl.instance.FlowNodeImpl;




public class Collaboration {

	private BpmnModelInstance modelInstance;
	private SingleGraph collaborationGraph;
	private Collection<String> choreographyActions;
	public static  Integer  collaborationCounter;
	public static ArrayList<LTSNode> nodeSet;
	public static String collaborationPath;



	public static void main(String[] args) {
		Collaboration collaboration = new Collaboration();
		JFileChooser chooser = new JFileChooser("/home/cippus/Documents/testinput");
		FileNameExtensionFilter filter = new FileNameExtensionFilter("BPMN", "bpmn");
		chooser.setFileFilter(filter);
		int returnVal = chooser.showOpenDialog(null);
		if (returnVal == JFileChooser.APPROVE_OPTION) {
			System.out.println("You chose to open this file: " + chooser.getSelectedFile().getName());
		}
		File file = new File(chooser.getSelectedFile().getAbsolutePath());
//		File file=new File("/home/cippus/Documents/testinput/collaborationPAR.bpmn");
		System.out.println(file.getAbsolutePath());
		//collaboration.init(file, true);


	}

	public void init(InputStream file, boolean show, File outputFile) {
		collaborationGraph=Utils.GenerateGraph("Collaboration");
		if (show) {
			Utils.showGraph(collaborationGraph);
		}
		modelInstance = Bpmn.readModelFromStream(file);
		LTSNode root=new LTSNode(NodeType.COL);
		root.setLabel("Root");
		collaborationGraph.addNode(String.valueOf(root.getId())).setAttribute("ui.label", root.getId());
		//Create transitions from the root node to the starEvent in the BPMN model
		for (StartEvent startEvent : modelInstance.getModelElementsByType(StartEvent.class)) {
			FlowNode root1 = Utils.createElement(startEvent.getScope(), "0", StartEvent.class, modelInstance);
			SequenceFlow s = Utils.createSequenceFlow(modelInstance, root1, startEvent);
			root.addEdge(s);
		}

		DFS(root);
		collaborationPath=Utils.generatemAUTFile(collaborationGraph,outputFile);
//		Utils.allTrace(collaborationGraph.getNode(0),"0");
	}

	public Collaboration() {
		collaborationCounter=0;
		 nodeSet=new ArrayList<LTSNode>();
	}

	private void DFS(LTSNode currentNode) {
	//	System.out.println(currentNode);

		Enumeration<SequenceFlow> edges = currentNode.getEdges().keys();
        while (edges.hasMoreElements()) {
        	try{

        	SequenceFlow edge= edges.nextElement();
        	FlowNode currentElement=edge.getTarget();
//        	String edgeLabel=edge.getId();
        	String edgeLabel="tau";



//STARTEVENT
        	if (currentElement instanceof StartEvent) {
        		for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        			LTSNode nextNode=new LTSNode(NodeType.COL);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode.addEdge(outgoingEdge);
					nextNode=nextNode.validate();
					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);;
					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
			}
//SERVICETASK
        	if (currentElement instanceof ServiceTask ||
        					currentElement instanceof UserTask ||
        					currentElement instanceof ScriptTask ||
        					currentElement instanceof BusinessRuleTask ||
        					currentElement instanceof ManualTask ||
        					currentElement.getClass().getSimpleName().equals("TaskImpl")) {
        		for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        			LTSNode nextNode=new LTSNode(NodeType.COL);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode.addEdge(outgoingEdge);
					nextNode=nextNode.validate();
					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
			}
//ENDEVENT
        	if (currentElement instanceof EndEvent) {
        		LTSNode nextNode=new LTSNode(NodeType.COL);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode=nextNode.validate();
					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
			}
//SENDTASK
        	if (currentElement instanceof SendTask || currentElement instanceof IntermediateThrowEvent) {
        		for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        			LTSNode nextNode=new LTSNode(NodeType.COL);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode.addEdge(outgoingEdge);
					nextNode.addMessages(getMessageFlow(currentElement));
					nextNode=nextNode.validate();
					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
        	}

//RECEIVETASK
        	if (currentElement instanceof ReceiveTask || currentElement instanceof IntermediateCatchEvent) {
        		for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        			MessageFlow message=getMessageFlow(currentElement);
        			if(currentNode.decreaseMessage(message)){
        				LTSNode nextNode=new LTSNode(NodeType.COL);
                		nextNode.clone(currentNode);
                		//trucco per rimettere il messaggio nel current node dopo che Ã¨ stato tolto prima di fare il clone
                		currentNode.addMessages(message);
                		nextNode.decreaseEdge(edge);
    					nextNode.addEdge(outgoingEdge);
    					//SE IL RECEIVETASK Ãˆ FILGIO DI UN EVENT BASE DEVE DISATTIVARE L'ALTRO EDGE CHE NON Ãˆ UTILIZZATO
    					if (currentElement.getPreviousNodes().list().get(0) instanceof EventBasedGateway ||currentElement.getPreviousNodes().list().get(0) instanceof IntermediateCatchEvent) {
    						BaseElement eventbase=(BaseElement) currentElement.getPreviousNodes().list().get(0);
    						//POTREBBE SERVIRE NEL CASO DI CLICLI
//        					for (MessageFlow mes : nextNode.getMessages().keySet()) {
//        						if (mes.getSource().getId().equals(eventbase.getId())) {
//									nextNode.decreaseMessage(mes);
//								}
//							}
    						Enumeration<SequenceFlow> seqEnum = nextNode.getEdges().keys();
    				        while (seqEnum.hasMoreElements()) {
    				        	SequenceFlow seq=seqEnum.nextElement();
    				        	if (seq.getSource().getId().equals(eventbase.getId())) {
									nextNode.decreaseEdge(seq);
								}
    				        }
						}
    					nextNode=nextNode.validate();
//    					System.out.println(message.getSource().getParentElement().getAttributeValue("id"));
    					if (choreographyActions.contains(message.getName())) {
    						collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", message.getSource().getParentElement().getAttributeValue("name")+"->"+message.getTarget().getParentElement().getAttributeValue("name")+":"+message.getName());
						}else{
							collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
						}

    					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
    					DFS(nextNode);
        			}
				}
        	}

//PARALLELGATEWAY
        	if(currentElement instanceof ParallelGateway){
//        		DIVERGING
        		if (currentElement.getIncoming().size()==1) {
        			LTSNode nextNode=new LTSNode(NodeType.COL);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
        			for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        				nextNode.addEdge(outgoingEdge);

    				}
        			nextNode=nextNode.validate();
					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
//        		CONVERGING
        		if (currentElement.getOutgoing().size()==1) {
        			boolean enabled=false;
        			for (SequenceFlow incomingEdge : currentElement.getIncoming()) {
						if (currentNode.getEdges().containsKey(incomingEdge)) {
							enabled=true;
						}else{
							enabled=false;
							break;
						}
					}
        			if (enabled) {
        				LTSNode nextNode=new LTSNode(NodeType.COL);
                		nextNode.clone(currentNode);
//                		edgeLabel="";
                		for (SequenceFlow incomingEdge : currentElement.getIncoming()) {
                			nextNode.decreaseEdge(incomingEdge);
//                			edgeLabel+=incomingEdge.getId()+" ";
                		}
                		for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
                			nextNode.addEdge(outgoingEdge);
                		}
                		nextNode=nextNode.validate();
    					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
    					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
    					DFS(nextNode);
					}

				}
        	}
//XORGATEWAY
        	if(currentElement instanceof ExclusiveGateway){
//        		DIVERGING
        			for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        				LTSNode nextNode=new LTSNode(NodeType.COL);
        				nextNode.clone(currentNode);
        				nextNode.decreaseEdge(edge);
        				nextNode.addEdge(outgoingEdge);
        				nextNode=nextNode.validate();
        				collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        				collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        				DFS(nextNode);

    				}
        	}



//EVENTBASEDGATEWAY
        	        if(currentElement instanceof EventBasedGateway){
//        	    		DIVERGING
        	    		if (currentElement.getIncoming().size()==1) {
        	    			LTSNode nextNode=new LTSNode(NodeType.COL);
        	        		nextNode.clone(currentNode);
        	        		nextNode.decreaseEdge(edge);
        	    			for (SequenceFlow outgoingEdge : currentElement.getOutgoing()) {
        	    				nextNode.addEdge(outgoingEdge);

        					}
        	    			nextNode=nextNode.validate();
        					collaborationGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        					collaborationGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        					DFS(nextNode);
        				}
        	        }

        	}catch (StackOverflowError e) {
//				e.printStackTrace();
        		continue;
			}

        }



	}

	public MessageFlow getMessageFlow(FlowNode currentElement){
		for (MessageFlow message : modelInstance.getModelElementsByType(MessageFlow.class)) {
			if (message.getSource().getId().equals(currentElement.getId())) {
				return message;
			}else if(message.getTarget().getId().equals(currentElement.getId())){
				return message;
			}
		}
		return null;
	}




	public void setChoreographyActions(ArrayList<String> choreographyActions2) {
		this.choreographyActions=choreographyActions2;
	}

}
