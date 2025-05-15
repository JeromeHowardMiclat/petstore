import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/miclat/pets';

export interface Pet {
    id: number;
    name: string;
    species: string;
    breed: string;
    gender: string;
    image: string;
    description: string;
    price: number;
}

export const getAllPets = async (): Promise<Pet[]> => {
    const response = await axios.get<Pet[]>(API_BASE_URL);
    return response.data;
};

export const getPetById = async (id: number): Promise<Pet> => {
    const response = await axios.get<Pet>(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createPet = async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const response = await axios.post<Pet>(API_BASE_URL, pet);
    return response.data;
};

export const updatePet = async (id: number, pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const response = await axios.put<Pet>(`${API_BASE_URL}/${id}`, pet);
    return response.data; // Ensure the backend returns the updated pet
};

export const deletePet = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};

export const searchPets = async (key: string): Promise<Pet[]> => {
    const response = await axios.get<Pet[]>(`${API_BASE_URL}/search/${key}`);
    return response.data;
};

export const filterPetsByPrice = async (price: number): Promise<Pet[]> => {
    const response = await axios.get<Pet[]>(`${API_BASE_URL}/search/price/${price}`);
    return response.data;
};