import { useState, useRef } from "react";
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import Canvas from "./components/Canvas";
import {
  Save,
  ArrowCircleDownRounded,
  History,
} from "@mui/icons-material";
import { SettingsOption } from "./components/SettingsOption";
import { SelectedLayer } from "./components/SelectLayer";
import { CreateSquare } from "./components/CreateSquare";
import { EditSquare } from "./components/EditSquare";

function App() {
  const [color, setColor] = useState("red");
  const [size, setSize] = useState(1);
  const [filledSquares, setFilledSquares] = useState([]);
  const [widthInput, setWidthInput] = useState(1);
  const [heightInput, setHeightInput] = useState(1);
  const [layer, setLayer] = useState(1);
  const [name, setName] = useState("");
  const [config, setConfig] = useState("");
  const [lastSquareInfo, setLastSquareInfo] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedSquareToDelete, setSelectedSquareToDelete] = useState(null);
  const [squareNumbers, setSquareNumbers] = useState([]);


  // Инициализация состояния gameSettings
  const [gameSettings, setGameSettings] = useState({
    playerCount: 0,
    peacefulPlayers: 0,
    traitorPlayers: 0,
    abilityCooldown: 0,
    playerHealth: 0,
    traitorHealth: 0,
    playerSpeed: 0,
    traitorSpeed: 0,
    attackCooldown: 0,
  });

  const canvasRef = useRef();

  const handleSquareFill = (color, x, y, size, layer, name, config) => {
    const newSquare = {
      color,
      x,
      y,
      size,
      layer,
      name,
      config,
      number: squareNumbers.length + 1,
    };
    setFilledSquares((prev) => [...prev, newSquare]);
    setSquareNumbers((prev) => [...prev, newSquare.number]);

    setLastSquareInfo(
      `Последний добавленный квадрат: Цвет - ${color}, Размер - ${
        size.width || size
      }x${size.height || size}, Слой - ${layer}, Имя - ${
        name || "нет"
      }, Номер - ${newSquare.number}`
    );

    setName("");
    setConfig("");
  };

  const handleSave = () => {
    const dataToSave = {
      squares: filledSquares,
      settings: gameSettings,
    };
    const dataStr = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filled_squares.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setFilledSquares(jsonData.squares || []);
          setSquareNumbers(jsonData.squares.map(x=> x.number) || []);
          setGameSettings(jsonData.settings || {});
          if (canvasRef.current) {
            canvasRef.current.drawFilledSquares();
          }
        } catch (error) {
          console.error("Invalid JSON format", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveSquare = () => {
    if (selectedSquareToDelete !== null) {
      setFilledSquares((prev) => {
        const updatedSquares = prev.filter(
          (square) => square.number !== selectedSquareToDelete
        );
        return updatedSquares.map((square, index) => ({
          ...square,
          number: index + 1,
        }));
      });

      setSquareNumbers((prev) =>
        prev
          .filter((num) => num !== selectedSquareToDelete)
          .map((num, index) => index + 1)
      );
      setSelectedSquareToDelete(null);

      if (canvasRef.current) {
        canvasRef.current.drawFilledSquares();
      }
    }
  };

  const handleRemoveAllSquares = () => {
    setFilledSquares([]);
    setSquareNumbers([]);
    if (canvasRef.current) {
      canvasRef.current.drawFilledSquares();
    }
  };

  const handleApplySize = () => {
    setSize({ width: widthInput, height: heightInput });
  };

  const handleLayerChange = (event) => {
    const selectedLayer = event.target.value;
    setLayer(selectedLayer);

    switch (selectedLayer) {
      case 1:
        setColor("red");
        break;
      case 2:
        setColor("blue");
        break;
      case 3:
        setColor("green");
        break;
      case 4:
        setColor("yellow");
        break;
      case 5:
        setColor("purple");
        break;
      case 6:
        setColor("gray");
        break;
      default:
        setColor("red");
    }

    setCustomColor("");
    setIsCustomMode(false);
  };

  const handleGameSettingChange = (key, value) => {
    setGameSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      setCustomColor("");
    }
  };

  const handleApplyCustomColor = () => {
    if (customColor) {
      setColor(customColor);
    }
  };

  return (
    <>
      <Box sx={{ position: "sticky", top: "20px", left: '100%', width: '300px', height: '0px', zIndex: "999" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            fontSize: "16px",
            justifyContent: "space-between",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<ArrowCircleDownRounded />}
          >
            Загрузить конфиг
            <input type="file" accept=".json" onChange={handleUpload} hidden />
          </Button>
          <Button
            startIcon={<Save />}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Сохранить JSON
          </Button>
        </Box>
        <SelectedLayer layer={layer} handleLayerChange={handleLayerChange} />

        <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
          <FormControl>
            <InputLabel>Выберите квадрат для удаления</InputLabel>
            <Select
              sx={{ width: "200px", backgroundColor: 'white' }}
              value={selectedSquareToDelete || ""}
              label={'Выберите квадрат для удаления'}
              onChange={(e) => setSelectedSquareToDelete(e.target.value)}
            >
              {squareNumbers.map((num) => (
                <MenuItem key={num} value={num}>
                  Квадрат {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: '10px'}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRemoveSquare}
        >
          Удалить выбранный квадрат {selectedSquareToDelete}
        </Button>
        </Box>
        <Box
          sx={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (window.confirm("Вы действительно хотите удалить всё?")) {
                handleRemoveAllSquares();
              }
            }}
          >
            Удалить всё
          </Button>
        </Box>
      </Box>
      <Box sx={{height: '100%'}}>
      <SettingsOption
        gameSettings={gameSettings}
        handleGameSettingChange={handleGameSettingChange}
      />
      <CreateSquare
      setColor={setColor}
      setIsCustomMode={setIsCustomMode}
      layer={layer}
      handleCustomMode={handleCustomMode}
      setConfig={setConfig}
      config={config}
      widthInput={widthInput}
      setWidthInput={setWidthInput}
      setHeightInput={setHeightInput}
      heightInput={heightInput}
      name={name}
      setName={setName}
      isCustomMode={isCustomMode}
      handleApplySize={handleApplySize}
      />

      <EditSquare
      filledSquares={filledSquares}
      setFilledSquares={setFilledSquares}
      />
      
      </Box>

      <Box sx={{ padding: "10px" }}>
        <Alert icon={<History />} severity="success">
          {lastSquareInfo || "Новых квадратов не добавлено"}
        </Alert>
      </Box>

      <Canvas
        ref={canvasRef}
        fillColor={color}
        size={size}
        onSquareFill={(color, x, y, size) =>
          handleSquareFill(color, x, y, size, layer, name, config)
        }
        filledSquares={filledSquares.filter((square) => square.layer === layer)}
      />
    </>
  );
}

export default App;
