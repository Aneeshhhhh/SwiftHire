package com.example.demo.Controller;

import com.example.demo.Service.PositionServe;
import com.example.demo.model.Position;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionControl {
    private final PositionServe positionServe;

    @Autowired
    public PositionControl(PositionServe positionServe) {
        this.positionServe = positionServe;
    }

    @PostMapping
    public ResponseEntity<Position> addPosition(@RequestBody Position position) {
        Position savedPosition = positionServe.addposition(position);
        return ResponseEntity.ok(savedPosition);
    }

    @GetMapping
    public ResponseEntity<List<Position>> getPositions() {
        List<Position> positions = positionServe.getAllPositions();
        return ResponseEntity.ok(positions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Position> getPosition(@PathVariable Long id) {
        Position position = positionServe.findPosition(id);
        return ResponseEntity.ok(position);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(@PathVariable Long id, @RequestBody Position positionDetail) {
        Position updated = positionServe.updatePosition(id, positionDetail);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionServe.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
}