package com.storemetrics.infrastructure.broker;

import com.storemetrics.common.events.UserEvent;

public interface EventPublisher {
    void publishUserEvent(String topic, UserEvent event);
}
