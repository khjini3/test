package com.yescnc.core.lib.fm.cache;

import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.util.common.LogUtil;

public class FmLocalSeqNoCache
{

	private static FmLocalSeqNoCache INSTANCE;
	private FmDao fmDao;
	private volatile long counter = 0;

	private FmLocalSeqNoCache()
	{

		this.fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		this.counter = getMaxSeqNo();
		LogUtil.warning("[Initialized Max Sequence : " + this.counter + "]");

	}

	private long getMaxSeqNo()
	{
		long maxSeqNo = 0;
		LogUtil.warning("[FmLocalSeqNoCache] select max seq_no from new table.");
		maxSeqNo = fmDao.selectMaxSeqNo();
		return maxSeqNo;
	}

	public synchronized static FmLocalSeqNoCache getInstance()
	{
		if (INSTANCE == null)
			INSTANCE = new FmLocalSeqNoCache();
		return INSTANCE;
	}

	public synchronized long incrementAndGet()
	{

		if (this.counter == Long.MAX_VALUE)
			this.counter = 0;
		else
			this.counter += 1;
		return this.counter;

	}

	public synchronized long getNextSeq()
	{

		if (this.counter == Long.MAX_VALUE)
			return 0;
		else
			return this.counter + 1;

	}

	public synchronized long get()
	{
		return this.counter;
	}

}
