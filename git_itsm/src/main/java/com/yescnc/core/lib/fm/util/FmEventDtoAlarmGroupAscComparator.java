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
public class FmEventDtoAlarmGroupAscComparator implements Comparator<FmEventVO> ,Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private FmEventDtoAlarmTimeDescComparator alarmTimeDesc = new FmEventDtoAlarmTimeDescComparator();
	@Override
	public int compare(FmEventVO o1, FmEventVO o2)
	{
		int alarmGrpComVal = o1.getAlarmGroup() - o2.getAlarmGroup();
		if( alarmGrpComVal == 0 )
		{
			// descending for key 2 always( alarm time and seq no desc)
			return alarmTimeDesc.compare(o1,o2);
		}
		return alarmGrpComVal;
	}


}
