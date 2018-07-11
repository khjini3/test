package com.yescnc.project.itsm.rma.controller;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.project.itsm.rma.service.RmaService;

@RequestMapping("/rma")
@RestController
public class RmaController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(RmaController.class);
	
	@Autowired
	RmaService rmaService;
}
