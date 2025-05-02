package ru.a.project.model;

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
@Table(name = "c_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(cascade = CascadeType.REMOVE)
    @JoinTable(
        name = "user_room",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private List<Room> rooms;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Room> adminRooms;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<File> files;

    public void addRoom(Room room){
        if (rooms == null) rooms = new ArrayList<>();

        rooms.add(room);
    }

    public void removeRoom(Room room){
        if (rooms == null) rooms = new ArrayList<>();

        rooms.remove(room);
    }

    public void addAdminRoom(Room room){
        if (adminRooms == null || adminRooms.isEmpty()) adminRooms = new ArrayList<>();

        adminRooms.add(room);
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
