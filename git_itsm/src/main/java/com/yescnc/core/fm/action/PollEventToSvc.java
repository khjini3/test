package com.yescnc.core.fm.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.AbstPollEvent;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.service.FmDbService;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;


@Component
public class PollEventToSvc extends AbstPollEvent {

	@Autowired
	@Qualifier("fmDaoImpl")
	private FmDao fmDao;
	
	@Override
	protected FmClientVO getLoginedFmClientDto(Map<String, Object> message) throws Exception {
		Map body = message;
		int nClientType = (int) body.get(MsgKey.DAEMON_ID);
		return FmClientCache.getInstance().getClientDtoByClientType(nClientType);
	}

	@Override
	protected FmClientVO processClientLogin(Map<String, Object> message) throws Exception {
		return FmDbService.processSvcClientLogin(message);
	}
	
	@Override
	protected int getPollingResponseMaxSize()
	{
		return FmFoo.DEAMON_POLL_EVENT_RESPONSE_MAX_SIZE;
	}
	/**
	 * Location alias needs to be changed for mf.svc flow for ems alarm only.
	 * This is only for domestic customers. It is not required for other flow
	 * such as client polling and ms polling, mf.oss polling. so only overwrite
	 * in mf.svc flow.
	 * 
	 * 
	 * mf.svc will add loc with prefix
	 * 
	 * Current : LOC = LSM/LSM To be changed : LOC = LSM/LSM/SIT_410/eNB_10052
	 * 
	 * Reason: location is going as N/A. so it is not updated. This is done
	 * special way in lsm450. So same needs to be maintained. so temp fix is
	 * added here.
	 * 
	 * LOC format : <mf.svc prefix>/Location_alias
	 * Location_alias = l2 location alias/level3 location alias 

	 *  in case of level3 is -1, then location alias is /EMS 
	 *  
	 *  
	 * Location_alias possible values are if level 3 is -1, then it should be
	 * empty "" if level 3 is valid value, then it should be "/level2 ems
	 * alias/level3 ems alias
	 * 
	 * @param alMsPollingResult
	 */

	@Override
	protected ArrayList<FmEventVO> updateLocationAliasForEMSAlarms(ArrayList<FmEventVO> alMsPollingResult)
	{

		ArrayList<FmEventVO> clonedList = new ArrayList<FmEventVO>();
		HashMap<String, String> hmCache = new HashMap<String, String>();
		HashMap<Integer, String> hmL1Cache = new HashMap<Integer, String>();
		HashMap<String, String> hmL123Cache = new HashMap<String, String>();
		for (FmEventVO temp : alMsPollingResult)
		{
			FmEventVO fmEventDto = temp.clone();
			clonedList.add( fmEventDto);
			// only for nms alarms
			if ("nms".equalsIgnoreCase(fmEventDto.getNeType()))
			{
				String strAlias = FmConstant.STR_NA;
				String lloc = fmEventDto.getLloc();
				String strKey = fmEventDto.getLvl1Id() + "," + fmEventDto.getLvl2Id() + "," + fmEventDto.getLvl3Id()
						+ fmEventDto.getLvl4Id() + "," + fmEventDto.getLvl5Id()
						+ "," + fmEventDto.getLvl6Id() + ","
						+ lloc;

				if (hmCache.containsKey(strKey))
				{
					strAlias = hmCache.get(strKey);

				} else
				{
					/**
					 * level 1 id id may be -1 or some value. In case of level3_id =-1, then return /EMS
					 */
					if (fmEventDto.getLvl3Id() == -1)
					{
						strAlias = "/EMS";
					} else
					{
						
						String str123Key = fmEventDto.getLvl1Id() + "," + fmEventDto.getLvl2Id() + "," + fmEventDto.getLvl3Id();
						String strLvl1To3 = FmConstant.STR_EMPTY;
						/**
						 * Format: /l1/l2/l3
						 * Ex: /MS_117/OAM_2/eNB_142125_ADV
						 */
						if(!hmL123Cache.containsKey(str123Key))
						{
						
							strLvl1To3 = getLevel123Alias(fmEventDto);
							hmL123Cache.put(strLvl1To3, strLvl1To3);
						
						}
						else
						{
							strLvl1To3 = hmL123Cache.get(strLvl1To3);
						}
						/**
						 * Format: /l1
						 * Ex: /MS_117
						 */

						String strLvl1 = FmConstant.STR_EMPTY;
						
						if( !hmL1Cache.containsKey(fmEventDto.getLvl1Id()))
						{
						
							strLvl1 = getLevel1Alias(fmEventDto);
							
							hmL1Cache.put(fmEventDto.getLvl1Id(), strLvl1);
						
						}
						else
						{
							strLvl1 = hmL1Cache.get(fmEventDto.getLvl1Id());
						}

						/**
						 * Format: /l2/l3
						 * 
						 *  Ex: /OAM_2/eNB_142125_ADV
						 */
						
						strAlias = strLvl1To3.replace(strLvl1, FmConstant.STR_EMPTY );
						
					}
					hmCache.put(strKey, strAlias);

				}
				fmEventDto.setLocationAlias(strAlias);

			}
		}
		return clonedList;
	}

	private String getLevel123Alias(FmEventVO fmEventDto)
	{

		String strLvl1To3 = fmDao.getLevel123Alias(fmEventDto.getLvl1Id(), fmEventDto.getLvl2Id(), fmEventDto.getLvl3Id()) ;
		if (strLvl1To3 == null)
		{
			LogUtil.info("getLevel123Alias() is null :: level1 =" +  fmEventDto.getLvl1Id() +
														",level2=" + fmEventDto.getLvl2Id() + 
														",level3=" + fmEventDto.getLvl3Id() );			
		}
		return strLvl1To3;
	}

	private String getLevel1Alias(FmEventVO fmEventDto)
	{
		String strLvl1 = fmDao.getLevel1Alias(fmEventDto.getLvl1Id()) ;
		if (strLvl1 == null)
		{
			LogUtil.info("getLevel123Alias() is null :: level1 =" +  fmEventDto.getLvl1Id() ) ;	
		}
		return strLvl1;
	}
}
