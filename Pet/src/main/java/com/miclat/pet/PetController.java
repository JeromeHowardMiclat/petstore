package com.miclat.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path="/miclat/pets") // Updated URI
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet) {
        Pet savedPet = petRepository.save(pet);
        return ResponseEntity.ok().body(savedPet);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Pet>> createPets(@RequestBody List<Pet> pets) {
        List<Pet> savedPets = petRepository.saveAll(pets); // Save all pets in bulk
        return ResponseEntity.ok(savedPets); // Return the list of saved pets
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Integer id, @RequestBody Pet petDetails) {
        Optional<Pet> optionalPet = petRepository.findById(id);

        if (optionalPet.isPresent()) {
            Pet pet = optionalPet.get();
            pet.setName(petDetails.getName());
            pet.setSpecies(petDetails.getSpecies());
            pet.setBreed(petDetails.getBreed());
            pet.setPrice(petDetails.getPrice());
            pet.setImage(petDetails.getImage());
            pet.setDescription(petDetails.getDescription());
            pet.setGender(petDetails.getGender());

            Pet updatedPet = petRepository.save(pet); // Save the updated pet
            return ResponseEntity.ok(updatedPet); // Return the updated pet
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if the pet is not found
        }
    }

    @GetMapping
    public @ResponseBody Iterable<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @GetMapping(path="/{id}")
    public @ResponseBody ResponseEntity<?> getPet(@PathVariable Integer id) {
        Optional<Pet> pet = petRepository.findById(id);
        if (pet.isPresent()) {
            return ResponseEntity.ok(pet.get());
        } else {
            return ResponseEntity.badRequest().body("No pet found with id: " + id);
        }
    }

    @DeleteMapping(path="/{id}")
    public @ResponseBody ResponseEntity<?> deletePet(@PathVariable Integer id) {
        Optional<Pet> pet = petRepository.findById(id);
        if (pet.isPresent()) {
            petRepository.deleteById(id);
            return ResponseEntity.ok("Pet with id " + id + " deleted.");
        } else {
            return ResponseEntity.badRequest().body("No pet found with id: " + id);
        }
    }

    @PostMapping(path="/new") // Modified URI
    public ResponseEntity<?> addNewPet (@RequestParam String name,
                                        @RequestParam String species,
                                        @RequestParam String breed,
                                        @RequestParam String gender,
                                        @RequestParam String image,
                                        @RequestParam String description,
                                        @RequestParam Double price) {

        Pet pet = new Pet(name, species, breed, gender, image, description, price);
        Pet savedPet = petRepository.save(pet);
        return ResponseEntity.ok("New pet with id " + savedPet.getId() + " added.");
    }

    @GetMapping("/search/{key}")
    public ResponseEntity<List<Pet>> searchPet(@PathVariable String key) {
        List<Pet> pet = petRepository.findByNameContainingOrSpeciesContainingOrBreedContainingOrGenderContainingOrDescriptionContaining(key, key, key, key, key);

        if (pet.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/search/price/{price}")
    public ResponseEntity<List<Pet>> filterPetByPrice(@PathVariable Double price) {
        List<Pet> pet = petRepository.findByPriceLessThanEqual(price);

        if (pet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pet);
    }

}
