package com.yescnc.core.lib.fm.context;

import org.springframework.context.ApplicationContext;

import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.dao.FmDaoImpl;


public class ContextWrapper {

	private static ContextWrapper INSTANCE;
	//@Autowired
	//@Qualifier("fmDaoImpl")
	private FmDao fmDao;
	public static ApplicationContext context = null;
	
	private ContextWrapper() {

		this.fmDao = (FmDaoImpl) this.context.getBean("fmDaoImpl");

	}
	
	public synchronized static ContextWrapper getInstance() {
		if (INSTANCE == null)
			INSTANCE = new ContextWrapper();
		return INSTANCE;
	}

	public FmDao getFmDaoFromContext() {
		return this.fmDao;
	}

	public void loadDebugContext() {

	}

	@Override
	protected void finalize() throws Throwable {
		//this.context.close();
		super.finalize();
	}

}
