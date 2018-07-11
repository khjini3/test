use `platform_core`;



CREATE TABLE `privilege` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `privilege` (`id`,`name`) VALUES (0,'Security');
INSERT INTO `privilege` (`id`,`name`) VALUES (1,'Admin');
INSERT INTO `privilege` (`id`,`name`) VALUES (2,'Monitor');



CREATE TABLE `usergroup` (
  `groupId` int(11) NOT NULL,
  `groupName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `usergroup`
(`groupId`,`groupName`) VALUES (1,'admin');

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `privilegeId` int(11) DEFAULT NULL,
  `groupId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `userName` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createTime` varchar(100) NOT NULL,
  `loginStatus` int(11) NOT NULL,
  `lastLoginTime` varchar(100) DEFAULT NULL,
  `lastLoginIp` varchar(100) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_UNIQUE` (`userId`),
  KEY `fk_User_privilegeId_idx` (`privilegeId`),
  KEY `fk_User_groupId_idx` (`groupId`),
  CONSTRAINT `fk_User_groupId` FOREIGN KEY (`groupId`) REFERENCES `usergroup` (`groupId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_privilegeId_idx` FOREIGN KEY (`privilegeId`) REFERENCES `privilege` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `platform_core`.`user` (`id`, `userId`, `password`, `privilegeId`, `groupId`, `status`, `createTime`, `loginStatus`) VALUES ('0', 'root', 'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646', '0', '1', '1', '2017-07-12 17:20:48', '2');



CREATE TABLE `session` (
  `state` tinyint(4) NOT NULL,
  `sessionId` mediumint(9) NOT NULL,
  UNIQUE KEY `sessionId_UNIQUE` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `ip` (
  `id` int(11) NOT NULL,
  `ipAddress` varchar(100) NOT NULL,
  `allowance` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  UNIQUE KEY `ipAddress_UNIQUE` (`ipAddress`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `loginhistory` (
  `sessionId` varchar(50) NOT NULL,
  `tomcatSession` varchar(40) NOT NULL,
  `id` bigint(20) NOT NULL,
  `loginId` varchar(20) NOT NULL,
  `privilege` tinyint(4) NOT NULL,
  `loginTime` varchar(45) NOT NULL,
  `lastCheckTime` varchar(45) DEFAULT NULL,
  `logoutTime` varchar(45) DEFAULT NULL,
  `lloc` varchar(100) DEFAULT NULL,
  `failReason` varchar(50) DEFAULT NULL,
  `logoutReason` varchar(50) DEFAULT NULL,
  `tomcatIp` varchar(50) DEFAULT NULL,
  `sessionType` varchar(5) DEFAULT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `result` int(11) DEFAULT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `operationhistory` (
  `id` int(11) NOT NULL,
  `loginId` varchar(20) NOT NULL,
  `privilege` int(11) DEFAULT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `actionType` varchar(50) DEFAULT NULL,
  `command` varchar(3000) DEFAULT NULL,
  `requestTime` datetime NOT NULL,
  `responseTime` datetime NOT NULL,
  `result` int(11) DEFAULT NULL,
  `failReason` varchar(200) DEFAULT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `resource_cpu` (
  `recordTime` datetime NOT NULL,
  `user` varchar(5) NOT NULL,
  `nice` varchar(5) NOT NULL,
  `sys` varchar(5) NOT NULL,
  `idle` varchar(5) NOT NULL,
  `iowait` varchar(5) NOT NULL,
  `irq` varchar(5) NOT NULL,
  `softirq` varchar(5) NOT NULL,
  `coreUsage` varchar(500) NOT NULL,
  `usage` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `resource_filesystem` (
  `recordTime` datetime NOT NULL,
  `mount` varchar(20) NOT NULL,
  `totalSpace` varchar(50) NOT NULL,
  `usedSpace` varchar(50) NOT NULL,
  `usableSpace` varchar(50) NOT NULL,
  `usage` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `resource_memory` (
  `recordTime` datetime NOT NULL,
  `totalMemory` varchar(50) NOT NULL,
  `usedMemory` varchar(50) NOT NULL,
  `availableMemory` varchar(50) NOT NULL,
  `memoryUsage` varchar(5) NOT NULL,
  `totalSwapMemory` varchar(50) NOT NULL,
  `usedSwapMemory` varchar(50) NOT NULL,
  `availableSwapMemory` varchar(50) NOT NULL,
  `swapUsage` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `resource_network` (
  `recordTime` datetime NOT NULL,
  `name` varchar(20) NOT NULL,
  `ipv4` varchar(15) NOT NULL,
  `ipv6` varchar(30) NOT NULL,
  `bytesRecv` varchar(20) NOT NULL,
  `bytesRecvTotal` varchar(20) NOT NULL,
  `bytesSent` varchar(20) NOT NULL,
  `bytesSentTotal` varchar(20) NOT NULL,
  `packetsRecv` varchar(20) NOT NULL,
  `packetsRecvTotal` varchar(20) NOT NULL,
  `packetsSent` varchar(20) NOT NULL,
  `packetsSentTotal` varchar(20) NOT NULL,
  `inErrors` varchar(10) NOT NULL,
  `outErrors` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `menu` (
  `menuId` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `menuName` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `privilegeId` int(11) DEFAULT NULL,
  `sortOrder` tinyint(2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menuId`),
  KEY `fk_SubMenu_role_idx` (`privilegeId`),
  CONSTRAINT `fk_SubMenu_privilegeId` FOREIGN KEY (`privilegeId`) REFERENCES `privilege` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(1,-1,'Dashboard','monitor/dashboard',2,-1,null);
INSERT INTO `platform_core_sit`.`menu` (`menuId`, `parent`, `menuName`, `privilegeId`, `sortOrder`) VALUES 
('2', '-1', 'Settings', '1', '-1');
INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(3,2,'User Manager','user/userManager',0,-1,null);
INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(4,2,'IP Manager','user/ipManager',0,-1,null);
INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(5,2,'KPI','monitor/kpi',1,-1,null);
INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(6,2,'Operation History','user/operationHistory',1,-1,null);
INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(7,-1,'Report','monitor/report',1,-1,null);

INSERT INTO `menu` (`menuId`,`parent`,`menuName`,`url`,`privilegeId`,`sortOrder`,`description`) VALUES
(18,-1,'Project Manager','project/project',1,-1,null);



CREATE TABLE `customwidget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customTitle` varchar(100) NOT NULL,
  `polling` int(11) DEFAULT NULL,
  `xpos` int(3) DEFAULT NULL,
  `ypos` int(3) DEFAULT NULL,
  `width` int(3) DEFAULT NULL,
  `height` int(3) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `chartType` varchar(10) DEFAULT NULL,
  `widgetName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

INSERT INTO `customwidget` (`id`,`customTitle`,`polling`,`xpos`,`ypos`,`width`,`height`,`url`,`description`,`chartType`,`widgetName`) VALUES
(1,'WAS Info',5,1,1,2,1,'js/monitor/widget/WasInfoWidget','WAS Info','custom','WasInfo');
INSERT INTO `customwidget` (`id`,`customTitle`,`polling`,`xpos`,`ypos`,`width`,`height`,`url`,`description`,`chartType`,`widgetName`) VALUES
(2,'CPU Usage',1,1,1,2,1,'js/monitor/widget/GmCpuWidget','GM CPU Info','custom','cpuInfo');
INSERT INTO `customwidget` (`id`,`customTitle`,`polling`,`xpos`,`ypos`,`width`,`height`,`url`,`description`,`chartType`,`widgetName`) VALUES
(3,'Memory Usage',1,1,1,2,1,'js/monitor/widget/GmMemWidget','GM Mem Info','custom','memInfo');
INSERT INTO `customwidget` (`id`,`customTitle`,`polling`,`xpos`,`ypos`,`width`,`height`,`url`,`description`,`chartType`,`widgetName`) VALUES
(4,'Disk Usage',1,1,1,1,1,'js/monitor/widget/GmDiskWidget','GM Disk Info','custom','diskInfo');



CREATE TABLE `kpiwidget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kpiTitle` varchar(200) NOT NULL,
  `polling` int(11) DEFAULT NULL,
  `chartType` varchar(20) DEFAULT NULL,
  `query` varchar(2000) DEFAULT NULL,
  `threshold` int(13) DEFAULT NULL,
  `kpiKeys` varchar(1000) DEFAULT NULL,
  `kpiValues` varchar(1000) DEFAULT NULL,
  `kpiCondition` varchar(2000) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `tableName` varchar(1000) DEFAULT NULL,
  `streamUrl` varchar(500) DEFAULT '',
  `kpiColumns` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;



CREATE TABLE `panel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `panelName` varchar(100) DEFAULT NULL,
  `widgetData` json DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_panel_fk0` (`userId`),
  CONSTRAINT `idx_panel_fk0` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

insert into `panel` 
(`id`, `userId`, `panelName`, `widgetData`)
values
(1,0,'Default',
'{"id": "18", "panelName": "Default", 
  "widgetData": [{"url": "js/monitor/widget/WasInfoWidget", "chart": "custom", "title": "WAS Info", 
  "dataCol": "1", "dataRow": "1", "widgetId": "widget0", "dataSizex": "2", "dataSizey": "1"}, 
  {"url": "js/monitor/widget/GmCpuWidget", "chart": "custom", "title": "CPU Usage", "dataCol": "3", 
  "dataRow": "1", "widgetId": "widget1", "dataSizex": "2", "dataSizey": "1"}, 
  {"url": "js/monitor/widget/GmMemWidget", "chart": "custom", "title": "Memory Usage", "dataCol": "1", 
  "dataRow": "2", "widgetId": "widget2", "dataSizex": "2", "dataSizey": "1"}, 
  {"url": "js/monitor/widget/GmDiskWidget", "chart": "custom", "title": "Disk Usage", "dataCol": "3", 
  "dataRow": "2", "widgetId": "widget3", "dataSizex": "1", "dataSizey": "1"}]}'
);



CREATE TABLE `report` (
  `report_id` int(10) NOT NULL,
  `parent_id` int(10) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `report_title` varchar(20) DEFAULT NULL,
  `report_type` varchar(20) DEFAULT NULL,
  `report_sub_type` varchar(500) DEFAULT NULL,
  `level1_id` varchar(100) DEFAULT NULL,
  `level2_id` varchar(100) DEFAULT NULL,
  `level3_id` varchar(100) DEFAULT NULL,
  `level4_id` text,
  `report_view` int(1) DEFAULT NULL,
  `period_last` int(2) DEFAULT NULL,
  `period_from` datetime DEFAULT NULL,
  `period_to` datetime DEFAULT NULL,
  `scheduling` int(1) DEFAULT NULL,
  `export_type` int(1) DEFAULT NULL,
  `destination_type` int(1) DEFAULT NULL,
  `destination_name` varchar(100) DEFAULT NULL,
  `schedule_start` datetime DEFAULT NULL,
  `schedule_end` datetime DEFAULT NULL,
  `recurrence_type` int(2) DEFAULT NULL,
  `recurrence_interval` int(6) DEFAULT NULL,
  `next_run_date` datetime DEFAULT NULL,
  `last_run_date` datetime DEFAULT NULL,
  `conditions` varchar(1000) DEFAULT NULL,
  `mybatis_id` varchar(100) DEFAULT NULL,
  `ui_setting` text,
  `ui_value` varchar(100) DEFAULT NULL,
  `report_key` varchar(45) DEFAULT NULL,
  `reportdata_key` varchar(45) DEFAULT NULL,
  `cron_expression` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `reporthistory` (
  `history_id` bigint(20) NOT NULL,
  `report_id` int(10) NOT NULL,
  `report_type` varchar(80) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `run_date` datetime DEFAULT NULL,
  `reserve_int` int(4) DEFAULT NULL,
  `reserve_str` varchar(50) DEFAULT NULL,
  `email_status` int(1) DEFAULT NULL,
  `email_address` varchar(200) DEFAULT NULL,
  `report_name` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `report_id_fk` (`report_id`),
  CONSTRAINT `report_id_fk` FOREIGN KEY (`report_id`) REFERENCES `report` (`report_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `menu_tree` AS select `m1`.`menuId` AS `menuId`,`m1`.`parent` AS `parent`,`m1`.`menuName` AS `menuName`,`m1`.`url` AS `url`,`m1`.`privilegeId` AS `privilegeId`,`m1`.`sortOrder` AS `sortOrder`,`m1`.`description` AS `description`,concat_ws('/',`m3`.`menuName`,`m2`.`menuName`,`m1`.`menuName`) AS `fullName`,concat_ws('.',`m3`.`menuId`,`m2`.`menuId`,`m1`.`menuId`) AS `depth` from ((`menu` `m1` left join `menu` `m2` on((`m2`.`menuId` = `m1`.`parent`))) left join `menu` `m3` on((`m3`.`menuId` = `m2`.`parent`)));


INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '0');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '1');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '2');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '3');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '4');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '5');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '6');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '7');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '8');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '9');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '10');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '11');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '12');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '13');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '14');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '15');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '16');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '17');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '18');
INSERT INTO `platform_core`.`session` (`state`, `sessionId`) VALUES ('0', '19');

CREATE TABLE `fm_t_client` (
  `client_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_seq_with_ms_id` varchar(200) NOT NULL,
  `last_time` datetime NOT NULL,
  `client_type` int(11) NOT NULL,
  `ip_addr` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8

CREATE TABLE `fm_t_cur_alarms` (
  `seq_no` bigint(20) NOT NULL,
  `ne_type` varchar(20) NOT NULL,
  `ne_version` varchar(20) NOT NULL,
  `msg_name` varchar(100) DEFAULT '',
  `level1_id` smallint(6) NOT NULL,
  `level2_id` smallint(6) NOT NULL,
  `level3_id` int(11) NOT NULL,
  `level4_id` smallint(6) NOT NULL,
  `level5_id` smallint(6) NOT NULL,
  `level6_id` smallint(6) NOT NULL,
  `level7_id` smallint(6) NOT NULL,
  `level8_id` smallint(6) NOT NULL,
  `level9_id` smallint(6) NOT NULL,
  `level10_id` smallint(6) NOT NULL,
  `lloc` varchar(200) NOT NULL,
  `location_alias` varchar(200) NOT NULL,
  `event_type` tinyint(4) NOT NULL,
  `display_type` tinyint(4) NOT NULL,
  `alarm_time` datetime NOT NULL,
  `severity` tinyint(4) NOT NULL,
  `service_affect` tinyint(4) DEFAULT '0',
  `alarm_group` tinyint(4) NOT NULL,
  `alarm_id` varchar(10) NOT NULL,
  `probcause_int` int(11) NOT NULL,
  `probcause_str` varchar(500) NOT NULL,
  `additional_text` varchar(4000) DEFAULT '',
  `reserve_int` int(11) DEFAULT '0',
  `reserve_str` varchar(300) DEFAULT '',
  `operator_info` varchar(500) DEFAULT '',
  `gen_count` tinyint(4) DEFAULT '1',
  `clear_type` tinyint(4) DEFAULT '0',
  `ack_type` tinyint(4) DEFAULT '-1',
  `ack_user` char(20) DEFAULT '',
  `ack_time` datetime DEFAULT NULL,
  `clear_user` char(20) DEFAULT '',
  `clear_time` datetime DEFAULT NULL,
  `cleared_by_seq_no` bigint(20) DEFAULT '-1',
  `service_status` tinyint(4) DEFAULT NULL,
  `sys_type` varchar(20) DEFAULT NULL,
  `band_class` varchar(100) DEFAULT NULL,
  `ne_id` varchar(10) DEFAULT NULL,
  `alarm_position` varchar(200) DEFAULT NULL,
  `alarm_id_position` varchar(200) DEFAULT NULL,
  `ack_system` varchar(20) DEFAULT NULL,
  `clear_system` varchar(20) DEFAULT NULL,
  `tech_info` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`seq_no`),
  KEY `fm_i_cur_alarms_alarmtime` (`alarm_time`,`event_type`),
  KEY `fm_i_cur_alarms_seq_no` (`seq_no`),
  KEY `fm_i_cur_alarms_level3` (`level3_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `fm_t_daily_alarms` (
  `level1_id` smallint(6) NOT NULL,
  `level2_id` smallint(6) NOT NULL,
  `level3_id` smallint(6) NOT NULL,
  `level4_id` smallint(6) NOT NULL,
  `level5_id` smallint(6) NOT NULL,
  `level6_id` smallint(6) NOT NULL,
  `level7_id` smallint(6) NOT NULL,
  `level8_id` smallint(6) NOT NULL,
  `level9_id` smallint(6) NOT NULL,
  `level10_id` smallint(6) NOT NULL,
  `lloc` varchar(200) DEFAULT NULL,
  `alarm_time` datetime NOT NULL,
  `severity` tinyint(4) DEFAULT NULL,
  `alarm_group` tinyint(4) DEFAULT NULL,
  `alarm_id` varchar(10) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  UNIQUE KEY `fm_ui_daily_alarms` (`level1_id`,`level2_id`,`level3_id`,`level4_id`,`level5_id`,`level6_id`,`level7_id`,`level8_id`,`level9_id`,`level10_id`,`lloc`,`alarm_time`,`severity`,`alarm_group`,`alarm_id`),
  KEY `fm_i_daily_alarms_alarmtime` (`alarm_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (MONTH(alarm_time))
(PARTITION fm_p_01 VALUES IN (1) ENGINE = InnoDB,
 PARTITION fm_p_02 VALUES IN (2) ENGINE = InnoDB,
 PARTITION fm_p_03 VALUES IN (3) ENGINE = InnoDB,
 PARTITION fm_p_04 VALUES IN (4) ENGINE = InnoDB,
 PARTITION fm_p_05 VALUES IN (5) ENGINE = InnoDB,
 PARTITION fm_p_06 VALUES IN (6) ENGINE = InnoDB,
 PARTITION fm_p_07 VALUES IN (7) ENGINE = InnoDB,
 PARTITION fm_p_08 VALUES IN (8) ENGINE = InnoDB,
 PARTITION fm_p_09 VALUES IN (9) ENGINE = InnoDB,
 PARTITION fm_p_10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION fm_p_11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION fm_p_12 VALUES IN (12) ENGINE = InnoDB) */
 
 CREATE TABLE `fm_t_hist` (
  `seq_no` bigint(20) NOT NULL,
  `ne_type` varchar(20) NOT NULL,
  `ne_version` varchar(20) NOT NULL,
  `msg_name` varchar(100) DEFAULT '',
  `level1_id` smallint(6) NOT NULL,
  `level2_id` smallint(6) NOT NULL,
  `level3_id` int(11) NOT NULL,
  `level4_id` smallint(6) NOT NULL,
  `level5_id` smallint(6) NOT NULL,
  `level6_id` smallint(6) NOT NULL,
  `level7_id` smallint(6) NOT NULL,
  `level8_id` smallint(6) NOT NULL,
  `level9_id` smallint(6) NOT NULL,
  `level10_id` smallint(6) NOT NULL,
  `lloc` varchar(200) NOT NULL,
  `location_alias` varchar(200) NOT NULL,
  `event_type` tinyint(4) NOT NULL,
  `display_type` tinyint(4) NOT NULL,
  `alarm_time` datetime NOT NULL,
  `severity` tinyint(4) NOT NULL,
  `service_affect` tinyint(4) DEFAULT '0',
  `alarm_group` tinyint(4) NOT NULL,
  `alarm_id` varchar(10) NOT NULL,
  `probcause_int` int(11) NOT NULL,
  `probcause_str` varchar(500) NOT NULL,
  `additional_text` varchar(4000) DEFAULT '',
  `reserve_int` int(11) DEFAULT '0',
  `reserve_str` varchar(300) DEFAULT '',
  `operator_info` varchar(500) DEFAULT '',
  `gen_count` tinyint(4) DEFAULT '1',
  `clear_type` tinyint(4) DEFAULT '0',
  `ack_type` tinyint(4) DEFAULT '-1',
  `ack_user` char(20) DEFAULT '',
  `ack_time` datetime DEFAULT NULL,
  `clear_user` char(20) DEFAULT '',
  `clear_time` datetime DEFAULT NULL,
  `cleared_by_seq_no` bigint(20) DEFAULT '-1',
  `service_status` tinyint(4) DEFAULT NULL,
  `sys_type` varchar(20) DEFAULT NULL,
  `band_class` varchar(100) DEFAULT NULL,
  `ne_id` varchar(10) DEFAULT NULL,
  `alarm_position` varchar(200) DEFAULT NULL,
  `alarm_id_position` varchar(200) DEFAULT NULL,
  `ack_system` varchar(20) DEFAULT NULL,
  `clear_system` varchar(20) DEFAULT NULL,
  `tech_info` tinyint(4) DEFAULT NULL,
  KEY `fm_i_hist_alarmtime` (`alarm_time`,`event_type`),
  KEY `fm_i_hist_seq_no` (`seq_no`),
  KEY `fm_i_hist_level3` (`level3_id`),
  KEY `fm_i_cleared_by_seq_nr` (`cleared_by_seq_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST ( to_days(alarm_time) % 64)
(PARTITION fm_p_0 VALUES IN (0) ENGINE = InnoDB,
 PARTITION fm_p_1 VALUES IN (1) ENGINE = InnoDB,
 PARTITION fm_p_2 VALUES IN (2) ENGINE = InnoDB,
 PARTITION fm_p_3 VALUES IN (3) ENGINE = InnoDB,
 PARTITION fm_p_4 VALUES IN (4) ENGINE = InnoDB,
 PARTITION fm_p_5 VALUES IN (5) ENGINE = InnoDB,
 PARTITION fm_p_6 VALUES IN (6) ENGINE = InnoDB,
 PARTITION fm_p_7 VALUES IN (7) ENGINE = InnoDB,
 PARTITION fm_p_8 VALUES IN (8) ENGINE = InnoDB,
 PARTITION fm_p_9 VALUES IN (9) ENGINE = InnoDB,
 PARTITION fm_p_10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION fm_p_11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION fm_p_12 VALUES IN (12) ENGINE = InnoDB,
 PARTITION fm_p_13 VALUES IN (13) ENGINE = InnoDB,
 PARTITION fm_p_14 VALUES IN (14) ENGINE = InnoDB,
 PARTITION fm_p_15 VALUES IN (15) ENGINE = InnoDB,
 PARTITION fm_p_16 VALUES IN (16) ENGINE = InnoDB,
 PARTITION fm_p_17 VALUES IN (17) ENGINE = InnoDB,
 PARTITION fm_p_18 VALUES IN (18) ENGINE = InnoDB,
 PARTITION fm_p_19 VALUES IN (19) ENGINE = InnoDB,
 PARTITION fm_p_20 VALUES IN (20) ENGINE = InnoDB,
 PARTITION fm_p_21 VALUES IN (21) ENGINE = InnoDB,
 PARTITION fm_p_22 VALUES IN (22) ENGINE = InnoDB,
 PARTITION fm_p_23 VALUES IN (23) ENGINE = InnoDB,
 PARTITION fm_p_24 VALUES IN (24) ENGINE = InnoDB,
 PARTITION fm_p_25 VALUES IN (25) ENGINE = InnoDB,
 PARTITION fm_p_26 VALUES IN (26) ENGINE = InnoDB,
 PARTITION fm_p_27 VALUES IN (27) ENGINE = InnoDB,
 PARTITION fm_p_28 VALUES IN (28) ENGINE = InnoDB,
 PARTITION fm_p_29 VALUES IN (29) ENGINE = InnoDB,
 PARTITION fm_p_30 VALUES IN (30) ENGINE = InnoDB,
 PARTITION fm_p_31 VALUES IN (31) ENGINE = InnoDB,
 PARTITION fm_p_32 VALUES IN (32) ENGINE = InnoDB,
 PARTITION fm_p_33 VALUES IN (33) ENGINE = InnoDB,
 PARTITION fm_p_34 VALUES IN (34) ENGINE = InnoDB,
 PARTITION fm_p_35 VALUES IN (35) ENGINE = InnoDB,
 PARTITION fm_p_36 VALUES IN (36) ENGINE = InnoDB,
 PARTITION fm_p_37 VALUES IN (37) ENGINE = InnoDB,
 PARTITION fm_p_38 VALUES IN (38) ENGINE = InnoDB,
 PARTITION fm_p_39 VALUES IN (39) ENGINE = InnoDB,
 PARTITION fm_p_40 VALUES IN (40) ENGINE = InnoDB,
 PARTITION fm_p_41 VALUES IN (41) ENGINE = InnoDB,
 PARTITION fm_p_42 VALUES IN (42) ENGINE = InnoDB,
 PARTITION fm_p_43 VALUES IN (43) ENGINE = InnoDB,
 PARTITION fm_p_44 VALUES IN (44) ENGINE = InnoDB,
 PARTITION fm_p_45 VALUES IN (45) ENGINE = InnoDB,
 PARTITION fm_p_46 VALUES IN (46) ENGINE = InnoDB,
 PARTITION fm_p_47 VALUES IN (47) ENGINE = InnoDB,
 PARTITION fm_p_48 VALUES IN (48) ENGINE = InnoDB,
 PARTITION fm_p_49 VALUES IN (49) ENGINE = InnoDB,
 PARTITION fm_p_50 VALUES IN (50) ENGINE = InnoDB,
 PARTITION fm_p_51 VALUES IN (51) ENGINE = InnoDB,
 PARTITION fm_p_52 VALUES IN (52) ENGINE = InnoDB,
 PARTITION fm_p_53 VALUES IN (53) ENGINE = InnoDB,
 PARTITION fm_p_54 VALUES IN (54) ENGINE = InnoDB,
 PARTITION fm_p_55 VALUES IN (55) ENGINE = InnoDB,
 PARTITION fm_p_56 VALUES IN (56) ENGINE = InnoDB,
 PARTITION fm_p_57 VALUES IN (57) ENGINE = InnoDB,
 PARTITION fm_p_58 VALUES IN (58) ENGINE = InnoDB,
 PARTITION fm_p_59 VALUES IN (59) ENGINE = InnoDB,
 PARTITION fm_p_60 VALUES IN (60) ENGINE = InnoDB,
 PARTITION fm_p_61 VALUES IN (61) ENGINE = InnoDB,
 PARTITION fm_p_62 VALUES IN (62) ENGINE = InnoDB,
 PARTITION fm_p_63 VALUES IN (63) ENGINE = InnoDB) */
 
 CREATE TABLE `fm_t_hourly_alarms` (
  `level1_id` smallint(6) NOT NULL,
  `level2_id` smallint(6) NOT NULL,
  `level3_id` smallint(6) NOT NULL,
  `level4_id` smallint(6) NOT NULL,
  `level5_id` smallint(6) NOT NULL,
  `level6_id` smallint(6) NOT NULL,
  `level7_id` smallint(6) NOT NULL,
  `level8_id` smallint(6) NOT NULL,
  `level9_id` smallint(6) NOT NULL,
  `level10_id` smallint(6) NOT NULL,
  `lloc` varchar(200) DEFAULT NULL,
  `alarm_time` datetime NOT NULL,
  `severity` tinyint(4) DEFAULT NULL,
  `alarm_group` tinyint(4) DEFAULT NULL,
  `alarm_id` varchar(10) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  UNIQUE KEY `fm_ui_hourly_alarms` (`level1_id`,`level2_id`,`level3_id`,`level4_id`,`level5_id`,`level6_id`,`level7_id`,`level8_id`,`level9_id`,`level10_id`,`lloc`,`alarm_time`,`severity`,`alarm_group`,`alarm_id`),
  KEY `fm_i_hourly_alarms_alarmtime` (`alarm_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (MONTH(alarm_time))
(PARTITION fm_p_01 VALUES IN (1) ENGINE = InnoDB,
 PARTITION fm_p_02 VALUES IN (2) ENGINE = InnoDB,
 PARTITION fm_p_03 VALUES IN (3) ENGINE = InnoDB,
 PARTITION fm_p_04 VALUES IN (4) ENGINE = InnoDB,
 PARTITION fm_p_05 VALUES IN (5) ENGINE = InnoDB,
 PARTITION fm_p_06 VALUES IN (6) ENGINE = InnoDB,
 PARTITION fm_p_07 VALUES IN (7) ENGINE = InnoDB,
 PARTITION fm_p_08 VALUES IN (8) ENGINE = InnoDB,
 PARTITION fm_p_09 VALUES IN (9) ENGINE = InnoDB,
 PARTITION fm_p_10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION fm_p_11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION fm_p_12 VALUES IN (12) ENGINE = InnoDB) */
 
 CREATE TABLE `fm_t_monthly_alarms` (
  `level1_id` smallint(6) NOT NULL,
  `level2_id` smallint(6) NOT NULL,
  `level3_id` smallint(6) NOT NULL,
  `level4_id` smallint(6) NOT NULL,
  `level5_id` smallint(6) NOT NULL,
  `level6_id` smallint(6) NOT NULL,
  `level7_id` smallint(6) NOT NULL,
  `level8_id` smallint(6) NOT NULL,
  `level9_id` smallint(6) NOT NULL,
  `level10_id` smallint(6) NOT NULL,
  `lloc` varchar(200) DEFAULT NULL,
  `alarm_time` datetime NOT NULL,
  `severity` tinyint(4) DEFAULT NULL,
  `alarm_group` tinyint(4) DEFAULT NULL,
  `alarm_id` varchar(10) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  UNIQUE KEY `fm_ui_monthly_alarms` (`level1_id`,`level2_id`,`level3_id`,`level4_id`,`level5_id`,`level6_id`,`level7_id`,`level8_id`,`level9_id`,`level10_id`,`lloc`,`alarm_time`,`severity`,`alarm_group`,`alarm_id`),
  KEY `fm_i_monthly_alarms_alarmtime` (`alarm_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (MONTH(alarm_time))
(PARTITION fm_p_01 VALUES IN (1) ENGINE = InnoDB,
 PARTITION fm_p_02 VALUES IN (2) ENGINE = InnoDB,
 PARTITION fm_p_03 VALUES IN (3) ENGINE = InnoDB,
 PARTITION fm_p_04 VALUES IN (4) ENGINE = InnoDB,
 PARTITION fm_p_05 VALUES IN (5) ENGINE = InnoDB,
 PARTITION fm_p_06 VALUES IN (6) ENGINE = InnoDB,
 PARTITION fm_p_07 VALUES IN (7) ENGINE = InnoDB,
 PARTITION fm_p_08 VALUES IN (8) ENGINE = InnoDB,
 PARTITION fm_p_09 VALUES IN (9) ENGINE = InnoDB,
 PARTITION fm_p_10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION fm_p_11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION fm_p_12 VALUES IN (12) ENGINE = InnoDB) */
 
 CREATE TABLE `gm_t_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `br_mode` tinyint(4) NOT NULL,
  `period` tinyint(4) NOT NULL,
  `month` char(2) NOT NULL,
  `week` char(2) NOT NULL,
  `day` char(2) NOT NULL,
  `hour` char(2) NOT NULL,
  `min` char(2) NOT NULL,
  `command` varchar(500) NOT NULL,
  `register_time` datetime NOT NULL,
  `log_flag` tinyint(4) DEFAULT '1',
  `login_id` varchar(20) NOT NULL,
  `last_exec_time` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8