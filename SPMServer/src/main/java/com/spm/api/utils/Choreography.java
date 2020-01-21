package com.spm.api.utils;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;

import javax.swing.JFileChooser;
import javax.swing.filechooser.FileNameExtensionFilter;


import com.spm.api.utils.*;
import com.spm.api.utils.LTSNode.NodeType;


/*
 * 
 * 
=======
import utils.LTSNode;
import core.utils.*;
import utils.LTSNode.NodeType;
>>>>>>> 8a8f222e8099fb7026976e124303d07c8a41bceb
 */
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.impl.instance.FlowNodeImpl;
import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.EndEvent;
import org.camunda.bpm.model.bpmn.instance.EventBasedGateway;
import org.camunda.bpm.model.bpmn.instance.ExclusiveGateway;
import org.camunda.bpm.model.bpmn.instance.ExtensionElements;
import org.camunda.bpm.model.bpmn.instance.FlowElement;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Message;
import org.camunda.bpm.model.bpmn.instance.ParallelGateway;
import org.camunda.bpm.model.bpmn.instance.Participant;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.StartEvent;
import org.camunda.bpm.model.bpmn.instance.camunda.CamundaFormData;
import org.camunda.bpm.model.xml.impl.instance.ModelElementInstanceImpl;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.graphstream.graph.implementations.SingleGraph;

import com.spm.api.utils.ChoreographyTask;
import com.spm.api.utils.ChoreographyTask.TaskType;

public class Choreography {
	private BpmnModelInstance modelInstance;
	private SingleGraph choreographyGraph;
	public static Integer choreographyCounter;
	public static ArrayList<LTSNode> nodeSet;
	public static String choreographyPath;



	/*public static void main(String[] args) {
		Choreography choreography= new Choreography();
//		JFileChooser chooser = new JFileChooser("/home/cippus/Documents/testinput");
//		FileNameExtensionFilter filter = new FileNameExtensionFilter("BPMN", "bpmn");
//		chooser.setFileFilter(filter);
//		int returnVal = chooser.showOpenDialog(null);
//		if (returnVal == JFileChooser.APPROVE_OPTION) {
//			System.out.println("You chose to open this file: " + chooser.getSelectedFile().getName());
//		}
//		File file = new File(chooser.getSelectedFile().getAbsolutePath());
		File file=new File("choreography_1.bpmn");
		//System.out.println(file.getAbsolutePath());

		///choreography.init(file, true);


	}*/


	public Choreography() {
choreographyCounter=0;
nodeSet=new ArrayList<LTSNode>();
	}


	public ArrayList<String> init(InputStream file, boolean show,File outputFile) {
		choreographyGraph=Utils.GenerateGraph("Choreography");
		if (show) {
			Utils.showGraph(choreographyGraph);
		}


		modelInstance = Bpmn.readModelFromStream(file);
		//System.out.println(modelInstance);

		//Create transitions from the root node to the starEvent in the BPMN model
		LTSNode rootNode=new LTSNode(NodeType.CHOR);
		LTSNode startNode = null;
		for (StartEvent startEvent : modelInstance.getModelElementsByType(StartEvent.class)) {
			startNode=new LTSNode(NodeType.CHOR);
			for (SequenceFlow edge : startEvent.getOutgoing()) {
				startNode.addEdge(edge);
			}
			choreographyGraph.addEdge(rootNode.getId()+"_"+ startNode.getId(), String.valueOf(rootNode.getId()), String.valueOf(startNode.getId()), true).setAttribute("ui.label", "tau");
			choreographyGraph.getNode(startNode.getId()).setAttribute("ui.label", startNode.getId());
		}
		choreographyGraph.getNode(rootNode.getId()).setAttribute("ui.label", rootNode.getId());
		for (Participant p : modelInstance.getModelElementsByType(Participant.class)) {
			startNode.addParticipant(p, false);
		}
		//System.out.println(startNode);
		DFS(startNode);
//		Utils.allTrace(choreographyGraph.getNode(0),"0");
		choreographyPath=Utils.generatemAUTFile(choreographyGraph,outputFile);
//Utils.generatemmCRL2File(choreographyGraph);
		ArrayList<String>actions=new ArrayList<>();
		for (Message m : modelInstance.getModelElementsByType(Message.class)) {
			actions.add(m.getName());
		}


		return actions;


	}
	


	private void DFS(LTSNode currentNode) {
		//System.out.println(currentNode);
		Enumeration<SequenceFlow> edges = currentNode.getEdges().keys();
        while (edges.hasMoreElements()) {
        	SequenceFlow edge= edges.nextElement();
        	ModelElementInstance currentElement=modelInstance.getModelElementById(edge.getAttributeValue("targetRef"));
//        	String edgeLabel=edge.getId();
        //	System.out.println(currentElement);
        	String edgeLabel="tau";

//STARTEVENT
        	if (currentElement instanceof StartEvent) {
        		for (SequenceFlow outgoingEdge : ((FlowNode) currentElement).getOutgoing()) {
        			LTSNode nextNode=new LTSNode(NodeType.CHOR);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode.addEdge(outgoingEdge);
					nextNode=nextNode.validate();
					choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
			}


//ENDEVENT
        	if (currentElement instanceof EndEvent) {
        		LTSNode nextNode=new LTSNode(NodeType.CHOR);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
					nextNode=nextNode.validate();
					choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
			}

//PARALLELGATEWAY
        	if(currentElement instanceof ParallelGateway){
//        		DIVERGING
        		if (((ParallelGateway) currentElement).getIncoming().size()==1) {
        			LTSNode nextNode=new LTSNode(NodeType.CHOR);
            		nextNode.clone(currentNode);
            		nextNode.decreaseEdge(edge);
        			for (SequenceFlow outgoingEdge : ((ParallelGateway) currentElement).getOutgoing()) {
        				nextNode.addEdge(outgoingEdge);

    				}
        			nextNode=nextNode.validate();
					choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
					choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
					DFS(nextNode);
				}
//        		CONVERGING
        		if (((ParallelGateway) currentElement).getOutgoing().size()==1) {
        			boolean enabled=false;
        			for (SequenceFlow incomingEdge : ((ParallelGateway) currentElement).getIncoming()) {
						if (currentNode.getEdges().containsKey(incomingEdge)) {
							enabled=true;
						}else{
							enabled=false;
							break;
						}
					}
        			if (enabled) {
        				LTSNode nextNode=new LTSNode(NodeType.CHOR);
                		nextNode.clone(currentNode);
//                		edgeLabel="";
                		for (SequenceFlow incomingEdge : ((ParallelGateway) currentElement).getIncoming()) {
                			nextNode.decreaseEdge(incomingEdge);
//                			edgeLabel+=incomingEdge.getId()+" ";
                		}
                		for (SequenceFlow outgoingEdge : ((ParallelGateway) currentElement).getOutgoing()) {
                			nextNode.addEdge(outgoingEdge);
                		}
                		nextNode=nextNode.validate();
                		choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
                		choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
    					DFS(nextNode);
					}

				}
        	}

//XORGATEWAY
        	if(currentElement instanceof ExclusiveGateway){
//        		DIVERGING
        			for (SequenceFlow outgoingEdge : ((ExclusiveGateway) currentElement).getOutgoing()) {
        				LTSNode nextNode=new LTSNode(NodeType.CHOR);
        				nextNode.clone(currentNode);
        				nextNode.decreaseEdge(edge);
        				nextNode.addEdge(outgoingEdge);
        				nextNode=nextNode.validate();
        				choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        				choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        				DFS(nextNode);

    				}
        	}

//EVENTBASEDGATEWAY
	        if(currentElement instanceof EventBasedGateway){
//        		DIVERGING
        			for (SequenceFlow outgoingEdge : ((EventBasedGateway) currentElement).getOutgoing()) {
        				ModelElementInstance nextElement=modelInstance.getModelElementById(outgoingEdge.getAttributeValue("targetRef"));
        				ChoreographyTask task=new ChoreographyTask((ModelElementInstanceImpl) nextElement, modelInstance);
                		if (task.getType()==TaskType.ONEWAY && !currentNode.getParticipants().get(task.getInitialParticipant()) && !currentNode.getParticipants().get(task.getParticipantRef())) {
                			LTSNode nextNode=new LTSNode(NodeType.CHOR);
                			nextNode.clone(currentNode);
                			nextNode.decreaseEdge(edge);
                			for (SequenceFlow s : task.getOutgoing()) {
                				nextNode.addEdge(s);
                			}
                			nextNode=nextNode.validate();
                			edgeLabel=task.getInitialParticipant().getName()+"->"+task.getParticipantRef().getName()+":"+task.getRequest().getMessage().getName();
                			choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
                			choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
                			DFS(nextNode);
        				}
                		else if(task.getType()==TaskType.TWOWAY && !currentNode.getParticipants().get(task.getInitialParticipant()) && !currentNode.getParticipants().get(task.getParticipantRef())){
                			LTSNode nextNode=new LTSNode(NodeType.CHOR);
                			nextNode.clone(currentNode);
                			nextNode.setParticipant(task.getInitialParticipant(), true);
                			nextNode.setParticipant(task.getParticipantRef(), true);
                			nextNode.decreaseEdge(edge);
                			nextNode.addEdge(outgoingEdge);
                			nextNode=nextNode.validate();
                			edgeLabel=task.getInitialParticipant().getName()+"->"+task.getParticipantRef().getName()+":"+task.getRequest().getMessage().getName();
                			choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
                			choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
                			DFS(nextNode);
        				}

    				}
	        }



//CHOREOGRAPHYTASK
	        
        	if (currentElement instanceof ModelElementInstanceImpl && !(currentElement instanceof EndEvent)&& !(currentElement instanceof ParallelGateway)&& !(currentElement instanceof ExclusiveGateway)&& !(currentElement instanceof EventBasedGateway)) {
        		ChoreographyTask task=new ChoreographyTask((ModelElementInstanceImpl) currentElement, modelInstance);
        		
        		System.out.println(currentElement);

        		if (task.getType()==TaskType.ONEWAY && !currentNode.getParticipants().get(task.getInitialParticipant()) && !currentNode.getParticipants().get(task.getParticipantRef())) {
        			LTSNode nextNode=new LTSNode(NodeType.CHOR);
        			nextNode.clone(currentNode);
        			nextNode.decreaseEdge(edge);
        			for (SequenceFlow s : task.getOutgoing()) {
        				nextNode.addEdge(s);
        			}
        			nextNode=nextNode.validate();
        			edgeLabel=task.getInitialParticipant().getName()+"->"+task.getParticipantRef().getName()+":"+task.getRequest().getMessage().getName();
        			choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        			choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        			DFS(nextNode);
				}
        		else if(task.getType()==TaskType.TWOWAY && !currentNode.getParticipants().get(task.getInitialParticipant()) && !currentNode.getParticipants().get(task.getParticipantRef())){
        			LTSNode nextNode=new LTSNode(NodeType.CHOR);
        			nextNode.clone(currentNode);
        			nextNode.setParticipant(task.getInitialParticipant(), true);
        			nextNode.setParticipant(task.getParticipantRef(), true);
        			nextNode=nextNode.validate();
        			edgeLabel=task.getInitialParticipant().getName()+"->"+task.getParticipantRef().getName()+":"+task.getRequest().getMessage().getName();
        			choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        			choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        			DFS(nextNode);
				}else if(task.getType()==TaskType.TWOWAY && currentNode.getParticipants().get(task.getInitialParticipant()) && currentNode.getParticipants().get(task.getParticipantRef())){
					LTSNode nextNode=new LTSNode(NodeType.CHOR);
        			nextNode.clone(currentNode);
        			nextNode.setParticipant(task.getInitialParticipant(), false);
        			nextNode.setParticipant(task.getParticipantRef(), false);
        			nextNode.decreaseEdge(edge);
        			for (SequenceFlow s : task.getOutgoing()) {
        				nextNode.addEdge(s);
        			}
        			nextNode=nextNode.validate();
        			edgeLabel=task.getParticipantRef().getName()+"->"+task.getInitialParticipant().getName()+":"+task.getResponse().getMessage().getName();
        			choreographyGraph.addEdge(currentNode.getId()+"_"+ nextNode.getId(), String.valueOf(currentNode.getId()), String.valueOf(nextNode.getId()), true).setAttribute("ui.label", edgeLabel);
        			choreographyGraph.getNode(nextNode.getId()).setAttribute("ui.label", nextNode.getId());
        			DFS(nextNode);
				}
        	}



        }




	}

}
