package com.spm.api.utils;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

//import javax.rmi.CORBA.Util;

import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.MessageFlow;
import org.camunda.bpm.model.bpmn.instance.Participant;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;

import com.spm.api.utils.Choreography;
import com.spm.api.utils.Collaboration;

public class LTSNode {

	Hashtable<SequenceFlow, Integer> edges;
	Hashtable<MessageFlow, Integer>messages;
	Hashtable<Participant, Boolean> participants;
	String label;
	Integer id;
	NodeType type;

	public enum NodeType {
		COL, CHOR
	}

	public int getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public LTSNode(NodeType type) {
		if (type==NodeType.COL) {
			this.id=Collaboration.collaborationCounter++;
			this.type=type;
		}else if(type==NodeType.CHOR) {
			this.type=type;
			this.id=Choreography.choreographyCounter++;
		}

		this.edges = new Hashtable<>();
		this.messages = new Hashtable<>();
		this.participants = new Hashtable<>();
	}


	public void addParticipant(Participant key, boolean value){
		participants.put(key, value);
	}
	public void addEdge(SequenceFlow key){
		if (edges.containsKey(key)) {
			Integer value=edges.get(key);
			edges.replace(key, value+1);
		}else{
			edges.put(key, 1);
		}
	}
	public void decreaseEdge(SequenceFlow key){
		if(edges.get(key)==1){
			edges.remove(key);
		}else{
			Integer value=edges.get(key);
			edges.replace(key, value-1);
		}
	}
	public void addMessages(MessageFlow key){
		if (messages.containsKey(key)) {
			Integer value=edges.get(key);
			messages.replace(key, value+1);
		}else{
			messages.put(key, 1);
		}
	}

	public boolean checkMessage(MessageFlow key){
		if(messages.isEmpty() || !messages.contains(key)){
			return false;
		}else{
			return true;
		}
	}
	public boolean decreaseMessage(MessageFlow key){
		if (messages.containsKey(key)){
			if (messages.get(key) == 1) {
				messages.remove(key);
				return true;
			} else if (messages.get(key) > 1) {
				Integer value = messages.get(key);
				messages.replace(key, value - 1);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}

	}
	@Override
	public String toString() {
String edge = "", participant = "", message = "";
		for (SequenceFlow key : edges.keySet()) {
		    edge+= key.getId()+"_"+edges.get(key)+"+";
		}
		for (MessageFlow key : messages.keySet()) {
		    message+= key.getId()+"_"+messages.get(key)+"+";
		}

		for (Participant key : participants.keySet()) {
		    message+= key+"+";
		}



		return "LTSNode [edges=" + edge + ", messages=" + message + ", participants=" + participant + ", label="
				+ label + ", id=" + id + "]";
	}

	public void setParticipant(Participant key, Boolean value){
		participants.replace(key, value);
	}

	public void setLabel(String label){
		this.label=label;
	}



	public Hashtable<SequenceFlow, Integer> getEdges() {
		return edges;
	}

	public void setEdges(Hashtable<SequenceFlow, Integer> edges) {
		this.edges = edges;
	}

	public Hashtable<MessageFlow, Integer> getMessages() {
		return messages;
	}

	public void setMessages(Hashtable<MessageFlow, Integer> messages) {
		this.messages = messages;
	}

	public Hashtable<Participant, Boolean> getParticipants() {
		return participants;
	}

	public void setParticipants(Hashtable<Participant, Boolean> participants) {
		this.participants = participants;
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LTSNode other = (LTSNode) obj;
		if (edges == null) {
			if (other.edges != null)
				return false;
		} else if (!edges.equals(other.edges))
			return false;
		if (messages == null) {
			if (other.messages != null)
				return false;
		} else if (!messages.equals(other.messages))
			return false;
		if (participants == null) {
			if (other.participants != null)
				return false;
		} else if (!participants.equals(other.participants))
			return false;
		return true;
	}


	public void clone(LTSNode node){
		this.edges=(Hashtable<SequenceFlow, Integer>) node.getEdges().clone();
		this.messages=(Hashtable<MessageFlow, Integer>) node.getMessages().clone();
		this.participants=(Hashtable<Participant, Boolean>) node.getParticipants().clone();
	}

	public LTSNode validate() {

		if (this.type==NodeType.CHOR) {
			for (LTSNode node : Choreography.nodeSet) {
				if (node.equals(this)) {
					Choreography.choreographyCounter--;
//					System.out.println(Utils.nodeSet);
					return node;
				}
			}

			Choreography.nodeSet.add(this);
//			System.out.println(Utils.nodeSet);
			return this;
		}
		if (this.type==NodeType.COL) {
			for (LTSNode node : Collaboration.nodeSet) {
				if (node.equals(this)) {
					Collaboration.collaborationCounter--;
//					System.out.println(Utils.nodeSet);
					return node;
				}
			}

			Collaboration.nodeSet.add(this);
//			System.out.println(Utils.nodeSet);
			return this;
		}else{
			return null;
		}



	}







}

