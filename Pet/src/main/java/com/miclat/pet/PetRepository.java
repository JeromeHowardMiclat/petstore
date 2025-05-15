package com.miclat.pet;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Integer>{
    List<Pet> findByNameContainingOrSpeciesContainingOrBreedContainingOrGenderContainingOrDescriptionContaining (String name, String species, String breed, String gender, String description);
    List<Pet> findByPriceLessThanEqual(double price);
}