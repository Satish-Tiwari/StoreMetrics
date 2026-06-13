package com.storemetrics.modules.notifications.services;

import com.storemetrics.common.events.UserEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class KafkaConsumerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumerService.class);
    private final EmailService emailService;
    private final TemplateEngine templateEngine;

    private static final String PROFILE_ONBOARDING_TOPIC = "profile-onboarding-topic";
    private static final String USER_LOGIN_TOPIC = "user-login-topic";

    public KafkaConsumerService(EmailService emailService, TemplateEngine templateEngine) {
        this.emailService = emailService;
        this.templateEngine = templateEngine;
    }

    @KafkaListener(topics = {PROFILE_ONBOARDING_TOPIC, USER_LOGIN_TOPIC}, groupId = "notification-group")
    public void consumeUserEvent(UserEvent event) {
        log.info("Consumed User Event: {}", event);

        if ("USER_CREATED".equals(event.getType())) {
            sendWelcomeEmail(event);
        } else if ("USER_LOGIN".equals(event.getType())) {
            sendLoginEmail(event);
        }
    }

    private void sendWelcomeEmail(UserEvent event) {
        Context context = new Context();
        context.setVariable("firstName", event.getFirstName());
        
        String htmlContent = templateEngine.process("welcome-email", context);
        emailService.sendHtmlMail(event.getEmail(), "Welcome to StoreMetrics!", htmlContent);
    }

    private void sendLoginEmail(UserEvent event) {
        Context context = new Context();
        context.setVariable("firstName", event.getFirstName());
        
        String htmlContent = templateEngine.process("login-email", context);
        emailService.sendHtmlMail(event.getEmail(), "Login Successful", htmlContent);
    }
}
