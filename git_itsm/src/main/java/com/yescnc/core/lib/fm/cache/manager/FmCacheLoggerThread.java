package com.yescnc.core.lib.fm.cache.manager;

import org.slf4j.Logger;

import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.cache.FmCurAlarmCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.cache.FmLocalSeqNoCache;
import com.yescnc.core.lib.fm.cache.FmMinSeqByMsIdCache;
import com.yescnc.core.util.common.LogUtil;



public class FmCacheLoggerThread extends Thread
{

	public static int CACHE_SIZE = 0;
	public static boolean IS_DEBUG_MODE = true;

	private static final String strFirstLine = "\n================================== Cache Status ==================================\n";
	private static final String strMiddleLine = "----------------------------------------------------------------------------------\n";
	private static final String strLastLine = "==================================================================================\n";

	private FmEventCache fmEventCache = FmEventCache.getInstance();
	private FmClientCache fmClientCache = FmClientCache.getInstance();
	private FmMinSeqByMsIdCache fmMinSeqByMsIdCache = FmMinSeqByMsIdCache.getInstance();
	private FmCurAlarmCache fmUnAckClearCurAlarmSeqCache = FmCurAlarmCache.getInstance();
	private Logger logger = null;

	public FmCacheLoggerThread()
	{
		this.logger = LogUtil.init("mf.fm.cache");
	}

	@Override
	public void run()
	{

		while (true)
		{

			try
			{
				CACHE_SIZE = this.fmEventCache.getTotalSize();

				if (IS_DEBUG_MODE)
				{

					try
					{

						String strEvtCache = this.fmEventCache.toString();
						String strClientCache = fmClientCache.toString();
						String strLvl1Cache = fmMinSeqByMsIdCache.toString();
						int nCurAlarmCacheSize = fmUnAckClearCurAlarmSeqCache.getCurAlarmCacheSize();
						String strCurAlarm = "CurAlarmCache Size is " + nCurAlarmCacheSize;
						if (nCurAlarmCacheSize <= 100)
							strCurAlarm = fmUnAckClearCurAlarmSeqCache.toString();

						StringBuilder sb = new StringBuilder();
						sb.append(strFirstLine).append("\t[FmEventCacheSize] ")
								.append(CACHE_SIZE).append("\n")
								.append(strMiddleLine)
								.append("\t[FmEventCache]\n")
								.append(strEvtCache).append("\n")
								.append(strMiddleLine)
								.append("\t[FmClientCache]\n")
								.append(strClientCache).append("\n")
								.append(strMiddleLine)
								.append("\t[FmLvl1Cache]\n")
								.append(strLvl1Cache).append("\n")
								.append(strMiddleLine).append("\t[MaxSeq]\n")
								.append(FmLocalSeqNoCache.getInstance().get())
								.append("\n").append(strMiddleLine)
								.append("\t[FmCurAlarmSeqCache]\n")
								.append(strCurAlarm).append("\n")
								.append(strMiddleLine).append(strLastLine);

						this.logger.debug(sb.toString());

						if (CACHE_SIZE > 100)
						{
							this.logger.debug("[FmLog] Turn Off Debug Mode (FmEventCache Size : "
											+ CACHE_SIZE + ")");
							IS_DEBUG_MODE = false;
						}

						Thread.sleep(2000);

					} catch (Exception e)
					{
						LogUtil.warning(e);
						//e.printStackTrace();
					}

				} else
				{

					String strMinSeqByMsId = fmMinSeqByMsIdCache.toString();
					String strClientCache = fmClientCache.toString();
					int nCurAlarmCacheSize = fmUnAckClearCurAlarmSeqCache.getCurAlarmCacheSize();

					StringBuilder sb = new StringBuilder();
					sb.append(strFirstLine).append("\t[FmEventCacheSize] ")
							.append(CACHE_SIZE).append("\n")
							.append(strMiddleLine).append("\t[MinSeqByMsId]\n")
							.append(strMinSeqByMsId).append("\n")
							.append(strMiddleLine)
							.append("\t[FmClientCache]\n")
							.append(strClientCache).append("\n")
							.append(strMiddleLine)
							.append("\t[nCurAlarmCacheSize]\n")
							.append(nCurAlarmCacheSize).append("\n")
							.append(strMiddleLine).append(strLastLine);

					this.logger.debug(sb.toString());

					try
					{
						Thread.sleep(2000);
					} catch (InterruptedException e)
					{
						LogUtil.warning(e);
						//e.printStackTrace();
					}

					if (CACHE_SIZE < 100)
					{
						this.logger.debug("[FmLog] Turn On Debug Mode (FmEventCache Size : "
										+ CACHE_SIZE + ")");
						IS_DEBUG_MODE = true;
					}

				}

			} catch (Exception e)
			{
				LogUtil.warning(e) ;
				//e.printStackTrace();
			}
		}

	}
}
