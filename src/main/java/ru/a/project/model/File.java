package ru.a.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Data
@Entity
@Table(name = "file")
@NoArgsConstructor
@AllArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private Integer downloads;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private Room room;

    private String description;

    @Column(name = "size_kb")
    private Integer sizeKb;

    @ManyToOne()
    @JoinColumn(name = "file_type_id", referencedColumnName = "id")
    private FileType fileType;

    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Override
    public String toString(){
        return name;
    }
}
