package com.yescnc.jarvis.util.tree;

public class Node {
	private String data;
	private Node leftChild;
	private Node rightSibling;
	
	public Node(String data) {
        this.data = data;
    }
 
    public void setData(String data) {
        this.data = data;
    }
 
    public String getData() {
        return data;
    }
 
    public void setLeftChild(Node leftChild) {
        this.leftChild = leftChild;
    }
 
    public Node getLeftChild() {
        return leftChild;
    }
 
    public void setRightSibling(Node rightSibling) {
        this.rightSibling = rightSibling;
    }
 
    public Node getRightSibling() {
        return rightSibling;
    }
}
