package ru.a.project.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ru.a.project.model.User;

import java.util.Collection;

@Data
public class UserDetailsImpl implements UserDetails {

    private String email;
    private String username;
    private Integer id;
    private String password;
    public UserDetailsImpl(User user) {
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.id = user.getId();
        this.password = user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
