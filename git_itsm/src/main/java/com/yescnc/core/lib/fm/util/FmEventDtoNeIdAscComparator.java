package com.yescnc.core.lib.fm.util;

import java.io.Serializable;
import java.util.Comparator;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;


public class FmEventDtoNeIdAscComparator implements Comparator<FmEventVO> ,Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private FmEventDtoAlarmTimeDescComparator alarmTimeDesc = new FmEventDtoAlarmTimeDescComparator();
	@Override
	public int compare(FmEventVO o1, FmEventVO o2)
	{
		int neIdComVal = FmUtil.getNeIdIntValue( o1.getNeId()) - FmUtil.getNeIdIntValue(o2.getNeId());
		if( neIdComVal == 0 )
		{
			// descending for key 2 always( alarm time and seq no desc)
			return alarmTimeDesc.compare(o1,o2);
		}
		return neIdComVal;
	}
	

}
