package com.yescnc.core.lib.fm.gen;

import java.util.ArrayList;
import java.util.HashMap;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.cache.FmCurAlarmCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.cache.FmLocalSeqNoCache;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.util.FmEventId;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;

public class FmEventGenerator {

	private static FmCurAlarmCache fmCurAlarmCache = null;
	private static FmDao FM_DAO = null;
	private static FmEventGenerator INSTANCE = null;

	private static final int FM_T_CUR_ALARMS = 1;
	private static final int FM_T_HIST = 2;

	public static FmEventGenerator getInstance() {
		try {
			if (INSTANCE == null)
				INSTANCE = new FmEventGenerator();

			if (fmCurAlarmCache == null)
				fmCurAlarmCache = FmCurAlarmCache.getInstance();

			if (FM_DAO == null)
				FM_DAO = ContextWrapper.getInstance().getFmDaoFromContext();
		} catch (Exception e) {
			//LogUtil.warning(e);
		}

		return INSTANCE;
	}

	public static void generateAlarmWithBasicParam(String neType, String neVersion, int lvl1Id, int lvl2Id, int lvl3Id,
			String locationAlias, int displayType, int alarmGroup, int severity, String alarmId, int probcauseInt,
			String probcauseStr, int clearType) {

		FmEventGenerator.generateEvent(neType, neVersion, lvl1Id, lvl2Id, lvl3Id, -1, -1, -1, -1, -1, -1, -1, "",
				locationAlias, FmConstant.FM_TYPE_ALARM, displayType, FmUtil.getCurTimeOfEventTimeFmt(), severity,
				alarmGroup, alarmId, probcauseInt, probcauseStr, "", clearType, -1, "", "");

	}

	public static void generateStatusWithBasicParam(String neType, String neVersion, int lvl1Id, int lvl2Id, int lvl3Id,
			String locationAlias, int displayType, String alarmId, int probcauseInt, String probcauseStr) {

		FmEventGenerator.generateEvent(neType, neVersion, lvl1Id, lvl2Id, lvl3Id, -1, -1, -1, -1, -1, -1, -1, "",
				locationAlias, FmConstant.FM_TYPE_EVENT, displayType, FmUtil.getCurTimeOfEventTimeFmt(),
				FmConstant.FM_SEVERITY_EVENT, -1, alarmId, probcauseInt, probcauseStr, "",
				FmConstant.CLEAR_TYPE_DEFAULT, -1, "", "");

	}
	
	public static void generateStatusWithBasicParam(String neType, String neVersion, int lvl1Id, int lvl2Id, int lvl3Id,
			String locationAlias, int displayType, String alarmId, int alarmGroup, int probcauseInt, String probcauseStr) {

		FmEventGenerator.generateEvent(neType, neVersion, lvl1Id, lvl2Id, lvl3Id, -1, -1, -1, -1, -1, -1, -1, "",
				locationAlias, FmConstant.FM_TYPE_EVENT, displayType, FmUtil.getCurTimeOfEventTimeFmt(),
				FmConstant.FM_SEVERITY_EVENT, alarmGroup, alarmId, probcauseInt, probcauseStr, "",
				FmConstant.CLEAR_TYPE_DEFAULT, -1, "", "");

	}

	public static void generateEvent(String neType, String neVersion, int lvl1Id, int lvl2Id, int lvl3Id, int lvl4Id,
			int lvl5Id, int lvl6Id, int lvl7Id, int lvl8Id, int lvl9Id, int lvl10Id, String lloc, String locationAlias,
			int eventType, int displayType, String alarmTime, int severity, int alarmGroup, String alarmId,
			int probcauseInt, String probcauseStr, String additionalText, int clearType, int reserveInt,
			String reserveStr, String operatorInfo) {

		FmEventVO fmEventDto = new FmEventVO(-1, neType, neVersion, lvl1Id, lvl2Id, lvl3Id, lvl4Id, lvl5Id, lvl6Id,
				lvl7Id, lvl8Id, lvl9Id, lvl10Id, lloc, locationAlias, eventType, displayType, alarmTime, severity,
				alarmGroup, alarmId, probcauseInt, probcauseStr, additionalText, clearType, reserveInt, reserveStr,
				operatorInfo);
		FmEventGenerator.executeInsert(fmEventDto);

	}

	public static void generateEvent(FmEventVO fmEventDto) {

		try {
			LogUtil.info("[FmEventGenerator] generateEvent : start_fm_svr.FM_INIT_CDL.await() start");
			//System.out.println("[FmEventGenerator] generateEvent : start_fm_svr.FM_INIT_CDL.await() start");
			// Blocking until FM is initialized.
			//start_fm_svr.FM_INIT_CDL.await();


			System.out.println("[FmEventGenerator] FmFoo.IS_SUPPORT_EVT_PROCESS = " +  FmFoo.IS_SUPPORT_EVT_PROCESS +
			", fmEventDto.getLvl1Id() = "     + fmEventDto.getLvl1Id() +
			", FmEventCache.nLocalMsId = "    + FmEventCache.nLocalMsId );
			
			LogUtil.info("[FmEventGenerator] FmFoo.IS_SUPPORT_EVT_PROCESS = " +  FmFoo.IS_SUPPORT_EVT_PROCESS +
											", fmEventDto.getLvl1Id() = "     + fmEventDto.getLvl1Id() +
											", FmEventCache.nLocalMsId = "    + FmEventCache.nLocalMsId );
			
			// Check whether Alarm Correlation and Healing is supported or not
			// And send the local event to event process thread only.
			if (FmFoo.IS_SUPPORT_EVT_PROCESS && fmEventDto.getLvl1Id() == FmEventCache.nLocalMsId) {
				EventProcessMgr.addEvent(fmEventDto);
			} else {
				FmEventGenerator.executeInsert(fmEventDto);
			}

		} catch (Exception e) {
			LogUtil.warning(e);
		}
	}

	public static void executeInsert(FmEventVO fmEventDto) {

		try {
			LogUtil.info("[FmEventGenerator] executeInsert : getEventType() = " + fmEventDto.getEventType() + 
													", FmConstant.FM_TYPE_ALARM = " + FmConstant.FM_TYPE_ALARM );

			// Figure it out Alarm or Not
			if (fmEventDto.getEventType() == FmConstant.FM_TYPE_ALARM) {
				if (FmFoo.IS_EXTENDED_FIELD_MODE) {
					FmEventGenerator.processAlarm_InAckClearMode(fmEventDto); // For K,U
				} else {
					FmEventGenerator.processAlarm_ClearByCase(fmEventDto); // For Other Customers
				}

			} else {
				// insert status or fault events to history table
				fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet());
				FM_DAO.insertFmHist(fmEventDto);
			}

			// 2. Put to cache
			FmEventCache.getInstance().putEventToLocalCache(fmEventDto);
			logEventInfo("[FmEventGenerator][EventInsertCompleted] ", fmEventDto);
		} catch (Exception e) {
			LogUtil.warning(e);
		}
	}

	private static void processAlarm_InAckClearMode(FmEventVO fmEventDto) {

		LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : " + fmEventDto.getDebugString());

		if (fmEventDto.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR) {

			LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : FmConstant.CLEAR_TYPE_UNCLEAR == " + fmEventDto.getClearType());
			String strAlarmKey = fmEventDto.getAlarmKeyString();
			FmEventVO dtoInCache = fmCurAlarmCache.removeAlarmInCache(strAlarmKey);

			if (dtoInCache != null) {
				
				LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : (dtoInCache != null) start..");
				
				// Acknowledge + Clear this alarms
				boolean isDeleted = FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo());
				LogUtil.info(
						"[FmEventGenerator:deleteFmCurAlarmsBySeq] SeqNO:" + dtoInCache.getSeqNo() + "=" + isDeleted);
				if (dtoInCache.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
					LogUtil.info(
							"[FmEventGenerator] Decleared Alarm received. But there is UnAcked alarm exist. So Ack this alarm.");
					String strAckTime = FmUtil.getCurTimeOfEventTimeFmt();
					dtoInCache.setAckTime(strAckTime);
					dtoInCache.setAckType(FmConstant.ACK_TYPE_ACKED);
					dtoInCache.setAckUser(FmConstant.STR_EMPTY);
					dtoInCache.setAckSystem(FmConstant.SYSTEM_NAME_EMS);
					// Generate Ack Event
					FmEventGenerator.generateEmsAckEvent(dtoInCache.clone(), strAckTime);
				}
				if (dtoInCache.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR) {
					
					// ----------------------------------------------------
					// Received Declared Alarm - Abnormal case :: Declared -> (no Cleared) -> Declared
					/**
					 * DB record ----------------------- seq_no | c.seq | c.type
					 * ----------------------- 101 | 102 | 7 103 | -1 | 1
					 * -----------------------
					 * 
					 * Polling Event ----------------------- seq_no | c.seq |
					 * c.type ----------------------- 101 | -1 | 1 // Declared
					 * 102 | 101 | 7 // Correction_Cleared 103 | -1 | 1 //
					 * Declared (*) -----------------------
					 */
					// ----------------------------------------------------

					// Make already exists alarm to be clear.
					LogUtil.info(
							"[FmEventGenerator:Excepional] Decleared Alarm received. But there is Declared alarm exist already. So clear this alarms.");
					String prevAlarmTime = dtoInCache.getAlarmTime();
					long nDeclaredSeq = dtoInCache.getSeqNo(); // 101
					long nCorrectionSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 102
					fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 103

					// <---------------- Polling Object update START
					// ------------------------------------->
					// * Correction_Cleared
					// nCorrectionSeq // 102
					dtoInCache.setClearSeq(nDeclaredSeq); // 101
					dtoInCache.setClearType(FmConstant.CLEAR_TYPE_ALREADY_EXIST_DECLARED); // 7
					dtoInCache.setAlarmTime(fmEventDto.getAlarmTime()); // update
																		// alarm_time
					dtoInCache.setClearTime(fmEventDto.getAlarmTime()); // update
																		// clear_time
					dtoInCache.setClearUser(FmConstant.STR_EMPTY);
					dtoInCache.setClearSystem(FmConstant.SYSTEM_NAME_EMS);
					// <---------------- Polling Object update END
					// ------------------------------------->
					// Generate Correction Alarm for GUI and itfN.
					FmEventGenerator.generateCorrectionAlarm(nCorrectionSeq, dtoInCache.clone(), -1);

					// <---------------- DB Object update START
					// ------------------------------------------>
					// * Cleared old alarm
					dtoInCache.setSeqNo(nDeclaredSeq); // 101
					dtoInCache.setClearSeq(nCorrectionSeq); // 102
					// dtoInCache.getClearType() // 7
					dtoInCache.setAlarmTime(prevAlarmTime); // rollback
															// alarm_time (to
															// the original
															// value)
					// <---------------- DB Object update END
					// ------------------------------------------>

					// <---------------- DB/Polling Object update START
					// ---------------------------------->
					// * Declared
					// fmEventDto.getSeqNo() // 103
					// fmEventDto.getClearSeq() // -1
					// fmEventDto.getClearType() // 1
					// <---------------- DB/Polling Object update END
					// ---------------------------------->
				}

				FM_DAO.insertFmHist(dtoInCache);
				log__DBTableData(FM_T_HIST, dtoInCache);
			}

			// Just Insert Alarm to DB and Cache
			if (fmEventDto.getSeqNo() == -1) {
				
				LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : (fmEventDto.getSeqNo() == -1) start..");
				// ----------------------------------------------------
				// Received Declared Alarm - Normal case
				// : Cleared -> Declared
				/**
				 * DB record ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 101 | -1 | 1 -----------------------
				 * 
				 * Polling Event ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 101 | -1 | 1 // Declared (*)
				 * -----------------------
				 */
				// ----------------------------------------------------

				// <---------------- DB/Polling Object update START
				// ---------------------------------->
				// * Declared
				fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 101
				// fmEventDto.getClearSeq() // -1
				// fmEventDto.getClearType() // 1
				// <---------------- DB/Polling Object update END
				// ---------------------------------->
			}

			FM_DAO.insertFmCurAlarms(fmEventDto);
			log__DBTableData(FM_T_CUR_ALARMS, fmEventDto);
			fmCurAlarmCache.putAlarmToCache(fmEventDto.clone());

		} else {

			LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : FmConstant.CLEAR_TYPE_UNCLEAR != " + fmEventDto.getClearType());
			String strAlarmKey = fmEventDto.getAlarmKeyString();
			FmEventVO dtoInCache = fmCurAlarmCache.getAlarmInCache(strAlarmKey);

			if (dtoInCache != null) {

				LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : (dtoInCache != null) start ") ;
				
				if (dtoInCache.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR) {
					
					LogUtil.info("[FmEventGenerator] processAlarm_InAckClearMode : dtoInCache.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR start ") ;
					// ----------------------------------------------------
					// Received Cleared Alarm - Normal case
					// : Declared -> Cleared
					/**
					 * DB record ----------------------- seq_no | c.seq | c.type
					 * ----------------------- 101 | 102 | 2 // UNACK in
					 * fm_t_cur_alarms, ACK in fm_t_hist -----------------------
					 * 
					 * Polling Event ----------------------- seq_no | c.seq |
					 * c.type ----------------------- 101 | -1 | 1 // Declared
					 * 102 | 101 | 2 // Cleared (*) -----------------------
					 */
					// ----------------------------------------------------

					// Just update it as cleared.

					// <---------------- Polling Object update START
					// ------------------------------------->
					// * Cleared
					fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 102
					fmEventDto.setClearSeq(dtoInCache.getSeqNo()); // 101
					// fmEventDto.getClearType() // 2
					fmEventDto.setAckType(dtoInCache.getAckType()); // apply
																	// ack_type
																	// for
																	// Client's
																	// Alarm
																	// Count
					// <---------------- Polling Object update END
					// ------------------------------------->

					// <---------------- DB Object update START
					// ------------------------------------------>
					// * Cleared
					dtoInCache.setProbcauseStr(fmEventDto.getProbcauseStr());
					dtoInCache.setAdditionalText(fmEventDto.getAdditionalText());
					// --------------------------------------------------------
					// EXTENDED_FIELD START
					dtoInCache.setServiceStatus(fmEventDto.getServiceStatus());
					dtoInCache.setSysType(fmEventDto.getSysType());
					dtoInCache.setBandClass(fmEventDto.getBandClass());
					dtoInCache.setNeId(fmEventDto.getNeId());
					dtoInCache.setAlarmPosition(fmEventDto.getAlarmPosition());
					dtoInCache.setAlarmIdPosition(fmEventDto.getAlarmIdPosition());
					// EXTENDED_FIELD END
					// --------------------------------------------------------
					// dtoInCache.getSeqNo() // 101
					dtoInCache.setClearSeq(fmEventDto.getSeqNo()); // 102
					dtoInCache.setClearType(fmEventDto.getClearType()); // 2
					dtoInCache.setClearTime(fmEventDto.getAlarmTime()); // update
																		// clear_time
					dtoInCache.setClearUser(fmEventDto.getClearUser());
					dtoInCache.setClearSystem(fmEventDto.getClearSystem());
					// <---------------- DB Object update END
					// ------------------------------------------>

					if (dtoInCache.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
						// If Alarm is UnAcked.
						LogUtil.info(
								"[FmEventGenerator:Normal] Cleared Alarm received. There is Declared Alarm Exists and UnAcked. So Clear this alarm.");
						FM_DAO.updateCurAlarmBySeq(dtoInCache);
					} else {
						LogUtil.info(
								"[FmEventGenerator:Normal] Cleared Alarm received. There is Declared Alarm Exists and Acked. So Clear this alarm and move it to history table.");
						// If Alarm is Acked. It needs to be deleted from
						// fm_t_cur_table.
						fmCurAlarmCache.removeAlarmInCache(strAlarmKey);
						FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo());
						FM_DAO.insertFmHist(dtoInCache);
						log__DBTableData(FM_T_HIST, dtoInCache);
					}

				} else {
					// ----------------------------------------------------
					// Received Cleared Alarm - Abnormal case
					// : Cleared&Unack -> (no Declared) -> Cleared
					/**
					 * DB record ----------------------- seq_no | c.seq | c.type
					 * ----------------------- 101 | 102 | 2 103 | 104 | 6
					 * -----------------------
					 * 
					 * Polling Event ----------------------- seq_no | c.seq |
					 * c.type ----------------------- 101 | -1 | 1 // Declared
					 * 102 | 101 | 2 // Cleared and unAck 103 | -1 | 1 //
					 * Correction_Declared 104 | 103 | 6 // Cleared (*)
					 * -----------------------
					 */
					// ----------------------------------------------------

					// If there is already cleared alarm is exists.
					// Make cleared Alarm to be acked and delete it.
					LogUtil.info(
							"[FmEventGenerator:Excepional] Cleared Alarm received. But there is UnAcked + Cleared alarm exist. So Ack this alarm.");
					String strAckTime = FmUtil.getCurTimeOfEventTimeFmt();
					// dtoInCache.getSeqNo() // 101
					// dtoInCache.getClearSeq() // 102
					// dtoInCache.getClearType() // 2
					dtoInCache.setAckTime(strAckTime);
					dtoInCache.setAckType(FmConstant.ACK_TYPE_ACKED);
					dtoInCache.setAckUser(FmConstant.STR_EMPTY);
					dtoInCache.setAckSystem(FmConstant.SYSTEM_NAME_EMS);
					FmEventGenerator.generateEmsAckEvent(dtoInCache.clone(), strAckTime);

					// Remove from fm_t_cur_alarms table
					fmCurAlarmCache.removeAlarmInCache(strAlarmKey);
					FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo());
					// Seq No : 101 , Clear Seq: 102 , Clear Type : 2
					FM_DAO.insertFmHist(dtoInCache);
					log__DBTableData(FM_T_HIST, dtoInCache);

					// Make no declared clear alarm
					long nCorrectionSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 103
					long nClearedSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 104

					fmEventDto.setSeqNo(nCorrectionSeq); // 103
					// fmEventDto.getClearSeq() // -1
					fmEventDto.setClearType(FmConstant.CLEAR_TYPE_NO_DECLARED); // 6
					fmEventDto.setClearTime(fmEventDto.getAlarmTime()); // update
																		// clear_time
					fmEventDto.setClearUser(FmConstant.STR_EMPTY);
					fmEventDto.setClearSystem(FmConstant.SYSTEM_NAME_EMS);

					// <---------------- Polling Object update START
					// ------------------------------------->
					// * Correction_Declared
					// The severity is less than 10 in DB.
					FmEventVO correctionAlarm = fmEventDto.clone();
					correctionAlarm.setSeverity(correctionAlarm.getSeverity() - 10);
					// <---------------- Polling Object update END
					// ------------------------------------->
					// Generate Correction Alarm for +1 correction.
					// Seq No : 103 --> 103 , Clear Seq: -1 , Clear Type : 6 -->
					// 1 ( --> below function converts )
					// Seq No : 103 , Clear Seq: -1 , Clear Type : 1
					FmEventGenerator.generateCorrectionAlarm(nCorrectionSeq, correctionAlarm.clone(), 1);

					// <---------------- DB Object update START
					// ------------------------------------------>
					// * Cleared
					FmEventVO dbAlarm = correctionAlarm.clone();
					// dbAlarm.getSeqNo() // 103
					dbAlarm.setClearSeq(nClearedSeq); // 104
					// dbAlarm.getClearType() // 6
					// <---------------- DB Object update END
					// ------------------------------------------>
					fmCurAlarmCache.putAlarmToCache(dbAlarm);
					FM_DAO.insertFmCurAlarms(dbAlarm.clone());
					log__DBTableData(FM_T_CUR_ALARMS, dbAlarm);

					// <---------------- Polling Object update START
					// ------------------------------------->
					// * Cleared
					fmEventDto.setSeqNo(nClearedSeq); // 104
					fmEventDto.setClearSeq(nCorrectionSeq); // 103
					// fmEventDto.getClearType() // 6
					// <---------------- Polling Object update END
					// ------------------------------------->
				}

			} else {
				// ----------------------------------------------------
				// Received Cleared Alarm - Abnormal case
				// : Cleared&Ack -> (no Declared) -> Cleared
				/**
				 * DB record ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 103 | 104 | 6 -----------------------
				 * 
				 * Polling Event ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 103 | -1 | 1 // Correction_Declared
				 * 104 | 103 | 6 // Cleared (*) -----------------------
				 */
				// ----------------------------------------------------

				// If there is no declared alarms in cache.
				// Make no declared clear alarm
				LogUtil.info(
						"[FmEventGenerator:Excepional] Cleared Alarm received. But there is no declared alarm exist. So save this alarm in Clear status.");
				long nCorrectionSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 103
				long nClearedSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 104

				fmEventDto.setSeqNo(nCorrectionSeq); // 103
				// fmEventDto.getClearSeq() // -1
				fmEventDto.setClearType(FmConstant.CLEAR_TYPE_NO_DECLARED); // 6
				fmEventDto.setClearTime(fmEventDto.getAlarmTime()); // update
																	// clear_time
				fmEventDto.setClearUser(FmConstant.STR_EMPTY);
				fmEventDto.setClearSystem(FmConstant.SYSTEM_NAME_EMS);

				// <---------------- Polling Object update START
				// ------------------------------------->
				// * Correction_Declared
				// The severity is less than 10 in DB.
				FmEventVO correctionAlarm = fmEventDto.clone();
				correctionAlarm.setSeverity(correctionAlarm.getSeverity() - 10);
				// <---------------- Polling Object update END
				// ------------------------------------->
				// Generate Correction Alarm for +1 correction.
				// Seq No : 103 --> 103 , Clear Seq: -1 , Clear Type : 6 --> 1 (
				// --> below function converts )
				// Seq No : 103 , Clear Seq: -1 , Clear Type : 1
				FmEventGenerator.generateCorrectionAlarm(nCorrectionSeq, correctionAlarm.clone(), 1);

				// <---------------- DB Object update START
				// ------------------------------------------>
				// * Cleared
				FmEventVO dbAlarm = correctionAlarm.clone();
				// dbAlarm.getSeqNo() // 103
				dbAlarm.setClearSeq(nClearedSeq); // 104
				// dbAlarm.getClearType() // 6
				// <---------------- DB Object update END
				// ------------------------------------------>
				fmCurAlarmCache.putAlarmToCache(dbAlarm);
				FM_DAO.insertFmCurAlarms(dbAlarm.clone());
				log__DBTableData(FM_T_CUR_ALARMS, dbAlarm);

				// <---------------- Polling Object update START
				// ------------------------------------->
				// * Cleared
				fmEventDto.setSeqNo(nClearedSeq); // 104
				fmEventDto.setClearSeq(nCorrectionSeq); // 103
				// fmEventDto.getClearType() // 6
				// <---------------- Polling Object update END
				// ------------------------------------->
			}

		}

	}

	static void processAlarm_ClearByCase(FmEventVO fmEventDto) {

		if (fmEventDto.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR) {

			LogUtil.info("[FmEventGenerator] processAlarm_ClearByCase()  : start ....");
			
			// DeCleared Alarm Received ... Figure it out Declared Alarm Exists or not
			FmEventVO dtoInCache = fmCurAlarmCache.removeAlarmInCache(fmEventDto.getAlarmKeyString());

			if (dtoInCache != null) {
				
				LogUtil.info("[FmEventGenerator] processAlarm_ClearByCase()  : (dtoInCache != null) start ....");
				// ----------------------------------------------------
				// Received Declared Alarm - Abnormal case :: Declared -> (no Cleared) -> Declared
				/**
				 * DB record ----------------------- seq_no | c.seq | c.type
				 * ------------------------101 | 102 | 7 103 | -1 | 1
				 * -----------------------
				 * 
				 * Polling Event ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 101 | -1 | 1 // Declared 102 | 101 |
				 * 7 // Correction_Cleared 103 | -1 | 1 // Declared (*)
				 * -----------------------
				 */
				// ----------------------------------------------------

				long nDeclaredSeq = dtoInCache.getSeqNo(); // 101
				long nCorrectionSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 102
				fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 103

				// 2. Delete
				FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo()); // 101

				// 3. Insert
				// <---------------- DB Object update START
				// ------------------------------------------>
				// * Cleared old alarm
				// dtoInCache.getSeqNo() // 101
				dtoInCache.setClearSeq(nCorrectionSeq); // 102
				dtoInCache.setClearType(FmConstant.CLEAR_TYPE_ALREADY_EXIST_DECLARED); // 7
				dtoInCache.setClearTime(fmEventDto.getAlarmTime()); // update
																	// clear_time
				dtoInCache.setClearUser(FmConstant.STR_EMPTY);
				// <---------------- DB Object update END
				// ------------------------------------------>
				FM_DAO.insertFmHist(dtoInCache);
				log__DBTableData(FM_T_HIST, dtoInCache);

				// 4. Generate Correction Clear Alarm for GUI
				// <---------------- Polling Object update START
				// ------------------------------------->
				// * Correction_Cleared
				dtoInCache.setSeqNo(nCorrectionSeq); // 102
				dtoInCache.setClearSeq(nDeclaredSeq); // 101
				// dtoInCache.getClearType() // 7
				dtoInCache.setAlarmTime(fmEventDto.getAlarmTime()); // update
																	// alarm_time
				dtoInCache.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT); // NODISPLAY_DBNOINSERT(50)
				dtoInCache.setSeverity(dtoInCache.getSeverity() + 10); // Cleared
																		// severity
																		// in
																		// Polling
																		// Event
				// <---------------- Polling Object update END
				// ------------------------------------->
				FmEventCache.getInstance().putEventToLocalCache(dtoInCache);
				log__PollingData(dtoInCache);
				LogUtil.info(
						"[FmEventGenerator] Decleared Alarm received. But there is Declared alarm exist already. So Generate Clear Alarm => "
								+ dtoInCache);

				// <---------------- DB/Polling Object update START
				// ---------------------------------->
				// * Declared
				// fmEventDto.getSeqNo() // 103
				// fmEventDto.getClearSeq() // -1
				// fmEventDto.getClearType() // 1
				// <---------------- DB/Polling Object update END
				// ---------------------------------->

			} else {
				
				LogUtil.info("[FmEventGenerator] processAlarm_ClearByCase()  : (dtoInCache == null) start ....");
				// ----------------------------------------------------
				// Received Declared Alarm - Normal case
				// : Cleared -> Declared
				/**
				 * DB record ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 101 | -1 | 1 -----------------------
				 * 
				 * Polling Event ----------------------- seq_no | c.seq | c.type
				 * ----------------------- 101 | -1 | 1 // Declared (*)
				 * -----------------------
				 */
				// ----------------------------------------------------

				// <---------------- DB/Polling Object update START
				// ---------------------------------->
				// * Declared
				fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 101
				// fmEventDto.getClearSeq() // -1
				// fmEventDto.getClearType() // 1
				// <---------------- DB/Polling Object update END
				// ---------------------------------->
			}

			LogUtil.info("[FmEventGenerator] Decleared Alarm Inserted." + fmEventDto);
			FM_DAO.insertFmCurAlarms(fmEventDto);
			log__DBTableData(FM_T_CUR_ALARMS, fmEventDto);
			fmCurAlarmCache.putAlarmToCache(fmEventDto.clone());

		} else {

			FmEventGenerator.processClearAlarm(fmEventDto);

		}

	}

	private static void processClearAlarm(FmEventVO fmEventDto) {

		//LogUtil.info("[FmEventGenerator] processClearAlarm()  : start ....");
		
		
		LogUtil.info("########################");
		LogUtil.info(fmCurAlarmCache.toString());
		
		// if Cleared Alarm Received ...
		FmEventVO dtoInCache = fmCurAlarmCache.removeAlarmInCache(fmEventDto.getAlarmKeyString());

		if (dtoInCache == null) {
			
			//LogUtil.info("[FmEventGenerator] processClearAlarm  (dtoInCache == null) start ...") ;
			// ----------------------------------------------------
			// Received Cleared Alarm - Abnormal case
			// : Cleared -> (no Declared) -> Cleared
			/**
			 * DB record ----------------------- seq_no | c.seq | c.type
			 * ----------------------- 103 | 104 | 6 -----------------------
			 * 
			 * Polling Event ----------------------- seq_no | c.seq | c.type
			 * ----------------------- 103 | -1 | 1 // Correction_Declared 104 |
			 * 103 | 6 // Cleared (*) -----------------------
			 */
			// ----------------------------------------------------

			FmEventVO correctionEventDto = fmEventDto.clone();

			int nDeclaredSeverity = fmEventDto.getSeverity() > 10 ? fmEventDto.getSeverity() - 10
																  : fmEventDto.getSeverity();
			int nBckupSeverity = fmEventDto.getSeverity();
			long nCorrectionSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 103
			long nClearSeq = FmLocalSeqNoCache.getInstance().incrementAndGet(); // 104

			// if clear alarm just received
			// 1. Do Insert as cleared alarm
			LogUtil.info(
					"[FmEventGenerator] [1-No Declared] Clear Alarm Received. but there is no Decleared Alarm => " + fmEventDto);
			// <---------------- DB Object update START
			// ------------------------------------------>
			// * Cleared
			fmEventDto.setSeqNo(nCorrectionSeq); // 103
			fmEventDto.setClearSeq(nClearSeq); // 104
			fmEventDto.setClearType(FmConstant.CLEAR_TYPE_NO_DECLARED); // 6
			fmEventDto.setClearTime(fmEventDto.getAlarmTime()); // update
																// clear_time
			fmEventDto.setClearUser(FmConstant.STR_EMPTY);
			fmEventDto.setSeverity(nDeclaredSeverity); // Declared severity in
														// DB
			// <---------------- DB Object update END
			// ------------------------------------------>
			FM_DAO.insertFmHist(fmEventDto);
			log__DBTableData(FM_T_HIST, fmEventDto);

			// 2. Generate Correction Declared Alarm for GUI
			// <---------------- Polling Object update START
			// ------------------------------------->
			// * Correction_Declared
			correctionEventDto.setSeqNo(nCorrectionSeq); // 103
			// correctionEventDto.getClearSeq() // -1
			correctionEventDto.setClearType(FmConstant.CLEAR_TYPE_UNCLEAR); // 1
			correctionEventDto.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT); // NODISPLAY_DBNOINSERT(50)
			correctionEventDto.setSeverity(nDeclaredSeverity); // Declared
																// severity in
																// Polling Event
			// <---------------- Polling Object update START
			// ------------------------------------->
			FmEventCache.getInstance().putEventToLocalCache(correctionEventDto);
			log__PollingData(correctionEventDto);
			LogUtil.info("[FmEventGenerator] [2-No Declared] Generate Declared Fix Alarm => " + correctionEventDto);

			// for cache it should be displayed to alarm time in GUI.
			// <---------------- Polling Object update START
			// ------------------------------------->
			// * Cleared
			fmEventDto.setSeqNo(nClearSeq); // 104
			fmEventDto.setClearSeq(nCorrectionSeq); // 103
			// fmEventDto.getClearType() // 6
			fmEventDto.setSeverity(nBckupSeverity); // Cleared severity in
													// Polling Event
			// <---------------- Polling Object update START
			// ------------------------------------->

		} else {
			
			LogUtil.info("[FmEventGenerator] processClearAlarm  (else) start ...") ;
			// ----------------------------------------------------
			// Received Cleared Alarm - Normal case  : Declared -> Cleared
			/**
			 * DB record ----------------------- seq_no | c.seq | c.type
			 * ----------------------- 101 | 102 | 2 -----------------------
			 * 
			 * Polling Event ----------------------- seq_no | c.seq | c.type
			 * ----------------------- 101 | -1 | 1 // Declared 102 | 101 | 2 //
			 * Cleared (*) -----------------------
			 */
			// ----------------------------------------------------

			// <---------------- Polling Object update START
			// ------------------------------------->
			// * Cleared
			fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet()); // 102
			fmEventDto.setClearSeq(dtoInCache.getSeqNo()); // 101
			// fmEventDto.getClearType() // 2
			fmEventDto.setAckType(dtoInCache.getAckType()); // apply ack_type
															// for Client's
															// Alarm Count
			// <---------------- Polling Object update END
			// ------------------------------------->

			// 2. Delete
			FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo());

			// 3. Insert
			// <---------------- DB Object update START
			// ------------------------------------------>
			// * Cleared
			dtoInCache.setProbcauseStr(fmEventDto.getProbcauseStr());
			dtoInCache.setAdditionalText(fmEventDto.getAdditionalText());
			// dtoInCache.getSeqNo() // 101
			dtoInCache.setClearSeq(fmEventDto.getSeqNo()); // 102
			dtoInCache.setClearType(fmEventDto.getClearType()); // 2
			dtoInCache.setClearTime(fmEventDto.getAlarmTime()); // update
																// clear_time
			dtoInCache.setClearUser(fmEventDto.getClearUser());
			// <---------------- DB Object update END
			// ------------------------------------------>

			LogUtil.info("[FmEventGenerator] Cleared Alarm received. There is Declared alarm exist. So Clear it => " + dtoInCache);
			FM_DAO.insertFmHist(dtoInCache);
			log__DBTableData(FM_T_HIST, dtoInCache);
		}

	}

	public static void processManualClearAlarm(FmEventVO fmEventDto, String strClearUser, String strClearSystem, int nClearType) {
		manualClearAlarm(fmEventDto, strClearUser, strClearSystem, nClearType, false);
	}

	public static void processManualClearAlarmForced(FmEventVO fmEventDto, String strClearUser, String strClearSystem, int nClearType) {
		manualClearAlarm(fmEventDto, strClearUser, strClearSystem, nClearType, true);
	}

	private static void manualClearAlarm(FmEventVO fmEventDto, String strClearUser, String strClearSystem,int nClearType, boolean ackForced) {
		// 1. Clear alarm
		if (FmFoo.IS_EXTENDED_FIELD_MODE)
			FmEventGenerator.manualClearInAckClearMode(fmEventDto, strClearUser, strClearSystem, nClearType, ackForced);
		else
			FmEventGenerator.manualClearInClearByCaseMode(fmEventDto, strClearUser, nClearType);

		// 2. Send the ICMP and SNMP alarms to the mf.gm process
		if (FmConstant.CLEAR_TYPE_MANUAL == nClearType && "rept_protocol_status".equals(fmEventDto.getMsgName())) {
			FmUtil.sendNetworkStatusAlarmToMfgm(fmEventDto);
		}
	}

	private static void manualClearInClearByCaseMode(FmEventVO fmEventDto, String strClearUser, int nClearType) {

		String strDebugHead = "[ManualClearAlarm][" + strClearUser + "][Clear][" + fmEventDto.getSeqNo()
				+ "][FmEventGenerator] ";

		// Delete from current Alarm Cache
		fmCurAlarmCache.removeAlarmInCache(fmEventDto.getAlarmKeyString());

		// 1. Delete from fm_t_cur_alarms
		FM_DAO.deleteFmCurAlarmsBySeq(fmEventDto.getSeqNo());

		// 2. Insert into History DB
		long nClearedSeq = FmLocalSeqNoCache.getInstance().incrementAndGet();
		String strClearTime = FmUtil.getCurTimeOfEventTimeFmt();

		fmEventDto.setClearTime(strClearTime);
		fmEventDto.setClearSeq(nClearedSeq);
		fmEventDto.setClearType(nClearType);
		fmEventDto.setClearUser(strClearUser);
		FM_DAO.insertFmHist(fmEventDto);
		log__DBTableData(FM_T_HIST, fmEventDto);

		// 2. Put to cache for Tree
		fmEventDto.setSeqNo(nClearedSeq);
		fmEventDto.setSeverity(fmEventDto.getSeverity() + 10);
		fmEventDto.setAlarmTime(strClearTime);
		fmEventDto.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT);

		FmEventCache.getInstance().putEventToLocalCache(fmEventDto);
		logEventInfo(strDebugHead + "InsertCompleted. ", fmEventDto);
	}

	private static void manualClearInAckClearMode(FmEventVO fmEventDto, String strClearUser, String strClearSystem,
			int nClearType, boolean ackForced) {

		String strDebugHead = "[ManualClearAlarm][" + strClearUser + "][Clear][" + fmEventDto.getSeqNo()
				+ "][FmEventGenerator] ";
		String strAlarmKey = fmEventDto.getAlarmKeyString();
		FmEventVO dtoInCache = fmCurAlarmCache.getAlarmInCache(strAlarmKey);
		boolean validTarget = true;

		// 0. Check Target
		if (dtoInCache == null) {
			LogUtil.info(strDebugHead + "[ExceptionalCase] Does not exist in AlarmCache. fmEventDto: "
					+ fmEventDto.toString());
			validTarget = false;
		} else {
			validTarget = (fmEventDto.getSeqNo() == dtoInCache.getSeqNo());
			if (!validTarget) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] The seqNo is different. dtoInCache: "
						+ dtoInCache.toString());
			}
		}

		if (!validTarget) {
			// Handling for the abnormal case.
			FmEventVO dto = FM_DAO.selectFmCurAlarmsBySeq(fmEventDto.getSeqNo());
			if (dto == null) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] Does not exist in fm_t_cur_alarms. So ignore.");
				return;
			} else {
				dtoInCache = dto;
				LogUtil.info(strDebugHead + "[ExceptionalCase] Put alarm to AlarmCache." + dtoInCache.toString());
				fmCurAlarmCache.putAlarmToCache(dtoInCache);
			}
		}

		long nClearedSeq = FmLocalSeqNoCache.getInstance().incrementAndGet();
		String strClearTime = FmUtil.getCurTimeOfEventTimeFmt();

		// If ackForced, Update Ack Information.
		if (ackForced && dtoInCache.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
			String strAckTime = strClearTime;

			dtoInCache.setAckTime(strAckTime);
			dtoInCache.setAckType(FmConstant.ACK_TYPE_ACKED);
			dtoInCache.setAckUser(FmConstant.STR_EMPTY);
			dtoInCache.setAckSystem(FmConstant.SYSTEM_NAME_EMS);
			// Generate Ack Event
			FmEventGenerator.generateEmsAckEvent(dtoInCache.clone(), strAckTime);

			fmEventDto.setAckTime(strAckTime);
			fmEventDto.setAckType(FmConstant.ACK_TYPE_ACKED);
			fmEventDto.setAckUser(FmConstant.STR_EMPTY);
			fmEventDto.setAckSystem(FmConstant.SYSTEM_NAME_EMS);
		}

		// 1. Update Cache and Table
		if (dtoInCache.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
			// If Alarm is UnAcked.
			dtoInCache.setClearTime(strClearTime);
			dtoInCache.setClearSeq(nClearedSeq);
			dtoInCache.setClearType(nClearType);
			dtoInCache.setClearUser(strClearUser);
			dtoInCache.setClearSystem(strClearSystem);
			FM_DAO.updateCurAlarmBySeq(dtoInCache);
		} else {
			// If Alarm is Acked. It needs to be deleted from fm_t_cur_table.
			dtoInCache.setClearTime(strClearTime);
			dtoInCache.setClearSeq(nClearedSeq);
			dtoInCache.setClearType(nClearType);
			dtoInCache.setClearUser(strClearUser);
			dtoInCache.setClearSystem(strClearSystem);
			fmCurAlarmCache.removeAlarmInCache(strAlarmKey);
			FM_DAO.deleteFmCurAlarmsBySeq(dtoInCache.getSeqNo());
			FM_DAO.insertFmHist(dtoInCache);
			log__DBTableData(FM_T_HIST, dtoInCache);
		}

		// 2. Put to cache for Tree
		fmEventDto.setSeqNo(nClearedSeq);
		fmEventDto.setClearTime(strClearTime);
		fmEventDto.setClearSeq(nClearedSeq);
		fmEventDto.setClearType(nClearType);
		fmEventDto.setClearUser(strClearUser);
		fmEventDto.setClearSystem(strClearSystem);
		fmEventDto.setSeverity(fmEventDto.getSeverity() + 10);
		fmEventDto.setAlarmTime(strClearTime);
		fmEventDto.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT);

		FmEventCache.getInstance().putEventToLocalCache(fmEventDto);
		logEventInfo(strDebugHead + "InsertCompleted. ", fmEventDto);

	}

	private static void generateCorrectionAlarm(long nCorrectionSeq, FmEventVO fmEventDto, int reserveInt) {
		String strAlarmKey = fmEventDto.getAlarmKeyString();
		fmEventDto.setSeqNo(nCorrectionSeq);
		if (reserveInt == 1 && fmEventDto.getSeverity() > 10)
			fmEventDto.setSeverity(fmEventDto.getSeverity() - 10);
		else if (reserveInt == -1 && fmEventDto.getSeverity() < 10)
			fmEventDto.setSeverity(fmEventDto.getSeverity() + 10);
		fmEventDto.setReserveInt(reserveInt);
		fmEventDto.setReserveStr(strAlarmKey);
		fmEventDto.setEventType(FmConstant.FM_TYPE_ALARM);
		fmEventDto.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT);

		// -- Alarm id is not required to change for correction alarm.
		// fmEventDto.setAlarmId(FmEventId.CORRECTION_EVENT_ID);

		// In case of Correction_Declared
		if (FmConstant.CLEAR_TYPE_NO_DECLARED == fmEventDto.getClearType()) {
			fmEventDto.setClearTime(null);
			fmEventDto.setClearSeq(-1); // used by mf.oss
			fmEventDto.setClearType(FmConstant.CLEAR_TYPE_UNCLEAR); // used by
																	// Client
			fmEventDto.setClearUser(FmConstant.STR_EMPTY);
			fmEventDto.setClearSystem(FmConstant.STR_EMPTY);
		}

		FmEventCache.getInstance().putEventToLocalCache(fmEventDto);
		logEventInfo("[FmEventGenerator] Generate Correction Alarm => ", fmEventDto);

	}

	public static void changeAckType(ArrayList<FmEventVO> alAckTargetAlarms, String strAckTime, String strUserName,
			String strAckSystem, int nAckType) {

		String strAckUser = (nAckType == FmConstant.ACK_TYPE_ACKED) ? strUserName : FmConstant.STR_EMPTY;

		if (FmFoo.IS_EXTENDED_FIELD_MODE) {
			FmEventGenerator.changeAckTypeInAckClearMode(alAckTargetAlarms, strAckTime, strAckUser, strAckSystem,
					nAckType, strUserName);
		} else {
			FmEventGenerator.changeAckTypeInClearByCaseMode(alAckTargetAlarms, strAckTime, strAckUser, strAckSystem,
					nAckType, strUserName);
		}

	}

	private static void changeAckTypeInClearByCaseMode(ArrayList<FmEventVO> alAckTargetAlarms, String strAckTime,
			String strAckUser, String strAckSystem, int nAckType, String strUserName) {

		String strDebugHead = null;
		String strAckAlias = nAckType == FmConstant.ACK_TYPE_UNACKED ? "Unack" : "Ack";

		// 1. Managing Cache
		ArrayList<Long> alAckTargetAlarmSeq = new ArrayList<>();
		ArrayList<FmEventVO> alAckTarget = new ArrayList<>();
		for (FmEventVO ackTargetAlarm : alAckTargetAlarms) {

			strDebugHead = "[ChangeAckInfo][" + strUserName + "][" + strAckAlias + "][" + ackTargetAlarm.getSeqNo()
					+ "][FmEventGenerator] ";

			if (nAckType == FmConstant.ACK_TYPE_ACKED && ackTargetAlarm.getAckType() == FmConstant.ACK_TYPE_ACKED) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] This Alarm is already acked! : " + ackTargetAlarm);
				continue;
			} else if (nAckType == FmConstant.ACK_TYPE_UNACKED
					&& ackTargetAlarm.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] This Alarm is already UnAcked! : " + ackTargetAlarm);
				continue;
			}

			alAckTargetAlarmSeq.add(ackTargetAlarm.getSeqNo());
			alAckTarget.add(ackTargetAlarm);

			FmEventVO dtoInCache = fmCurAlarmCache.getAlarmInCache(ackTargetAlarm.getAlarmKeyString());
			if (dtoInCache == null) {
				continue;
			}

			dtoInCache.setAckType(nAckType);
			dtoInCache.setAckUser(strAckUser);
			dtoInCache.setAckTime(strAckTime);
		}

		// 2. Update Database
		FmEventGenerator.executeAckInfoUpdateFromCurAlarmTable(alAckTargetAlarmSeq, strAckUser, strAckSystem, nAckType);
		FmEventGenerator.executeAckInfoUpdateFromHistTable(alAckTargetAlarmSeq, strAckUser, strAckSystem, nAckType);

		// 3. Generate Ack Event to Client
		for (FmEventVO ackTargetAlarm : alAckTarget)
			FmEventGenerator.generateAckEvent(ackTargetAlarm, strAckTime, strAckUser, strAckSystem, nAckType,
					strUserName);

	}

	private static void changeAckTypeInAckClearMode(ArrayList<FmEventVO> alAckTargetAlarms, String strAckTime,
			String strAckUser, String strAckSystem, int nAckType, String strUserName) {
		boolean ackTypeChanged = true;
		String strDebugHead = null;
		String strAckAlias = nAckType == FmConstant.ACK_TYPE_UNACKED ? "Unack" : "Ack";

		for (FmEventVO ackTargetAlarm : alAckTargetAlarms) {

			strDebugHead = "[ChangeAckInfo][" + strUserName + "][" + strAckAlias + "][" + ackTargetAlarm.getSeqNo()
					+ "][FmEventGenerator] ";

			if (nAckType == FmConstant.ACK_TYPE_ACKED && ackTargetAlarm.getAckType() == FmConstant.ACK_TYPE_ACKED) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] This Alarm is already acked! : " + ackTargetAlarm);
				continue;
			} else if (nAckType == FmConstant.ACK_TYPE_UNACKED
					&& ackTargetAlarm.getAckType() == FmConstant.ACK_TYPE_UNACKED) {
				LogUtil.info(strDebugHead + "[ExceptionalCase] This Alarm is already UnAcked! : " + ackTargetAlarm);
				continue;
			}

			ackTypeChanged = true;

			// Update target alarm
			ackTargetAlarm.setAckUser(strAckUser);
			ackTargetAlarm.setAckSystem(strAckSystem);
			ackTargetAlarm.setAckType(nAckType);
			ackTargetAlarm.setAckTime(strAckTime);

			ArrayList<Long> alAckTargetAlarmSeq = new ArrayList<>();
			if (ackTargetAlarm.getClearType() == FmConstant.CLEAR_TYPE_UNCLEAR) {
				LogUtil.info(strDebugHead
						+ "Ack or UnAck executed on declared Alarm. So just update this alarm in fm_t_cur_alarms table.");
				// 1. Update Datbase
				alAckTargetAlarmSeq.add(ackTargetAlarm.getSeqNo());
				FmEventGenerator.executeAckInfoUpdateFromCurAlarmTable(alAckTargetAlarmSeq, strAckUser, strAckSystem,
						nAckType);
				// 2. Update Cache
				FmEventVO dtoInCache = fmCurAlarmCache.getAlarmInCache(ackTargetAlarm.getAlarmKeyString());
				if (dtoInCache == null) {
					LogUtil.info(strDebugHead + "[ExceptionalCase] Does not exist in AlarmCache. fmEventDto: "
							+ ackTargetAlarm.toString());

					// Handling for the abnormal case.
					FmEventVO dto = FM_DAO.selectFmCurAlarmsBySeq(ackTargetAlarm.getSeqNo());
					if (dto == null) {
						LogUtil.info(
								strDebugHead + "[ExceptionalCase] Does not exist in fm_t_cur_alarms. So ignore.");
						ackTypeChanged = false;
					} else {
						dtoInCache = dto;
						LogUtil.info(
								strDebugHead + "[ExceptionalCase] Put alarm to AlarmCache." + dtoInCache.toString());
						fmCurAlarmCache.putAlarmToCache(dtoInCache);
					}
				}

				if (dtoInCache != null) {
					dtoInCache.setAckUser(strAckUser);
					dtoInCache.setAckSystem(strAckSystem);
					dtoInCache.setAckType(nAckType);
					dtoInCache.setAckTime(strAckTime);
				}

			} else {

				if (nAckType == FmConstant.ACK_TYPE_ACKED) {
					LogUtil.info(strDebugHead
							+ "Ack executed on cleared Alarm. So move this alarm to fm_t_hist from fm_t_cur_alarms.");
					// 1. Move to fm_t_hist from fm_t_cur_alarms.
					boolean isDeleted = FM_DAO.deleteFmCurAlarmsBySeq(ackTargetAlarm.getSeqNo());
					LogUtil.info(strDebugHead + "Ack executed on cleared Alarm. Delete from fm_t_cur_alarms result : "
							+ isDeleted);
					boolean isInserted = FM_DAO.insertFmHist(ackTargetAlarm);
					LogUtil.info(strDebugHead + "Ack executed on cleared Alarm. Insert from fm_t_hist result : "
							+ isInserted);
					// 2. Clear cache.
					fmCurAlarmCache.removeAlarmInCache(ackTargetAlarm.getAlarmKeyString());
				} else {
					/*---
					 * (2015.09.11) commented by taeyoung, not supported feature.
					 * KDDI/UQ : Ack, Unack button is not invisible in Event History.
					 * 
					LogUtil.info("[FmEventGenerator] UnAck executed on cleared Alarm. So move this alarm to fm_t_cur_alarms from fm_t_hist.");
					// 1. Move back to fm_t_cur_alarms from fm_t_hist
					boolean isDeleted = FM_DAO.deleteFmHistBySeq(ackTargetAlarm.getSeqNo());
					LogUtil.info("[FmEventGenerator] Ack executed on cleared Alarm. Delete from fm_t_hist result : " + isDeleted);
					boolean isInserted = FM_DAO.insertFmCurAlarms(ackTargetAlarm);
					LogUtil.info("[FmEventGenerator] Ack executed on cleared Alarm. Insert from fm_t_cur_alarms result : " + isInserted);
					// 2. Add to cache.
					fmCurAlarmCache.putAlarmToCache(ackTargetAlarm);
					*/
					LogUtil.info(strDebugHead + "UnAck executed on cleared Alarm. It is not supported feature.");
					ackTypeChanged = false;
				}

			}

			if (ackTypeChanged) {
				// Generate Ack Event
				FmEventGenerator.generateAckEvent(ackTargetAlarm, strAckTime, strAckUser, strAckSystem, nAckType,
						strUserName);
			}
		}

	}

	private static void executeAckInfoUpdateFromCurAlarmTable(ArrayList<Long> alAckTargetAlarmSeq, String strAckUser,
			String strAckSystem, int nAckType) {

		HashMap<String, Object> queryMap = new HashMap<>();
		if (nAckType == FmConstant.ACK_TYPE_ACKED) {
			// Acknowledge is executed
			queryMap.put("ackUser", strAckUser);
			queryMap.put("ackTime", "now()");
		} else {
			// UnAcknowledge is executed
			queryMap.put("ackUser", "");
			queryMap.put("ackTime", "NULL");
		}
		queryMap.put("ackSystem", strAckSystem);
		queryMap.put("alSeqNo", alAckTargetAlarmSeq);
		queryMap.put("ackType", nAckType);
		// update fm_t_cur_alarms Table
		queryMap.put("strTableName", "fm_t_cur_alarms");
		boolean isUpdated = FM_DAO.updateAckInfo(queryMap);
		LogUtil.info("[FmEventGenerator] Ack Info Update from fm_t_cur_alarms table. Result = " + isUpdated);

	}

	private static void executeAckInfoUpdateFromHistTable(ArrayList<Long> alAckTargetAlarmSeq, String strAckUser,
			String strAckSystem, int nAckType) {

		HashMap<String, Object> queryMap = new HashMap<>();
		if (nAckType == FmConstant.ACK_TYPE_ACKED) {
			// Acknowledge is executed
			queryMap.put("ackUser", strAckUser);
			queryMap.put("ackTime", "now()");
		} else {
			// UnAcknowledge is executed
			queryMap.put("ackUser", "");
			queryMap.put("ackTime", "NULL");
		}
		queryMap.put("ackSystem", strAckSystem);
		queryMap.put("alSeqNo", alAckTargetAlarmSeq);
		queryMap.put("ackType", nAckType);
		// update fm_t_hist Table
		queryMap.put("strTableName", "fm_t_hist");
		boolean isUpdated = FM_DAO.updateAckInfo(queryMap);
		LogUtil.info("[FmEventGenerator] Ack Info Update from fm_t_hist table. Result = " + isUpdated);

	}

	private static void generateEmsAckEvent(FmEventVO fmEventDto, String strAckTime) {
		generateAckEvent(fmEventDto, // fmEventDto
				strAckTime, // strAckTime
				FmConstant.STR_EMPTY, // strAckUser
				FmConstant.SYSTEM_NAME_EMS, // strAckSystem
				FmConstant.ACK_TYPE_ACKED, // nAckType
				FmConstant.STR_EMPTY); // strUserName
	}

	private static void generateAckEvent(FmEventVO fmEventDto, String strAckTime, String strAckUser,
			String strAckSystem, int nAckType, String strUserName) {
		String strAckAlias = nAckType == FmConstant.ACK_TYPE_UNACKED ? "Unack" : "Ack";
		String strDebugHead = "[ChangeAckInfo][" + strUserName + "][" + strAckAlias + "][" + fmEventDto.getSeqNo()
				+ "][FmEventGenerator] ";

		String strAlarmKey = fmEventDto.getAlarmKeyStringWithTime();
		int nSeverity = getSeverityForAckEvent(fmEventDto);
		String strAdditionalText = getAdditionalTextForAckEvent(fmEventDto, nAckType, strUserName);

		fmEventDto.setSeqNo(FmLocalSeqNoCache.getInstance().incrementAndGet());
		fmEventDto.setClearType(FmConstant.CLEAR_TYPE_DEFAULT);
		fmEventDto.setSeverity(FmConstant.FM_SEVERITY_EVENT);
		fmEventDto.setEventType(FmConstant.FM_TYPE_EVENT);
		fmEventDto.setAckUser(strAckUser);
		fmEventDto.setAckSystem(strAckSystem);
		fmEventDto.setAckType(nAckType);
		fmEventDto.setAckTime(strAckTime);
		fmEventDto.setAlarmId(
				nAckType == FmConstant.ACK_TYPE_UNACKED ? FmEventId.UNACK_EVENT_ID : FmEventId.ACK_EVENT_ID);
		fmEventDto.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT);
		fmEventDto.setReserveStr(strAlarmKey);
		fmEventDto.setReserveInt(nSeverity);
		fmEventDto
				.setAlarmTime(nAckType == FmConstant.ACK_TYPE_UNACKED ? FmUtil.getCurTimeOfEventTimeFmt() : strAckTime);
		fmEventDto.setAdditionalText(strAdditionalText);

		FmEventCache.getInstance().putEventToLocalCache(fmEventDto);
		logEventInfo(strDebugHead + "Generating Ack Event : ", fmEventDto);
	}

	private static int getSeverityForAckEvent(FmEventVO fmEventDto) {
		int nSeverity = fmEventDto.getSeverity();
		int nClearType = fmEventDto.getClearType();
		if (nClearType > FmConstant.CLEAR_TYPE_UNCLEAR) { // Ack executed on
															// cleared Alarm.
			nSeverity += 10;
		}
		return nSeverity;
	}

	private static String getAdditionalTextForAckEvent(FmEventVO fmEventDto, int nAckType, String strUserName) {
		StringBuilder sb = new StringBuilder();
		sb.append(fmEventDto.getSeverity()).append("#").append(fmEventDto.getAlarmId()).append("#").append(nAckType)
				.append("#") // Operation of (Ack/Unack Action)
				.append(strUserName).append("#") // Operator of (Ack/Unack
													// Action)
				.append(fmEventDto.getAlarmTime()).append("#").append(fmEventDto.getSeqNo()).append("#")
				.append(fmEventDto.getAdditionalText());
		return sb.toString();
	}

	private static void logEventInfo(String strDebugHead, FmEventVO fmEventDto) {
		LogUtil.info(strDebugHead + fmEventDto.toString() + "\n" + fmEventDto.getDebugString());
		log__PollingData(fmEventDto);
	}

	private static void log__PollingData(FmEventVO fmEventDto) {
		boolean logEnabled = false;

		if (fmEventDto.getEventType() == FmConstant.FM_TYPE_ALARM) {
			logEnabled = true;
		} else if (fmEventDto.getEventType() == FmConstant.FM_TYPE_EVENT
				&& (FmEventId.ACK_EVENT_ID.equals(fmEventDto.getAlarmId())
						|| FmEventId.UNACK_EVENT_ID.equals(fmEventDto.getAlarmId()))) {
			logEnabled = true;
		}

		if (logEnabled) {
			//log__AlarmData("[FmEventGenerator][ALARM:POLLING] ", fmEventDto);
		}
	}

	private static void log__DBTableData(int table, FmEventVO fmEventDto) {
		if (fmEventDto.getEventType() != FmConstant.FM_TYPE_ALARM) {
			return;
		}

		if (table == FM_T_CUR_ALARMS) {
			log__AlarmData("[FmEventGenerator][ALARM:DB-CURR] ", fmEventDto);
		} else {
			log__AlarmData("[FmEventGenerator][ALARM:DB-HIST] ", fmEventDto);
		}
	}

	private static void log__AlarmData(String strDebugHead, FmEventVO fmEventDto) {
		StringBuilder sb = new StringBuilder();
		sb.append("level3_id:").append(fmEventDto.getLvl3Id()).append(", seq_no:").append(fmEventDto.getSeqNo())
				.append(", display_type:").append(fmEventDto.getDisplayType()).append(", alarm_time:")
				.append(fmEventDto.getAlarmTime()).append(", alarm_id:").append(fmEventDto.getAlarmId())
				.append(", severity:").append(fmEventDto.getSeverity()).append(", ack_type:")
				.append(fmEventDto.getAckType()).append(", cleared_by_seq_no:").append(fmEventDto.getClearSeq())
				.append(", clear_type:").append(fmEventDto.getClearType()).append(", clear_time:")
				.append(fmEventDto.getClearTime());

		LogUtil.info(strDebugHead + sb.toString());
	}
}
