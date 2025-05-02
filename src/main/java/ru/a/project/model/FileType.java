package ru.a.project.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "file_type")
@NoArgsConstructor
public class FileType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @OneToMany(mappedBy = "fileType", cascade = CascadeType.ALL)
    private List<File> files;

    public void addFile(File file){
        if (files == null || files.isEmpty()) files = new ArrayList<>();

        files.add(file);
    }

    @Override
    public String toString(){
        return name;
    }
}
