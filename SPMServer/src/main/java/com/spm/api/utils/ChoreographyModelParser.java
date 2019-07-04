package com.spm.api.utils;

import java.io.File;
import java.util.Collection;

import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.EndEvent;
import org.camunda.bpm.model.bpmn.instance.EventBasedGateway;
import org.camunda.bpm.model.bpmn.instance.ExclusiveGateway;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.ParallelGateway;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.StartEvent;
import org.camunda.bpm.model.xml.impl.instance.ModelElementInstanceImpl;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;

public class ChoreographyModelParser {
	private static BpmnModelInstance modelInstance;
	
	//private Collection<StartEvent> startEvents;
	//private Collection<EndEvent> endEvents;
	//private Collection<ParallelGateway> parallelGateways;
	//private Collection<ExclusiveGateway> exclusiveGateways;
	//private Collection<EventBasedGateway> eventBasedGateways;
	
	public Collection<FlowNode> flowNodes;							// all flow nodes in the model.
	public Collection<SequenceFlow> sequenceFlow;					// sequence flow
	
	private int index;
	
	
	public void parseChorModel(File chor) {
		modelInstance = Bpmn.readModelFromFile(chor);
		
		flowNodes = modelInstance.getModelElementsByType(FlowNode.class);
		sequenceFlow = modelInstance.getModelElementsByType(SequenceFlow.class);
		
		
		System.out.println("\n --- FLOW NODES ---");
		index = 0;
		flowNodes.forEach(f -> {
			index++;
			System.out.println("- N." + index + "  : " + f);
			System.out.println("- TYPE : " + f.getElementType());
			System.out.println("- ID   : " + f.getId());
		});
		
		System.out.println("\n --- SEQUENCE FLOW ---");
		index = 0;
		sequenceFlow.forEach(sf -> {
			index++;
			System.out.println("- N." + index + "  : " + sf);
			System.out.println("- TYPE : " + sf.getElementType());
			System.out.println("- ID   : " + sf.getId());
		});
		
		System.out.println("\n --- CHOREOGRAPHY TASK ---");
		index = 0;
		for (SequenceFlow flow : modelInstance.getModelElementsByType(SequenceFlow.class)) {
			ModelElementInstance node = modelInstance.getModelElementById(flow.getAttributeValue("targetRef"));
			
			if ( node instanceof ModelElementInstanceImpl && 
				!(node instanceof EndEvent) && 
				!(node instanceof ParallelGateway) && 
				!(node instanceof ExclusiveGateway) && 
				!(node instanceof EventBasedGateway) &&
				!(node instanceof StartEvent) ) 
			{
				ChoreographyTask task = new ChoreographyTask((ModelElementInstanceImpl) node, modelInstance);
				
				index++;
				System.out.println("- N." + index + "  : " + task);
				System.out.println("- TYPE : " + task.getType());
				System.out.println("- ID   : " + task.getId());
				System.out.println("- NAME : " + task.getName());
			}
		}
		
	}
	
	/*private void printNodes(Collection<ModelElementInstanceImpl> nodes) {
		index = 0;
		nodes.forEach(n -> {
			index++;
			System.out.println("- N." + index + "  : " + n);
			System.out.println("- TYPE : " + n.getElementType());
			System.out.println("- ID   : " + n.getId());
		});
	}*/

}












