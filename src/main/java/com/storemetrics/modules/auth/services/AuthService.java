package com.storemetrics.modules.auth.services;

import com.storemetrics.modules.auth.dto.AuthResponse;
import com.storemetrics.modules.auth.dto.LoginRequest;
import com.storemetrics.modules.auth.dto.RegisterRequest;
import com.storemetrics.modules.auth.entities.Role;
import com.storemetrics.modules.auth.entities.User;
import com.storemetrics.common.events.UserEvent;
import com.storemetrics.modules.auth.repositories.UserRepository;
import com.storemetrics.infrastructure.broker.EventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EventPublisher eventPublisher;

    private static final String PROFILE_ONBOARDING_TOPIC = "profile-onboarding-topic";
    private static final String USER_LOGIN_TOPIC = "user-login-topic";

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EventPublisher eventPublisher
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.eventPublisher = eventPublisher;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.VIEWER);

        userRepository.save(user);

        // Send Kafka Event via Broker Interface
        UserEvent event = new UserEvent(user.getEmail(), user.getEmail().split("@")[0], "USER_CREATED");
        eventPublisher.publishUserEvent(PROFILE_ONBOARDING_TOPIC, event);

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid email or password"));

        // Send Kafka Event via Broker Interface
        UserEvent event = new UserEvent(user.getEmail(), user.getEmail().split("@")[0], "USER_LOGIN");
        eventPublisher.publishUserEvent(USER_LOGIN_TOPIC, event);

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }
}
