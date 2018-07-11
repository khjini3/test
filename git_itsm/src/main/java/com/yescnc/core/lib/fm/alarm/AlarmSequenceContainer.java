package com.yescnc.core.lib.fm.alarm;

import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;

public class AlarmSequenceContainer {
	private static Hashtable<String, Long> m_hash;
	private static AlarmSequenceContainer m_instance;
	public static final Long INIT = Long.valueOf(0L);
	public static final Long MIN = Long.valueOf(1L);
	public static final Long MAX = Long.valueOf(4294967295L);

	public static synchronized AlarmSequenceContainer getInstance() {
		if (m_instance == null) {
			m_instance = new AlarmSequenceContainer();
		}
		return m_instance;
	}

	private AlarmSequenceContainer() {
		init();
	}

	private static void init() {
		m_hash = new Hashtable();
	}

	/* Error */
	public synchronized long get(String key) {
		if (m_hash.containsKey(key))
			return m_hash.get(key);
		else {
			m_hash.put(key, 0L);
			return 0L;
		}

	}

	/* Error */
	public synchronized Hashtable<String, Long> getAll() {
		return m_hash;
	}

	public synchronized void set(String key, Long alarmSequence) {
		m_hash.put(key, alarmSequence);
	}

	public synchronized void init(String key) {
		m_hash.put(key, INIT);
	}

	public synchronized void initAll() {
		Iterator<String> iterator = m_hash.keySet().iterator();
		while (iterator.hasNext()) {
			String key = (String) iterator.next();
			m_hash.put(key, INIT);
		}
	}

	public synchronized void remove(Object key) {
		m_hash.remove(key);
	}
}
