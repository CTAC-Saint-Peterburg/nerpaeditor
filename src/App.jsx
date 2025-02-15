import { useState, useRef } from "react";
import { ButtonGroup, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Typography, TextareaAutosize } from "@mui/material";
import Canvas from "./components/Canvas";
import { CalendarViewMonthRounded, DoorSliding, EmojiPeople, GppBad, Inventory, Settings, Save } from "@mui/icons-material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function App() {
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(1);
  const [filledSquares, setFilledSquares] = useState([]);
  const [widthInput, setWidthInput] = useState(1);
  const [heightInput, setHeightInput] = useState(1);
  const [layer, setLayer] = useState(1);
  const [name, setName] = useState('');
  const [config, setConfig] = useState('');
  const [lastSquareInfo, setLastSquareInfo] = useState('');
  const [customColor, setCustomColor] = useState('');
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
    const newSquare = { color, x, y, size, layer, name, config, number: squareNumbers.length + 1 };
    setFilledSquares(prev => [...prev, newSquare]);
    setSquareNumbers(prev => [...prev, newSquare.number]);

    setLastSquareInfo(
      `Последний квадрат: Цвет - ${color}, Размер - ${size.width || size}x${size.height || size}, Слой - ${layer}, Имя - ${name || 'нет'}, Номер - ${newSquare.number}`
    );

    setName('');
    setConfig('');
  };

  const handleSave = () => {
    const dataToSave = {
      squares: filledSquares,
      settings: gameSettings,
    };
    const dataStr = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'filled_squares.json';
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
      setFilledSquares(prev => {
        const updatedSquares = prev.filter(square => square.number !== selectedSquareToDelete);
        return updatedSquares.map((square, index) => ({ ...square, number: index + 1 }));
      });

      setSquareNumbers(prev => prev.filter(num => num !== selectedSquareToDelete).map((num, index) => index + 1));
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
        setColor('red');
        break;
      case 2:
        setColor('blue');
        break;
      case 3:
        setColor('green');
        break;
      case 4:
        setColor('yellow');
        break;
      case 5:
        setColor('purple');
        break;
      case 6:
        setColor('gray');
        break;
      default:
        setColor('red');
    }

    setCustomColor('');
    setIsCustomMode(false);
  };

  const handleGameSettingChange = (key, value) => {
    setGameSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      setCustomColor('');
    }
  };

  const handleApplyCustomColor = () => {
    if (customColor) {
      setColor(customColor);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>Загрузить конфиг</Typography>
        <input type="file" accept=".json" onChange={handleUpload} title="Загрузить конфиг" />
      </Box>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Settings />
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Настройки игры</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Количество игроков"
            type="number"
            value={gameSettings.playerCount}
            onChange={(e) => handleGameSettingChange('playerCount', e.target.value)}
          />
          <TextField
            label="Мирные игроки"
            type="number"
            value={gameSettings.peacefulPlayers}
            onChange={(e) => handleGameSettingChange('peacefulPlayers', e.target.value)}
          />
          <TextField
            label="Предатели"
            type="number"
            value={gameSettings.traitorPlayers}
            onChange={(e) => handleGameSettingChange('traitorPlayers', e.target.value)}
          />
          <TextField
            label="Перезарядка способностей"
            type="number"
            value={gameSettings.abilityCooldown}
            onChange={(e) => handleGameSettingChange('abilityCooldown', e.target.value)}
          />
          <TextField
            label="Жизни игроков"
            type="number"
            value={gameSettings.playerHealth}
            onChange={(e) => handleGameSettingChange('playerHealth', e.target.value)}
          />
          <TextField
            label="Жизни предателей"
            type="number"
            value={gameSettings.traitorHealth}
            onChange={(e) => handleGameSettingChange('traitorHealth', e.target.value)}
          />
          <TextField
            label="Скорость игроков"
            type="number"
            value={gameSettings.playerSpeed}
            onChange={(e) => handleGameSettingChange('playerSpeed', e.target.value)}
          />
          <TextField
            label="Скорость предателей"
            type="number"
            value={gameSettings.traitorSpeed}
            onChange={(e) => handleGameSettingChange('traitorSpeed', e.target.value)}
          />
          <TextField
            label="КД на удар"
            type="number"
            value={gameSettings.attackCooldown}
            onChange={(e) => handleGameSettingChange('attackCooldown', e.target.value)}
          />
        </Box>
      </Box>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        {lastSquareInfo}
      </Typography>

      <ButtonGroup>
        <Button startIcon={<Inventory />} onClick={() => { setColor('red'); setIsCustomMode(false); }} disabled={layer === 6}>Сундук (красный)</Button>
        <Button startIcon={<CalendarViewMonthRounded />} onClick={() => { setColor('blue'); setIsCustomMode(false); }} disabled={layer === 6}>Клетка (синий)</Button>
        <Button startIcon={<DoorSliding />} onClick={() => { setColor('green'); setIsCustomMode(false); }} disabled={layer === 6}>Точка эвакуации (зеленый)</Button>
        <Button startIcon={<EmojiPeople />} onClick={() => { setColor('gray'); setIsCustomMode(false); }} disabled={layer !== 6}>Точка спавна (серый)</Button>
        <Button startIcon={<GppBad />} onClick={() => { setColor('black'); setIsCustomMode(false); }} disabled={layer !== 6}>Коллизия (черный)</Button>
        <Button startIcon={<AutoAwesomeIcon />} onClick={handleCustomMode}>Кастом</Button>
      </ButtonGroup>

      {isCustomMode && (
        <Box sx={{ marginTop: 2 }}>
          <TextField
            label="Кастомный цвет (HEX)"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" onClick={handleApplyCustomColor}>
            Применить цвет
          </Button>
        </Box>
      )}

      <ButtonGroup>
        <Button onClick={() => setSize(1)}>Размер 1</Button>
        <Button onClick={() => setSize(2)}>Размер 2</Button>
      </ButtonGroup>
      <Button variant="contained" color="secondary" onClick={handleRemoveSquare}>
        Удалить выбранный квадрат
      </Button>
      <Button variant="contained" color="error" onClick={handleRemoveAllSquares}>
        Удалить всё
      </Button>

      <Box sx={{ marginTop: 2 }}>
        <TextField
          label="Ширина"
          type="number"
          value={widthInput}
          onChange={(e) => setWidthInput(Number(e.target.value))}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Высота"
          type="number"
          value={heightInput}
          onChange={(e) => setHeightInput(Number(e.target.value))}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleApplySize}>
          Применить размер
        </Button>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Выберите квадрат для удаления</InputLabel>
          <Select
            value={selectedSquareToDelete || ''}
            label="Выберите квадрат для удаления"
            onChange={(e) => setSelectedSquareToDelete(e.target.value)}
          >
            {squareNumbers.map(num => (
              <MenuItem key={num} value={num}>
                Квадрат {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {layer !== 3 && (
        <Box sx={{ marginTop: 2 }}>
          <TextField
            label="Имя квадрата"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Box>
      )}

      <Box sx={{ marginTop: 2 }}>
        <TextareaAutosize
          minRows={3}
          placeholder="Конфиг"
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </Box>


      <Box sx={{ marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Слой (Z)</InputLabel>
          <Select
            value={layer}
            label="Слой (Z)"
            onChange={handleLayerChange}
          >
            <MenuItem value={1}>Слой 1 (Основной)</MenuItem>
            <MenuItem value={2}>Слой 2 (Дополнительный)</MenuItem>
            <MenuItem value={3}>Слой 3 (Дополнительный)</MenuItem>
            <MenuItem value={4}>Слой 4 (Дополнительный)</MenuItem>
            <MenuItem value={5}>Слой 5 (Дополнительный)</MenuItem>
            <MenuItem value={6}>Слой 6 (Коллизии и спавн)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button startIcon={<Save />} variant="contained" color="primary" onClick={handleSave}>
        Сохранить JSON
      </Button>

      <Canvas
        ref={canvasRef}
        fillColor={color}
        size={size}
        onSquareFill={(color, x, y, size) => handleSquareFill(color, x, y, size, layer, name, config)}
        filledSquares={filledSquares.filter(square => square.layer === layer)}
      />
    </>
  );
}

export default App;