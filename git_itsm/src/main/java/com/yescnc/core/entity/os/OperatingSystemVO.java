package com.yescnc.core.entity.os;

import java.time.LocalDate;

import lombok.Data;

@Data
public class OperatingSystemVO {

	private String menufacturer;
	private String model;
	private String serialNumber;

	private String firmwareVersion;
	private String firmwareName;
	private LocalDate firmwareReleaseDate;
}
