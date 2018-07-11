package com.yescnc.core.entity.enums.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {

	SECURITY("SECURITY", 0 ),
	ADMIN("ADMIN", 1),
	USER("USER", 2);
	
	private String auth;
	private int level;
	
	public String authority(){
		return "ROLE_"+this.auth;
	}
	
	public static void main(String[] args){
		System.out.println(Role.ADMIN.authority());
	}
}
