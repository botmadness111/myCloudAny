package ru.a.project.util;

import lombok.Getter;
import org.springframework.core.io.ByteArrayResource;

public class ByteArrayResourceWithFilename extends ByteArrayResource {
    @Getter
    private final String filename;
    private final byte[] byteArray;

    private ByteArrayResourceWithFilename(byte[] byteArray, String filename) {
        super(byteArray);
        this.filename = filename;
        this.byteArray = byteArray;
    }

    public static ByteArrayResourceWithFilename create(byte[] byteArray, String filename) {
        return new ByteArrayResourceWithFilename(byteArray, filename);
    }
}
