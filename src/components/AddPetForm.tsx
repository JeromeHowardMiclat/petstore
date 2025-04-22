import React, { useState } from 'react';
import { Pet } from '../services/petService';

interface AddPetFormProps {
    onAdd: (newPet: Omit<Pet, 'id'>) => void;
}

const AddPetForm: React.FC<AddPetFormProps> = ({ onAdd }) => {
    const [formData, setFormData] = useState<Omit<Pet, 'id'>>({
        name: '',
        species: '',
        breed: '',
        gender: '',
        image: '',
        description: '',
        price: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData); // Call the onAdd function passed from the parent
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Species:
                <input
                    type="text"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Breed:
                <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Gender:
                <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Image URL:
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                />
            </label>
            <label>
                Description:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </label>
            <button type="submit">Add Pet</button>
        </form>
    );
};

export default AddPetForm;