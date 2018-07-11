package com.yescnc.core.util.email;

import java.util.HashMap;
import java.util.Properties;

import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SmtpMailSender {
	
/*	
    @Autowired
    private JavaMailSender javaMailSender;

    public void send(String to, String subject, String body) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;

        helper = new MimeMessageHelper(message, true); // true indicates
        // multipart message
        helper.setSubject(subject);
        helper.setTo(to);
        helper.setText(body, true); // true indicates html
        // continue using helper object for more functionalities like adding attachments, etc.

        javaMailSender.send(message);


    }
*/
	
	public int sendMail(HashMap<String, ?> map){
		int result =0;
		
		try {
			JavaMailSenderImpl sender = new JavaMailSenderImpl();
			sender.setHost("wsmtp.ecounterp.com");
			sender.setPort(587);
			sender.setUsername("webmaster@yescnc.co.kr");
			sender.setPassword("yes112233");
			
			Properties prop = new Properties();
			prop.setProperty("mail.smtp.auth", "true");
			prop.setProperty("mail.smtp.debug", "true");
			sender.setJavaMailProperties(prop);
			
			MimeMessage message = sender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message);
			
			helper.setSubject("[Title]");
			helper.setFrom("webmaster@yescnc.co.kr");
			helper.setTo("khjini3@yescnc.co.kr");
			helper.setTo("khjini3@yescnc.co.kr");
			
			String htmlContent = "<strong>안녕하세요</strong>, 반갑습니다.";
			message.setText(htmlContent, "utf-8", "html");
			sender.send(message);

		} catch (Exception e) {
			// TODO: handle exception
		}
		return result;
	}
}
