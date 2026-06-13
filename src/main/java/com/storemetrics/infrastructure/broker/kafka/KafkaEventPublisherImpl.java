package com.storemetrics.infrastructure.broker.kafka;

import com.storemetrics.common.events.UserEvent;
import com.storemetrics.infrastructure.broker.EventPublisher;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaEventPublisherImpl implements EventPublisher {

    private final KafkaTemplate<String, UserEvent> kafkaTemplate;

    public KafkaEventPublisherImpl(KafkaTemplate<String, UserEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishUserEvent(String topic, UserEvent event) {
        kafkaTemplate.send(topic, event);
    }
}
