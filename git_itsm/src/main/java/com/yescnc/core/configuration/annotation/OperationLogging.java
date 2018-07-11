package com.yescnc.core.configuration.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.yescnc.core.constant.CategoryKey;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface OperationLogging {
	public boolean enabled() default false;
	public String category() default CategoryKey.CATEGORY_GENERAL; 
}
