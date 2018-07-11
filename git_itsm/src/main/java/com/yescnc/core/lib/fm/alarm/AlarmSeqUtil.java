package com.yescnc.core.lib.fm.alarm;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;

public class AlarmSeqUtil
{
  private static final String FILE_NAME = System.getProperty("nms.home") + "/server/etc/data/properties/project/alarm_seq.dat";
  
  public static Long getSeq(String key)
  {
    Long alarmSequence = AlarmSequenceContainer.getInstance().get(key);
    if (alarmSequence == null)
    {
      alarmSequence = Long.valueOf(0L);
      setSeq(key, alarmSequence);
    }
    return alarmSequence;
  }
  
  public static void setSeq(String key, Long alarmSequence)
  {
    AlarmSequenceContainer.getInstance().set(key, alarmSequence);
  }
  
  public static Long getNextSeq(String key)
  {
    Long sequence = getSeq(key);
    if (sequence.longValue() == AlarmSequenceContainer.MAX.longValue()) {
      return AlarmSequenceContainer.MIN;
    }
    return Long.valueOf(sequence.longValue() + 1L);
  }
  
  public static void setNextSeq(String key)
  {
    AlarmSequenceContainer container = AlarmSequenceContainer.getInstance();
    Long sequence = container.get(key);
    if (sequence.longValue() == AlarmSequenceContainer.MAX.longValue()) {
      container.set(key, AlarmSequenceContainer.MIN);
    } else {
      container.set(key, Long.valueOf(sequence.longValue() + 1L));
    }
  }
  
  public static boolean isNextSeq(String key, Long alarmSequence)
  {
    Long sequence = AlarmSequenceContainer.getInstance().get(key);
    if ((sequence.longValue() == AlarmSequenceContainer.MAX.longValue()) && (alarmSequence.longValue() == 1L)) {
      return true;
    }
    if (sequence.longValue() + 1L == alarmSequence.longValue()) {
      return true;
    }
    return false;
  }
  
  public static void loadFromFile()
  {
    AlarmSequenceContainer container = AlarmSequenceContainer.getInstance();
    
    Properties prop = new Properties();
    BufferedInputStream in = null;
    try
    {
      in = new BufferedInputStream(new FileInputStream(FILE_NAME));
      prop.load(in);
      if (prop != null)
      {
        Iterator iterator = prop.entrySet().iterator();
        while (iterator.hasNext())
        {
          String key = iterator.next().toString();
          container.set(key, Long.valueOf((String)prop.get(key)));
        }
      }
      return;
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    finally
    {
      if (in != null) {
        try
        {
          in.close();
        }
        catch (IOException e)
        {
          e.printStackTrace();
        }
      }
    }
  }
  
  public static void saveToFile()
  {
    Properties prop = new Properties();
    Hashtable hash = (Hashtable)AlarmSequenceContainer.getInstance().getAll().clone();
    
    Iterator<Object> iterator = hash.entrySet().iterator();
    while (iterator.hasNext())
    {
      Object key = iterator.next();
      prop.put(key, hash.get(key).toString());
    }
    FileOutputStream out = null;
    try
    {
      File file = new File(FILE_NAME);
      out = new FileOutputStream(file);
      prop.store(out, ""); return;
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    finally
    {
      if (out != null) {
        try
        {
          out.close();
        }
        catch (IOException e)
        {
          e.printStackTrace();
        }
      }
    }
  }
}

/* Location:
 * Qualified Name:     com.samsung.nms.prj.fm.lte.AlarmSeqUtil
 * Java Class Version: 7 (51.0)
 * JD-Core Version:    0.7.1
 */