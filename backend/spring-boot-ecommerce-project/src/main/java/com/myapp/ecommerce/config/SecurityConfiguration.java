package com.myapp.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeRequests(requests ->
                        requests
                                .requestMatchers("/api/orders/**")
                                .authenticated()
                                .anyRequest()
                                .permitAll()
                )
                // Cette ligne configure l'application en tant que serveur de ressources OAuth2.
                // Cela signifie que l'application s'attendra à ce que les requêtes entrantes aient un jeton d'accès OAuth2 valide.
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.jwt(Customizer.withDefaults()));

        // Cette ligne active la prise en charge de Cross-Origin Resource Sharing (CORS) avec les paramètres de configuration par défaut.
        // Cela permet aux requêtes provenant de différentes origines
        // (par exemple, d'autres sites Web ou applications Web) d'accéder aux ressources de l'application.
        httpSecurity.cors(Customizer.withDefaults());

        // Cette ligne définit la stratégie de négociation de contenu pour l'application.
        // Elle détermine comment le serveur décide quel format utiliser pour répondre aux requêtes (par exemple, JSON, XML).
        // Dans ce cas, il utilise une stratégie basée sur les en-têtes dans la requête.
        httpSecurity.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Cette ligne configure l'application pour renvoyer un corps de réponse non vide pour les erreurs 401 Unauthorized.
        // Ceci est souvent utilisé pour fournir des messages d'erreur plus informatifs aux clients.
        Okta.configureResourceServer401ResponseBody(httpSecurity);

        // disable csrf
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();

    }
}
