package com.yescnc.jarvis.db.locationManager;

import java.util.List;

import com.yescnc.jarvis.entity.db.IdcLocationManagerCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

public interface LocationManagerDao {
	public List<IdcLocationVO> selectLocationListAll();
	public boolean addLocation(IdcLocationVO location);
	public boolean updateLocation(IdcLocationVO location);
	public boolean deleteLocation(IdcLocationVO location);
	public int selectCountChildLocation(Integer loc_id);
	public List<IdcLocationManagerCodeVO> selectLocationTypeList();
	public boolean updateIdcAssetLocID(IdcLocationVO location);
}
