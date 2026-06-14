package com.storemetrics.modules.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final TokenBlacklistFilter tokenBlacklistFilter;
        private final AuthenticationProvider authenticationProvider;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthFilter,
                        TokenBlacklistFilter tokenBlacklistFilter,
                        AuthenticationProvider authenticationProvider) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.tokenBlacklistFilter = tokenBlacklistFilter;
                this.authenticationProvider = authenticationProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(org.springframework.security.config.Customizer.withDefaults())
                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/api/woocommerce/health").permitAll()
                                                // Manager/Admin endpoints require ADMIN role
                                                .requestMatchers("/api/manager/**").hasRole("ADMIN")
                                                // Centralized permissions for new modules
                                                .requestMatchers("/api/stores/**").authenticated()
                                                .requestMatchers("/api/analytics/**").authenticated()
                                                .requestMatchers("/api/reports/**").authenticated()
                                                .requestMatchers("/api/data/**").authenticated()
                                                // Allow static resources to be served
                                                .requestMatchers("/", "/index.html", "/static/**", "/assets/**",
                                                                "/*.ico", "/*.json", "/*.png")
                                                .permitAll()
                                                // All other API requests require authentication
                                                .requestMatchers("/api/**").authenticated()
                                                // Any other request (like React router paths) is permitted so
                                                // FrontendController can forward to index.html
                                                .anyRequest().permitAll())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(tokenBlacklistFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(jwtAuthFilter, TokenBlacklistFilter.class);

                return http.build();
        }
}
