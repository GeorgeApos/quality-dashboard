package gr.uom.strategicplanning.config;

import gr.uom.strategicplanning.services.JpaUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    JpaUserDetailsService jpaUserDetailsService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors().configurationSource(corsConfigurationSource()).and()
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeRequests(auth -> auth
                        .mvcMatchers("/api","/api-ui","/swagger-ui/**","/api/swagger-config/**","/user/token/refresh/**", "/user/register").permitAll()
                        .mvcMatchers(HttpMethod.POST,"/superuser**").hasAnyAuthority("SUPER_USER")
                        .mvcMatchers(HttpMethod.GET,"/superuser/**").hasAnyAuthority("SUPER_USER")
                        .mvcMatchers(HttpMethod.PUT,"/superuser/**").hasAnyAuthority("SUPER_USER")
                        .mvcMatchers(HttpMethod.DELETE,"/superuser/**").hasAnyAuthority("SUPER_USER")
                        .mvcMatchers(HttpMethod.GET,"/user/**").hasAnyAuthority("PRIVILEGED","SUPER_USER")
                        .mvcMatchers(HttpMethod.POST,"/admin/**").hasAnyAuthority("PRIVILEGED")
                        .mvcMatchers(HttpMethod.GET,"/admin/**").hasAnyAuthority("PRIVILEGED")
                        .mvcMatchers(HttpMethod.PUT,"/admin/**").hasAnyAuthority("PRIVILEGED")
                        .mvcMatchers(HttpMethod.DELETE,"/admin/**").hasAnyAuthority("PRIVILEGED")
                        .anyRequest().authenticated())
                .userDetailsService(jpaUserDetailsService)
                .addFilter(new CustomAuthenticationFilter(authenticationManager(http.getSharedObject(AuthenticationConfiguration.class))))
                .addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}