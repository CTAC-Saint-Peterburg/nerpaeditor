import { useState } from "react";
import { ButtonGroup, Button } from "@mui/material";
import Canvas from "./components/Canvas";

function App() {
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(1); // Добавлено состояние для размера квадрата
  const [filledSquares, setFilledSquares] = useState({
    red: [],
    green: [],
    blue: []
  });

  const handleSquareFill = (color, x, y, size) => {
    setFilledSquares((prev) => {
      const updatedColorSquares = [...prev[color]];
      updatedColorSquares.push({ x, y, size }); // Добавляем размер к объекту
      return {
        ...prev,
        [color]: updatedColorSquares
      };
    });
  };

  const handleSave = () => {
    console.log(filledSquares);
    // Здесь вы можете добавить логику для сохранения объекта (например, отправка на сервер)
  };

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => setColor('red')}>Красный</Button>
        <Button onClick={() => setColor('blue')}>Синий</Button>
        <Button onClick={() => setColor('green')}>Зеленый</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={() => setSize(1)}>Размер 1</Button>
        <Button onClick={() => setSize(2)}>Размер 2</Button>
      </ButtonGroup>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Сохранить
      </Button>
      <Canvas fillColor={color} size={size} onSquareFill={handleSquareFill} />
    </>
  );
}

export default App;