package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.List;

public class PageVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1356294928190089044L;
	
	private int firstRow;   
    private int lastRow;    
    private int sort = 0; // 0 : asc, 1 : desc
	private int rowCount; 
	private int totalCount; 
    private int firstPageNo; 
    private int prevPageNo;  
    private int startPageNo; 
    private int currentPageNo;      
    private int endPageNo;   
    private int nextPageNo;  
    private int finalPageNo; 
    private List<?> list;

	public int getFirstRow() {
		return firstRow;
	}

	public void setFirstRow(int firstRow) {
		this.firstRow = firstRow;
	}

	public int getLastRow() {
		return lastRow;
	}

	public void setLastRow(int lastRow) {
		this.lastRow = lastRow;
	}

	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public int getRowCount() {
		return rowCount;
	}

	public void setRowCount(int rowCount) {
		this.rowCount = rowCount;
	}

	public int getFirstPageNo() {
		return firstPageNo;
	}

	public void setFirstPageNo(int firstPageNo) {
		this.firstPageNo = firstPageNo;
	}

	public int getPrevPageNo() {
		return prevPageNo;
	}

	public void setPrevPageNo(int prevPageNo) {
		this.prevPageNo = prevPageNo;
	}

	public int getStartPageNo() {
		return startPageNo;
	}

	public void setStartPageNo(int startPageNo) {
		this.startPageNo = startPageNo;
	}

	public int getCurrentPageNo() {
		return currentPageNo;
	}

	public void setCurrentPageNo(int currentPageNo) {
		this.currentPageNo = currentPageNo;
	}

	public int getEndPageNo() {
		return endPageNo;
	}

	public void setEndPageNo(int endPageNo) {
		this.endPageNo = endPageNo;
	}

	public int getNextPageNo() {
		return nextPageNo;
	}

	public void setNextPageNo(int nextPageNo) {
		this.nextPageNo = nextPageNo;
	}

	public int getFinalPageNo() {
		return finalPageNo;
	}

	public void setFinalPageNo(int finalPageNo) {
		this.finalPageNo = finalPageNo;
	}

	public List<?> getList() {
		return list;
	}

	public void setList(List<?> list) {
		this.list = list;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
        this.paging();
    }

    private void paging() {
        if (this.totalCount == 0) return; 
        if (this.currentPageNo == 0) this.setCurrentPageNo(1); 
        if (this.rowCount == 0) this.setRowCount(10); 

        int finalPage = (totalCount + (rowCount - 1)) / rowCount; 
        if (this.currentPageNo > finalPage) this.setCurrentPageNo(finalPage); 

        if (this.currentPageNo < 0 || this.currentPageNo > finalPage) this.currentPageNo = 1; 

        boolean isFirst = currentPageNo == 1 ? true : false; 
        boolean isFinal = currentPageNo == finalPage ? true : false; 

        int startPage = ((currentPageNo - 1) / 10) * 10 + 1; 
        int endPage = startPage + 10 - 1; 

        if (endPage > finalPage) { 
            endPage = finalPage;
        }

        this.setFirstPageNo(1); 

        if (isFirst) {
            this.setPrevPageNo(1); 
        } else {
            this.setPrevPageNo(((currentPageNo - 1) < 1 ? 1 : (currentPageNo - 1))); 
        }

        this.setStartPageNo(startPage); 
        this.setEndPageNo(endPage); 

        if (isFinal) {
            this.setNextPageNo(finalPage);
        } else {
            this.setNextPageNo(((currentPageNo + 1) > finalPage ? finalPage : (currentPageNo + 1)));
        }

        this.setFinalPageNo(finalPage);
        rowNum();
    }
    private void rowNum() {
    	if(getSort() > 0) {
    		int descFirst = totalCount - (currentPageNo-1) * rowCount;
    		int descLast = (totalCount - currentPageNo * rowCount) + 1;
    		setFirstRow(descFirst);
    		setLastRow(descLast < 1 ? 1 : descLast);
    	} else {
    		int ascFirst = (currentPageNo - 1) * rowCount + 1;
    		int asclast = currentPageNo * rowCount;
    		setLastRow(asclast > totalCount ? totalCount : asclast);
    		setFirstRow(ascFirst);
    	}
    }
}