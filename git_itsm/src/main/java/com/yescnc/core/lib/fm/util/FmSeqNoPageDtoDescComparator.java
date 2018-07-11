/**
 * 
 */
package com.yescnc.core.lib.fm.util;

import java.io.Serializable;
import java.util.Comparator;

import com.yescnc.core.entity.db.FmSeqNoPageDto;


/**
 * @author r.boopathi
 *
 */
public class FmSeqNoPageDtoDescComparator implements Comparator<FmSeqNoPageDto>,Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public int compare(FmSeqNoPageDto o1, FmSeqNoPageDto o2)
	{
		if( o1.getKey1() == o2.getKey1())
		{
			// descending for key 2 always
			return o2.getKey2()-o1.getKey2();
		}
		return o2.getKey1()- o1.getKey1();
	}


}
