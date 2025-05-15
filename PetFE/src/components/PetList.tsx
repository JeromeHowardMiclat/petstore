import React, { useEffect, useState } from 'react';
import { getAllPets, updatePet, deletePet, createPet, Pet } from '../services/petService';
import AddPetForm from './AddPetForm';

const PetList: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [filteredPets, setFilteredPets] = useState<Pet[]>([]); // State for filtered pets
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [priceFilter, setPriceFilter] = useState<number | null>(null); // State for price filter
    const [editingPetId, setEditingPetId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Omit<Pet, 'id'> | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            const data = await getAllPets();
            setPets(data);
            setFilteredPets(data); // Initialize filtered pets with all pets
        };

        fetchPets();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterPets(query, priceFilter);
    };

    const handlePriceFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = e.target.value ? parseFloat(e.target.value) : null;
        setPriceFilter(price);
        filterPets(searchQuery, price);
    };

    const filterPets = (query: string, price: number | null) => {
        setFilteredPets(
            pets.filter((pet) => {
                const matchesQuery =
                    pet.name.toLowerCase().includes(query) ||
                    pet.species.toLowerCase().includes(query) ||
                    pet.breed.toLowerCase().includes(query) ||
                    pet.price.toString().includes(query); // Include price in search
                const matchesPrice = price === null || pet.price <= price; // Filter by price
                return matchesQuery && matchesPrice;
            })
        );
    };

    const handleDelete = async (id: number) => {
        await deletePet(id);
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        setFilteredPets((prevPets) => prevPets.filter((pet) => pet.id !== id)); // Update filtered pets
    };

    const handleEdit = (pet: Pet) => {
        setEditingPetId(pet.id);
        setFormData({ ...pet });
    };

    const handleCancel = () => {
        setEditingPetId(null);
        setFormData(null);
    };

    const handleSave = async () => {
        if (editingPetId && formData) {
            try {
                const updatedPet = await updatePet(editingPetId, formData);
                setPets((prevPets) =>
                    prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
                );
                setFilteredPets((prevPets) =>
                    prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
                ); // Update filtered pets
                setEditingPetId(null);
                setFormData(null);
            } catch (error) {
                console.error('Failed to update pet:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div>
            <h1>Pet List</h1>
            <input
                type="text"
                placeholder="Search pets by name, species, breed, or price..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                }}
            />
            <input
                type="number"
                placeholder="Filter by max price..."
                value={priceFilter || ''}
                onChange={handlePriceFilter}
                style={{
                    marginBottom: '20px',
                    padding: '10px',
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                }}
            />
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '20px' }}>
                {showAddForm ? 'Cancel' : 'Add New Pet'}
            </button>

            {showAddForm && (
                <AddPetForm
                    onAdd={async (newPet) => {
                        try {
                            const addedPet = await createPet(newPet);
                            setPets((prevPets) => [...prevPets, addedPet]);
                            setFilteredPets((prevPets) => [...prevPets, addedPet]); // Update filtered pets
                            setShowAddForm(false);
                        } catch (error) {
                            console.error('Failed to add pet:', error);
                        }
                    }}
                />
            )}

            {filteredPets.length === 0 ? ( // Check if the filtered pets array is empty
                <p style={{ textAlign: 'center', marginTop: '20px' }}>No Data</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Species</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Breed</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPets.map((pet) => (
                            <tr key={pet.id}>
                                {editingPetId === pet.id ? (
                                    <>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                            <input
                                                type="text"
                                                name="image"
                                                value={formData?.image || ''}
                                                onChange={handleChange}
                                                placeholder="Image URL"
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData?.name || ''}
                                                onChange={handleChange}
                                                placeholder="Name"
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <input
                                                type="text"
                                                name="species"
                                                value={formData?.species || ''}
                                                onChange={handleChange}
                                                placeholder="Species"
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <input
                                                type="text"
                                                name="breed"
                                                value={formData?.breed || ''}
                                                onChange={handleChange}
                                                placeholder="Breed"
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData?.price || ''}
                                                onChange={handleChange}
                                                placeholder="Price"
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                            <button onClick={handleSave} style={{ marginRight: '8px' }}>
                                                Save
                                            </button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                            <img
                                                src={pet.image}
                                                alt={pet.name}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pet.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pet.species}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pet.breed}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>${pet.price}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                            <button onClick={() => handleEdit(pet)} style={{ marginRight: '8px' }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(pet.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PetList;