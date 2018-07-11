/**
 * 
 */
package com.yescnc.core.lib.fm.util;

import java.io.Serializable;
import java.util.Comparator;

import com.yescnc.core.entity.db.FmEventVO;

/**
 * @author r.boopathi
 *
 */
public class FmEventDtoAlarmTimeAscComparator implements Comparator<FmEventVO> ,Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public int compare(FmEventVO o1, FmEventVO o2)
	{
		int alarmTimeComValue = o1.getAlarmTime().compareTo(o2.getAlarmTime());
		if( alarmTimeComValue == 0 )
		{
			return (int) (o1.getSeqNo() - o2.getSeqNo());
		}
		return alarmTimeComValue;
	}


}
