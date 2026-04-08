
package com.example.demo.Service;
import com.example.demo.model.Position;
import com.example.demo.Repository.PositionRepo;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class PositionServe {
    private final PositionRepo positionRepo;
    @Autowired
    public PositionServe(PositionRepo positionRepo){
        this.positionRepo = positionRepo;
    }
    public Position addposition(Position position){
        return positionRepo.save(position);
    }

    public List<Position> getAllPositions(){
        return positionRepo.findAll();
    }

    public Position findPosition(Long id){
        return positionRepo.findById(id).get();
    }

    public void deletePosition(Long id){
        positionRepo.deleteById(id);
    }

    public Position updatePosition(Long id, Position positionDetail){
        Position position = positionRepo.findById(id).get();
        position.setTitle(positionDetail.getTitle());
        position.setDepartment(positionDetail.getDepartment());
        position.setCompensation(positionDetail.getCompensation());

        return positionRepo.save(position);
    }   
}
