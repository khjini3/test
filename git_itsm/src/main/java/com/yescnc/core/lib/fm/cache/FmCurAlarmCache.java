package com.yescnc.core.lib.fm.cache;

import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import com.yescnc.core.entity.db.CurAlarmSearchCondVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.FmFoo;


public class FmCurAlarmCache {

	private static FmCurAlarmCache INSTANCE;
	private ConcurrentHashMap<String, FmEventVO> hmCurAlarmSeqCache;
	
	private FmCurAlarmCache() {
		
		this.hmCurAlarmSeqCache = new ConcurrentHashMap<>();
		FmDao fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		CurAlarmSearchCondVO condition = new CurAlarmSearchCondVO();
		condition.setnRowCntPerPage(-1);
		for ( FmEventVO fmEventDto : fmDao.selectAllUnclearedAlarms(condition) ) 
		{
			if ( FmFoo.IS_EXTENDED_FIELD_MODE == false &&
					    fmEventDto.getClearType() != FmConstant.FM_CLEAR_TYPE_NONE ) {
				// If ClearAlarm Exists in CurAlarmTable.
				
				continue;
			} else if ( FmFoo.IS_EXTENDED_FIELD_MODE &&
			     	    fmEventDto.getAckType() == FmConstant.ACK_TYPE_ACKED &&
					    fmEventDto.getClearType() > FmConstant.FM_CLEAR_TYPE_NONE ) {
				// If Clear + Ack Alarm Exists in CurAlarmTable.
				
				continue;
			} 
			this.hmCurAlarmSeqCache.put(fmEventDto.getAlarmKeyString(), fmEventDto);
		}
		
	}
	
	public synchronized static FmCurAlarmCache getInstance() {
		if ( INSTANCE == null )
			INSTANCE = new FmCurAlarmCache();
		return INSTANCE;
	}
	
	public synchronized void putAlarmToCache(FmEventVO fmEventDto) {
		String strKey = fmEventDto.getAlarmKeyString();
		if ( this.hmCurAlarmSeqCache.containsKey(strKey) ) {
			//LogUtil.warning("[FmUnAckClearCurAlarmSeqCache:Exception] Already Exists in Cach + " + fmEventDto);
		}
		this.hmCurAlarmSeqCache.put(strKey, fmEventDto);
	}
	
	public FmEventVO getAlarmInCache(String strAlarmKey) {
		return this.hmCurAlarmSeqCache.get(strAlarmKey);
	}
	
	public boolean isContainAlarmInCache(String strAlarmKey) {
		return this.hmCurAlarmSeqCache.containsKey(strAlarmKey);
	}
	
	public FmEventVO removeAlarmInCache(String strAlarmKey) {
		return this.hmCurAlarmSeqCache.remove(strAlarmKey);
	}

	public int getCurAlarmCacheSize() {
		return this.hmCurAlarmSeqCache.size();
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("[FmUnAckClearCurAlarmSeqCache] {\n");
		int n = 0;
		for ( Entry<String, FmEventVO> entry : this.hmCurAlarmSeqCache.entrySet() ) {
			sb.append(entry.getKey()).append(" , ").append(entry.getValue());
			if ( n % 2 == 0 )
				sb.append("\n");
			else
				sb.append("\t");
			n++;
		}
		sb.append("}");
		return sb.toString();
	}

}
