import {  useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';



interface AddFood {
  image: string,
  name: string,
  price: string,
  description: string
}

interface FoodData {
  
  "id": number,
  "name": string,
  "description": string,
  "price": number,
  "available": boolean,
  "image": string
  
}

export default function Dashboard() {
  const [foods, setfoods] = useState<FoodData[]>([]);
  const [editingFood, seteditingFood] = useState<FoodData>({} as FoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);

  useEffect(() => {
    async function getFood() {
      const response = await api.get('/foods');
      setfoods( response.data );
    }
    getFood()
  },[])

  const handleAddFood = async (food: AddFood) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setfoods([...foods, response.data] );
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: AddFood) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setfoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setfoods( foodsFiltered );
  }

  const toggleModal = () => {
    setModalOpen( !modalOpen );
  }

  const toggleEditModal = () => {
    seteditModalOpen( !editModalOpen );
  }

  const handleEditFood = (food: FoodData) => {
    seteditingFood(food)
    setModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}


