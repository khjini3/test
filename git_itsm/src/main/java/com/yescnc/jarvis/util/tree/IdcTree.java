package com.yescnc.jarvis.util.tree;

import java.util.ArrayList;
import java.util.List;

import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.LocationVO;
import com.yescnc.jarvis.entity.db.SymbolVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;

public class IdcTree {
	
	public static void add(SymbolVO parent, SymbolVO child){
		List<SymbolVO> parentNodes = parent.getNodes();
		if(parentNodes == null){
			parentNodes = new ArrayList<SymbolVO>();
		}
		
		parentNodes.add(child);
		
		parent.setNodes(parentNodes);
		
		if(parent.getSeverity() > child.getSeverity()){
			parent.setSeverity(child.getSeverity());
		}
	}
	
	// 부모 노드에 자식 노드 추가
    public static void add(LocationVO parent, LocationVO child) {
        // 부모 노드의 자식 노드가 없다면
    	List<LocationVO> parentNodes = parent.getNodes();
    	
    	if(parentNodes == null){
    		parentNodes = new ArrayList<LocationVO>();
    	}
    	
    	parentNodes.add(child);
    	
    	parent.setNodes(parentNodes);
    }
    
    public static void addCode(IdcCodeVO parent, IdcCodeVO child) {
    	// 부모 노드의 자식 노드가 없다면
    	List<IdcCodeVO> parentNodes = parent.getNodes();
    	
    	if(parentNodes == null){
    		parentNodes = new ArrayList<IdcCodeVO>();
    	}
    	
    	parentNodes.add(child);
    	
    	parent.setNodes(parentNodes);
    }
     
    public void add(MenuManagerVO parent, MenuManagerVO child) {
        // 부모 노드의 자식 노드가 없다면
    	List<MenuManagerVO> parentNodes = parent.getNodes();
    	
    	if(parentNodes == null){
    		parentNodes = new ArrayList<MenuManagerVO>();
    	}
    	
    	parentNodes.add(child);
    	
    	parent.setNodes(parentNodes);
    }
     
    // 모두 출력
    public static void printTree(Node node, int depth) {
        for(int i = 0; i < depth; i++)
            System.out.print(" ");
         
        // 데이터 출력
        System.out.println(node.getData());
         
        // 자식 노드가 존재한다면
        if(node.getLeftChild() != null){
        	printTree(node.getLeftChild(), depth + 1);
        }
            
         
        // 형제 노드가 존재한다면
        if(node.getRightSibling() != null){
        	printTree(node.getRightSibling(), depth);
        }
            
    }

	public void add(SiteManagerCompanyVO parent, SiteManagerCompanyVO child) {
		 // 부모 노드의 자식 노드가 없다면
    	List<SiteManagerCompanyVO> parentNodes = parent.getNodes();
    	
    	if(parentNodes == null){
    		parentNodes = new ArrayList<SiteManagerCompanyVO>();
    	}
    	
    	parentNodes.add(child);
    	
    	parent.setNodes(parentNodes);
	}
    
}
