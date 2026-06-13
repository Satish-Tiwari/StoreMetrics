package com.storemetrics.common.events;

public class UserEvent {
    
    private String email;
    private String firstName; // we might not have a first name in RegisterRequest, but we will mock or use email
    private String type; // USER_CREATED, USER_LOGIN, USER_LOGOUT

    public UserEvent() {
    }

    public UserEvent(String email, String firstName, String type) {
        this.email = email;
        this.firstName = firstName;
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "UserEvent{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
