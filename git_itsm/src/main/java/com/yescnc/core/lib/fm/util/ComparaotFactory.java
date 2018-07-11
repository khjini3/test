/**
 * 
 */
package com.yescnc.core.lib.fm.util;

import java.util.Comparator;

import com.yescnc.core.entity.db.FmEventVO;


/**
 * @author r.boopathi
 *
 */
public final class ComparaotFactory
{

	
	public static Comparator<FmEventVO> getFmEventDtoComparator( String sortColName, String strSortOrder)
	{
		boolean asc = strSortOrder.toLowerCase().equals("asc");
		if("alarm_group".equalsIgnoreCase(sortColName))
		{
			if( asc )
			{
				return new FmEventDtoAlarmGroupAscComparator();
			}
			else
			{
				return new FmEventDtoAlarmGroupDescComparator();
			}
		}
		else if("severity".equalsIgnoreCase(sortColName))
		{
			if( asc )
			{
				return new FmEventDtoSeverityAscComparator();
			}
			else
			{
				return new FmEventDtoSeverityDescComparator();
			}
		}
		
		else if("ne_id".equalsIgnoreCase(sortColName))
		{
			if( asc )
			{
				return new FmEventDtoNeIdAscComparator();
			}
			else
			{
				return new FmEventDtoNeIdDescComparator();
			}
		}
		else if("clear_time".equalsIgnoreCase(sortColName))
		{
			if( asc )
			{
				return new FmEventDtoClearTimeAscComparator();
			}
			else
			{
				return new FmEventDtoClearTimeDescComparator();
			}
		}
		else // alarm time
		{
			if( asc )
			{
				return new FmEventDtoAlarmTimeAscComparator();
			}
			else
			{
				return new FmEventDtoAlarmTimeDescComparator();
			}
		}
	}

}
