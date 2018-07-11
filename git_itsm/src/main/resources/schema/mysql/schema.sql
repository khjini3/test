use `platform_core`;

create table if not exists `resource_cpu`
(
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists `resource_fileSystem`
(
	`recordTime` datetime NOT NULL,
	`mount` varchar(20) NOT NULL,
	`totalSpace` varchar(50) NOT NULL,
	`usedSpace` varchar(50) NOT NULL,
	`usableSpace` varchar(50) NOT NULL,
	`usage` varchar(5) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists `resource_memory`
(
	`recordTime` datetime NOT NULL,
	`totalMemory` varchar(50) NOT NULL,
	`usedMemory` varchar(50) NOT NULL,
	`availableMemory` varchar(50) NOT NULL,
	`memoryUsage` varchar(5) NOT NULL,
	`totalSwapMemory` varchar(50) NOT NULL,
	`usedSwapMemory` varchar(50) NOT NULL,
	`availableSwapMemory` varchar(50) NOT NULL,
	`swapUsage` varchar(5) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists `resource_network`
(
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
	`outErrors`	varchar(10) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;