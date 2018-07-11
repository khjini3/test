package com.yescnc.project.itsm.defect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.project.itsm.db.defect.DefectDao;

@Service
public class DefectServiceImpl implements DefectService {
	
	@Autowired
	DefectDao defectDao;

}