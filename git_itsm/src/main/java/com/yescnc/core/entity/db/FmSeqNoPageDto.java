/**
 * 
 */
package com.yescnc.core.entity.db;

import java.io.Serializable;

/**
 * @author r.boopathi
 *
 */
public class FmSeqNoPageDto implements Serializable
{
	private long seqNo;
	private	int key1;
	private	int key2;
	
	/**
	 * @return the seqNo
	 */
	public long getSeqNo()
	{
		return seqNo;
	}
	/**
	 * @param seqNo the seqNo to set
	 */
	public void setSeqNo(long seqNo)
	{
		this.seqNo = seqNo;
	}
	/**
	 * @return the key1
	 */
	public int getKey1()
	{
		return key1;
	}
	/**
	 * @param key1 the key1 to set
	 */
	public void setKey1(int key1)
	{
		this.key1 = key1;
	}
	/**
	 * @return the key2
	 */
	public int getKey2()
	{
		return key2;
	}
	/**
	 * @param key2 the key2 to set
	 */
	public void setKey2(int key2)
	{
		this.key2 = key2;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return "FmSeqNoPageDto [seqNo=" + seqNo + ", key1=" + key1 + ", key2="
				+ key2 + "]";
	}
	
}
