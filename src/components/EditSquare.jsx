import { useState} from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

export const EditSquare = ({ filledSquares, setFilledSquares }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [name, setName] = useState("");
  const [config, setConfig] = useState("");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // Обработчик выбора квадрата
  const handleSquareSelect = (event) => {
    const squareNumber = event.target.value;
    const square = filledSquares.find((sq) => sq.number === squareNumber);
    if (square) {
      setSelectedSquare(square);
      setName(square.name || "");
      setConfig(square.config || "");
      setWidth(square.size.width || square.size);
      setHeight(square.size.height || square.size);
      setX(square.x);
      setY(square.y);
    } else {
      setSelectedSquare(null);
      setName("");
      setConfig("");
      setWidth(1);
      setHeight(1);
      setX(0);
      setY(0);
    }
  };

  // Обработчик сохранения изменений
  const handleSaveChanges = () => {
    if (selectedSquare) {
      const updatedSquares = filledSquares.map((square) =>
        square.number === selectedSquare.number
          ? {
              ...square,
              name,
              config,
              size: { width, height },
              x,
              y,
            }
          : square
      );
      setFilledSquares(updatedSquares);
      alert("Изменения сохранены!");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 2,
        borderRadius: 2,
        marginBottom: 2,
      }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownward />}>
          Редактирование квадрата
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Выберите квадрат для редактирования</InputLabel>
            <Select
              value={selectedSquare ? selectedSquare.number : ""}
              label="Выберите квадрат для редактирования"
              onChange={handleSquareSelect}
            >
              {filledSquares.map((square) => (
                <MenuItem key={square.number} value={square.number}>
                  Квадрат {square.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedSquare && (
            <>
              <TextField
                label="Имя квадрата"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Конфиг"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                  label="Ширина"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
                <TextField
                  label="Высота"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                  label="Координата X"
                  type="number"
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                />
                <TextField
                  label="Координата Y"
                  type="number"
                  value={y}
                  onChange={(e) => setY(Number(e.target.value))}
                />
              </Box>
              <Button variant="contained" onClick={handleSaveChanges}>
                Сохранить изменения
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};