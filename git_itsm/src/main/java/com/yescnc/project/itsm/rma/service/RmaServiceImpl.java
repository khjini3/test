package com.yescnc.project.itsm.rma.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.project.itsm.db.rma.RmaDao;

@Service
public class RmaServiceImpl implements RmaService {
	
	@Autowired
	RmaDao rmaDao;

}