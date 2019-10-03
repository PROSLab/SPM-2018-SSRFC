package com.spm.api.utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.springframework.http.codec.multipart.FilePart;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class TestXML {
	
	public static Document xmlRes;
	public static Document xmlTake;
	public static String participantId;
	public static String participantIdTake;

	
	public static void init(FilePart sender, FilePart receiver/*, File outputFile*/) throws Exception {
		String tempDir = System.getProperty("java.io.tmpdir");
		File file1 = File.createTempFile("sender", ".xml", new File(tempDir));
		File file2 = File.createTempFile("receiver", ".xml", new File(tempDir));
		sender.transferTo( file1 );
		receiver.transferTo( file2 );
		
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder;
		dBuilder = dbFactory.newDocumentBuilder();
		
		xmlRes = dBuilder.parse(file1);
		xmlRes.getDocumentElement().normalize();
		
		DocumentBuilderFactory dbFactory2 = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder2;
		dBuilder2 = dbFactory2.newDocumentBuilder();
		
		xmlTake = dBuilder2.parse(file2);
		xmlTake.getDocumentElement().normalize();	
	}
	
	public static void writeOutputFile (File outputFile) {
		writeDocToFile(xmlRes, outputFile, false, true);
	}
	
	// Must be called after TestXML.init method
	private static void validate() throws Exception {		
		NodeList msgFlowRes = xmlRes.getElementsByTagName("messageFlow");
		NodeList msgFlowTake = xmlTake.getElementsByTagName("messageFlow");
		
		int msgLenRes = msgFlowRes.getLength();
		int msgLenTake = msgFlowTake.getLength();
		
		// Compare if the two files have same number of messageFlow
		if( msgLenRes != msgLenTake ) {
			 throw new Exception("Models not have same number of message flows");
		}
		
		// Compare if each name of first file is defined in the second file
		for (int i = 0; i < msgLenRes; i++) {
			Node nRes = msgFlowRes.item(i);
			String nResName = ((Element) nRes).getAttribute("name").replaceAll("\\s+","");
			String nResSource = ((Element) nRes).getAttribute("sourceRef");
			String nResTarget = ((Element) nRes).getAttribute("targetRef");
			
			for (int j = 0; j < msgLenTake; j++) {
				Node nTake = msgFlowTake.item(j);
				String nTakeName = ((Element) nTake).getAttribute("name").replaceAll("\\s+","");
				
				if( nResName.equals( nTakeName ) ) {
					String nTakeSource = ((Element) nTake).getAttribute("sourceRef");
					String nTakeTarget = ((Element) nTake).getAttribute("targetRef");
					
					// nRes is receiver and nTake is sender
					if(nResSource.equals(participantId) && nTakeTarget.equals(participantIdTake)) { 
						// it's ok!
						break;
					}
					// nRes is sender and nTake is receiver
					if(nResTarget.equals(participantId) && nTakeSource.equals(participantIdTake)) { 
						// it's ok!
						break;
					}
					
					throw new Exception("There is a message flow in first model sender/receiver that not match the second model message flow receiver/sender");
				}
				
				if(j == msgLenTake - 1) {
					throw new Exception("There is a message flow name in first model that not match the second model");
				}
			}
		}
		
		// Compare if each name of second file is defined in the first file
		for (int i = 0; i < msgLenTake; i++) {
			Node nTake = msgFlowTake.item(i);
			String nTakeName = ((Element) nTake).getAttribute("name").replaceAll("\\s+","");
			String nTakeSource = ((Element) nTake).getAttribute("sourceRef");
			String nTakeTarget = ((Element) nTake).getAttribute("targetRef");
			
			for (int j = 0; j < msgLenRes; j++) {
				Node nRes = msgFlowRes.item(j);
				String nResName = ((Element) nRes).getAttribute("name").replaceAll("\\s+","");
				
				if( nTakeName.equals( nResName ) ) {
					String nResSource = ((Element) nRes).getAttribute("sourceRef");
					String nResTarget = ((Element) nRes).getAttribute("targetRef");
				
					// nTake is receiver and nRes is sender
					if(nTakeSource.equals(participantIdTake) && nResTarget.equals(participantId)) { 
						// it's ok!
						break;
					}
					// nTake is sender and nRes is receiver
					if(nTakeTarget.equals(participantIdTake) && nResSource.equals(participantId)) { 
						// it's ok!
						break;
					}
					
					throw new Exception("There is a message flow in second model sender/receiver that not match the first model message flow receiver/sender");
				}
				
				if(j == msgLenRes - 1) {
					throw new Exception("There is a message flow name in second model that not match the first model");
				}
			}
		}
	}
	
	public static void mergeXml() throws Exception {
		// find empty process tags
		NodeList nProcess = xmlRes.getElementsByTagName("process");
		
		int del = 0;
		Node nDel = nProcess.item(del);
		
		for (int i = 0; i < nProcess.getLength(); i++) {
			Node nCurr = nDel;
			NodeList childsCurr = nCurr.getChildNodes();
			
			for (int j = i + 1; j < nProcess.getLength(); j++) { 
				Node nNext = nProcess.item(j);
				NodeList childsNext = nNext.getChildNodes();
				
				if(childsNext.getLength() <= childsCurr.getLength()) {
					i = j;
					nDel = nProcess.item(j);
					break;
				}
				
			}
		}
		
		Element eElement = (Element) nDel;
		String processId = eElement.getAttribute("id");
		
		// Add the process node from xmlTake
		Node newProc = getNotEmptyProcess();
		eElement.getParentNode().insertBefore(newProc, eElement.getNextSibling());
		
		// Remove process node
		eElement.getParentNode().removeChild(eElement);
		
		// Find and remove participant tags with processRef = process id
		NodeList nParticipant = xmlRes.getElementsByTagName("participant");
		
		for (int i = 0; i < nParticipant.getLength(); i++) {
			Node nPart = nParticipant.item(i);
			
			if (nPart.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) nPart;
				
				if(el.getAttribute("processRef").equals(processId)) {
					// Add the participant node from xmlTake
					Element pel = (Element) newProc;
					el.getParentNode().insertBefore( getNotEmptyParticipant( pel.getAttribute("id") ),  el.getNextSibling());
					
					// Remove participant node
					participantId = el.getAttribute("id");
					el.getParentNode().removeChild(el);
				}
			}
		}
		
		// Find and remove bpmndi:BPMNShape with bpmnElement = participantId
		NodeList nBPMNShape = xmlRes.getElementsByTagName("bpmndi:BPMNShape");
		
		for (int i = 0; i < nBPMNShape.getLength(); i++) {
			Node nShape = nBPMNShape.item(i);
			
			if (nShape.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) nShape;
				
				if(el.getAttribute("bpmnElement").equals(participantId)) {
					// Remove shape node
					el.getParentNode().removeChild(el);
				}
			}
		}

		ArrayList<Node> shapes = getAllShapes();
		ArrayList<Node> edges = getAllEdges();
		
		Element edgeFirst = (Element) xmlRes.getElementsByTagName("bpmndi:BPMNEdge").item(0);
		
		shapes.forEach(s -> {
			edgeFirst.getParentNode().insertBefore(xmlRes.importNode(s, true), edgeFirst.getNextSibling());
		});
		
		edges.forEach(e -> {
			edgeFirst.getParentNode().insertBefore(xmlRes.importNode(e, true), edgeFirst.getNextSibling());
		});
		

		// Validate the models before connect messageFlows
		validate();
		
		// Connect messageFlows
		connectMessageFlows();
		
		// Remove Empty shapes
		removeEmptyShapes();
	}
	
	private static void removeEmptyShapes() {
		NodeList nBPMNShape = xmlRes.getElementsByTagName("bpmndi:BPMNShape");
		
		for (int i = 0; i < nBPMNShape.getLength(); i++) {
			Node nShape = nBPMNShape.item(i);
			NodeList shapeChilds = nShape.getChildNodes();
			
			if(shapeChilds.getLength() <= 0) {
				Element eElement = (Element) nShape;
				eElement.getParentNode().removeChild(eElement);
			}
		}
	}
	
	public static void connectMessageFlows() {
		ArrayList<Node> msgflowsRes = new ArrayList<Node>(); 
		ArrayList<Node> msgflowsTake = new ArrayList<Node>();
		
		NodeList mfr = xmlRes.getElementsByTagName("messageFlow");
		NodeList mft = xmlTake.getElementsByTagName("messageFlow");
		
		//System.out.println("Black Pool box xml sender: " + participantId);
		
		for(int i = 0; i < mfr.getLength(); i++) {
			Node mf = mfr.item(i);
			
			if (mf.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) mf;
				
				if(el.getAttribute("targetRef").equals(participantId) 
				|| el.getAttribute("sourceRef").equals(participantId)) {
					msgflowsRes.add(mf);
				}
			}
		}
		
		//System.out.println("Black Pool box xml receiver: " + participantIdTake);
		
		for(int i = 0; i < mft.getLength(); i++) {
			Node mf = mft.item(i);
			
			if (mf.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) mf;
				
				if(el.getAttribute("sourceRef").equals(participantIdTake)
				|| el.getAttribute("targetRef").equals(participantIdTake)) {
					msgflowsTake.add(mf);
				}
			}
		}
		
		// CONTROLLARE IPOTESI CI SONO GLI STESSI MESSAGE FLOW
		
		msgflowsRes.forEach(mres -> {
			Element eMres = (Element) mres;
			
			for(int i = 0; i < msgflowsTake.size(); i++) {
				Element eMtake = (Element) msgflowsTake.get(i);
				String eMresName = eMres.getAttribute("name").replaceAll("\\s+","");
				String eMtakeName = eMtake.getAttribute("name").replaceAll("\\s+","");
				
				if(eMresName.equals(eMtakeName)) {
					
					// MESSAGE FLOW "SENDER"
					if(eMres.getAttribute("targetRef").equals(participantId)
					&& !eMres.getAttribute("sourceRef").equals(participantId)) {
						String targetRef = eMtake.getAttribute("targetRef");
						eMres.setAttribute("targetRef", targetRef);
						
						setCoordinates(eMres, eMtake);
					}
					
					// MESSAGE FLOW "RECEIVER"
					if(!eMres.getAttribute("targetRef").equals(participantId)
					&& eMres.getAttribute("sourceRef").equals(participantId)) {
						String sourceRef = eMtake.getAttribute("sourceRef");
						eMres.setAttribute("sourceRef", sourceRef);
						
						setStartCoordinates(eMres, eMtake);
						setCoordinates(eMtake, eMres);
					}
	
				}
			}
		});
	}
	
	public static void setCoordinates(Element messageFlow, Element target) {
		ArrayList<String> targetXY = getShapeCoords("omgdc:Bounds", getShapeById("bpmndi:BPMNShape", target.getAttribute("targetRef")));
		Element msgEdge = getShapeById("bpmndi:BPMNEdge", messageFlow.getAttribute("id"));
		setShapeCoords("omgdi:waypoint", msgEdge, targetXY.get(0), targetXY.get(1));
	}
	
	public static void setStartCoordinates(Element messageFlow, Element target) {
		ArrayList<String> targetXY = getShapeCoords("omgdc:Bounds", getShapeById("bpmndi:BPMNShape", target.getAttribute("sourceRef")));
		System.out.println(targetXY);
		Element msgEdge = getShapeById("bpmndi:BPMNEdge", messageFlow.getAttribute("id"));
		setStartShapeCoords("omgdi:waypoint", msgEdge, targetXY.get(0), targetXY.get(1));
	}
	
	// tag: "bpmndi:BPMNShape"
	// tag: "bpmndi:BPMNEdge"
	public static Element getShapeById(String tag, String id) {
		NodeList nodes = xmlRes.getElementsByTagName(tag);		
		for (int i = 0; i < nodes.getLength(); i++) {
			Element res = (Element) nodes.item(i);
			if(res.getAttribute("bpmnElement").equals(id)) {
				return res;
			}
		}
		return null;
	}
	
	// omgdc:Bounds
	public static ArrayList<String> getShapeCoords(String tag, Element shape) {
		ArrayList<String> coords = new ArrayList<String>();
		
		NodeList nBounds = shape.getElementsByTagName(tag);
		int len = nBounds.getLength();
		Element eBound = (Element) nBounds.item(len - 1);
		
		String x = eBound.getAttribute("x");
		String y = eBound.getAttribute("y");
		
		coords.add(x);
		coords.add(y);
		
		return coords;
	}
	
	// omgdi:waypoint
	public static void setShapeCoords(String tag, Element shape, String x, String y) {
		NodeList nBounds = shape.getElementsByTagName(tag);
		int len = nBounds.getLength();
		Element eBound = (Element) nBounds.item(len - 1);
		
		Integer xint = Integer.parseInt(x) + 20;
		
		eBound.setAttribute("x", xint.toString());
		eBound.setAttribute("y", y);
	}
	
	// omgdi:waypoint
	public static void setStartShapeCoords(String tag, Element shape, String x, String y) {
		NodeList nBounds = shape.getElementsByTagName(tag);
		Element eBound = (Element) nBounds.item(0);
		
		Integer xint = Integer.parseInt(x) + 20;
		
		eBound.setAttribute("x", xint.toString());
		eBound.setAttribute("y", y);
	}
	
	public static final void prettyPrint(Document xml) throws Exception {
        Transformer tf = TransformerFactory.newInstance().newTransformer();
        tf.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
        tf.setOutputProperty(OutputKeys.INDENT, "yes");
        Writer out = new StringWriter();
        tf.transform(new DOMSource(xml), new StreamResult(out));
        System.out.println(out.toString());
    }
	
	public static Node getNotEmptyProcess() {
		// find not empty process tags
		NodeList nProcess = xmlTake.getElementsByTagName("process");
		Node proc = nProcess.item(0);
		
		for (int i = 0; i < nProcess.getLength(); i++) {
			Node nCurr = proc;
			NodeList childsCurr = nCurr.getChildNodes();
			
			for (int j = i + 1; j < nProcess.getLength(); j++) { 
				Node nNext = nProcess.item(j);
				NodeList childsNext = nNext.getChildNodes();
				
				if(childsNext.getLength() > childsCurr.getLength()) {
					i = j;
					proc = nProcess.item(j);
					break;
				}
				
			}
		}
		
		return xmlRes.importNode(proc, true);
	}
	
	public static Node getNotEmptyParticipant(String processId) {
		Node np = null;
		NodeList nParticipant = xmlTake.getElementsByTagName("participant");
		
		for (int i = 0; i < nParticipant.getLength(); i++) {
			Node nPart = nParticipant.item(i);
			
			if (nPart.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) nPart;
				
				if(el.getAttribute("processRef").equals(processId)) {
					np = nPart;
					break;
				}
			}
		}
		
		return xmlRes.importNode(np, true);
	}
	
	public static String getEmptyParticipantId() {
		NodeList nProcess = xmlTake.getElementsByTagName("process");
		Node proc = nProcess.item(0);
		
		for (int i = 0; i < nProcess.getLength(); i++) {
			Node nCurr = proc;
			NodeList childsCurr = nCurr.getChildNodes();
			
			for (int j = i + 1; j < nProcess.getLength(); j++) { 
				Node nNext = nProcess.item(j);
				NodeList childsNext = nNext.getChildNodes();
				
				if(childsNext.getLength() <= childsCurr.getLength()) {
					i = j;
					proc = nProcess.item(j);
					break;
				}
				
			}
		}
		
		Element pel = (Element) proc;
		String procId = pel.getAttribute("id");
		String partId = null;
		
		NodeList nParticipant = xmlTake.getElementsByTagName("participant");
		
		for (int i = 0; i < nParticipant.getLength(); i++) {
			Node nPart = nParticipant.item(i);
			
			if (nPart.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) nPart;
				
				if(el.getAttribute("processRef").equals(procId)) {
					// Remove participant node
					partId = el.getAttribute("id");
				}
			}
		}
		
		return partId;
	}
	
	public static ArrayList<Node> getAllShapes() {
		String noshape = getEmptyParticipantId();
		participantIdTake = noshape;
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		NodeList nBPMNShape = xmlTake.getElementsByTagName("bpmndi:BPMNShape");
		
		for (int i = 0; i < nBPMNShape.getLength(); i++) {
			Node nShape = nBPMNShape.item(i);
			
			if (nShape.getNodeType() == Node.ELEMENT_NODE) {
				Element el = (Element) nShape;
				
				if(!el.getAttribute("bpmnElement").equals(noshape)) {
					nodes.add( nShape );
				}
			}
		}
		
		return nodes;
	}
	
	public static ArrayList<Node> getAllEdges() {
		ArrayList<Node> nodes = new ArrayList<Node>();
		NodeList nBPMNEdge = xmlTake.getElementsByTagName("bpmndi:BPMNEdge");
		
		for (int i = 0; i < nBPMNEdge.getLength(); i++) {
			Node nEdge = nBPMNEdge.item(i);
			
			if (nEdge.getNodeType() == Node.ELEMENT_NODE) {
				nodes.add(nEdge);
			}
		}
		
		return nodes;
	}
	
	private static void writeDocToFile(Document document, File outputFile, boolean excludeDeclaration, boolean prettyPrint) {
        try(FileWriter writer = new FileWriter( outputFile )) {
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            if(excludeDeclaration) {
                transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            }
            if(prettyPrint) {
                transformer.setOutputProperty(OutputKeys.INDENT, "yes");
                transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
            }
            DOMSource source = new DOMSource(document);
            StreamResult result = new StreamResult(writer);
            transformer.transform(source, result);
            
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        } catch (TransformerConfigurationException e) {
            throw new IllegalStateException(e);
        } catch (TransformerException e) {
            throw new IllegalArgumentException(e);
        }
    }

}











