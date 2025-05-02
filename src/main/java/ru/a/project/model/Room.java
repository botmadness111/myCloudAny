package ru.a.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<File> files;

    @ManyToMany(mappedBy = "rooms")
    private List<User> users;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private User admin;

    public void addUser(User user){
        if (users == null || users.isEmpty()) users = new ArrayList<>();

        users.add(user);
    }

    public void removeUser(User user){
        if (users == null || users.isEmpty()) users = new ArrayList<>();

        users.remove(user);
    }

    public void addFile(File file){
        if (files == null || files.isEmpty()) files = new ArrayList<>();

        files.add(file);
    }

    @Override
    public String toString(){
        return name;
    }
}
