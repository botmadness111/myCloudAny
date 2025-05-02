package ru.a.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.a.project.model.Room;


@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM Room r JOIN r.users u WHERE r.id = ?1 AND u.id = ?2")
    Boolean existsRoomByIdAndId(Integer roomId, Integer userId);

}