package com.storemetrics.modules.woocommerce.services;

import com.storemetrics.config.WooCommerceConfig;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class WooCommerceClient {

    private final RestTemplate restTemplate;
    private final WooCommerceConfig config;

    public WooCommerceClient(RestTemplateBuilder builder, WooCommerceConfig config) {
        this.config = config;
        this.restTemplate = builder
                .basicAuthentication(config.getConsumerKey(), config.getConsumerSecret())
                .setConnectTimeout(java.time.Duration.ofSeconds(5))
                .setReadTimeout(java.time.Duration.ofSeconds(10))
                .build();
    }

    /**
     * Fetches a paginated list of resources from WooCommerce.
     * 
     * @param endpoint The API endpoint (e.g., WooCommerceEndpoints.PRODUCTS)
     * @param modifiedAfter ISO-8601 date string to fetch only recently updated items
     * @param page The page number
     * @param perPage Number of items per page (max 100)
     * @param fields Comma-separated fields to return (e.g. "id" for lightweight fetch)
     * @return List of generic maps representing the JSON array
     */
    public List<Map<String, Object>> fetchResources(String endpoint, String modifiedAfter, int page, int perPage, String fields) {
        String baseUrl = config.getSiteUrl() + endpoint;

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("page", page)
                .queryParam("per_page", perPage);

        if (modifiedAfter != null && !modifiedAfter.isEmpty()) {
            uriBuilder.queryParam("modified_after", modifiedAfter);
        }
        
        if (fields != null && !fields.isEmpty()) {
            uriBuilder.queryParam("_fields", fields);
        }

        String url = uriBuilder.toUriString();

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        return response.getBody();
    }

    /**
     * Pings a specific WooCommerce endpoint to check its health.
     * Fetches only 1 item to minimize payload.
     */
    public boolean pingEndpoint(String endpoint) {
        try {
            String baseUrl = config.getSiteUrl() + endpoint;
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("per_page", 1);
                    
            ResponseEntity<String> response = restTemplate.exchange(
                    uriBuilder.toUriString(),
                    HttpMethod.GET,
                    null,
                    String.class
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Pings the main site URL (without API prefix).
     */
    public boolean pingMainSite() {
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    config.getSiteUrl(),
                    HttpMethod.HEAD,
                    null,
                    String.class
            );
            return response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is3xxRedirection();
        } catch (Exception e) {
            // Fallback to GET if HEAD is rejected
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                        config.getSiteUrl(),
                        HttpMethod.GET,
                        null,
                        String.class
                );
                return response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is3xxRedirection();
            } catch (Exception ex) {
                return false;
            }
        }
    }

    public String getSiteUrl() {
        return config.getSiteUrl();
    }
}
