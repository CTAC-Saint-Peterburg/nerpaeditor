import { useState, useRef } from "react";
import { ButtonGroup, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Typography, TextareaAutosize } from "@mui/material";
import Canvas from "./components/Canvas";
import { CalendarViewMonthRounded, DoorSliding, EmojiPeople, GppBad, Inventory, Settings, Save } from "@mui/icons-material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Импортируем иконку

function App() {
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(1);
  const [filledSquares, setFilledSquares] = useState([]); // Массив всех закрашенных квадратов
  const [widthInput, setWidthInput] = useState(1); // Состояние для ширины
  const [heightInput, setHeightInput] = useState(1); // Состояние для высоты
  const [layer, setLayer] = useState(1); // Состояние для выбранного слоя (z)
  const [name, setName] = useState(''); // Имя квадрата (для слоев 1 и 2)
  const [config, setConfig] = useState(''); // Конфиг для квадрата
  const [lastSquareInfo, setLastSquareInfo] = useState(''); // Информация о последнем добавленном квадрате
  const [customColor, setCustomColor] = useState(''); // Кастомный цвет
  const [isCustomMode, setIsCustomMode] = useState(false); // Режим кастомного цвета

  // Настройки игры
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

  const canvasRef = useRef(); // Ref для компонента Canvas

  // Обработчик закрашивания квадрата
  const handleSquareFill = (color, x, y, size, layer, name, config) => {
    const newSquare = { color, x, y, size, layer, name, config }; // Создаем новый квадрат
    setFilledSquares(prev => [...prev, newSquare]); // Добавляем квадрат в массив

    // Обновляем информацию о последнем добавленном квадрате
    setLastSquareInfo(
      `Последний квадрат: Цвет - ${color}, Размер - ${size.width || size}x${size.height || size}, Слой - ${layer}, Имя - ${name || 'нет'}`
    );

    // Сбрасываем поля имени и конфига
    setName('');
    setConfig('');
  };

  // Обработчик сохранения данных
  const handleSave = () => {
    const dataToSave = {
      squares: filledSquares, // Все квадраты
      settings: gameSettings, // Настройки игры
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

  // Обработчик загрузки данных
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setFilledSquares(jsonData.squares || []); // Загружаем квадраты
          setGameSettings(jsonData.settings || {}); // Загружаем настройки
          if (canvasRef.current) {
            canvasRef.current.drawFilledSquares(); // Перерисовываем холст
          }
        } catch (error) {
          console.error("Invalid JSON format", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Обработчик удаления последнего квадрата на текущем слое
  const handleRemoveLastSquare = () => {
    setFilledSquares(prev => {
      // Находим индекс последнего квадрата на текущем слое
      const lastIndex = prev.map((square, index) => ({ ...square, index }))
        .filter(square => square.layer === layer)
        .pop()?.index;

      if (lastIndex !== undefined) {
        return prev.filter((_, index) => index !== lastIndex); // Удаляем квадрат по индексу
      }
      return prev; // Если квадратов на слое нет, возвращаем исходный массив
    });

    if (canvasRef.current) {
      canvasRef.current.drawFilledSquares(); // Перерисовываем холст
    }
  };

  // Обработчик удаления всех квадратов
  const handleRemoveAllSquares = () => {
    setFilledSquares([]); // Очищаем массив квадратов
    if (canvasRef.current) {
      canvasRef.current.drawFilledSquares(); // Перерисовываем холст
    }
  };

  // Обработчик применения размера
  const handleApplySize = () => {
    setSize({ width: widthInput, height: heightInput }); // Устанавливаем новый размер
  };

  // Обработчик изменения слоя
  const handleLayerChange = (event) => {
    const selectedLayer = event.target.value;
    setLayer(selectedLayer);

    // Устанавливаем цвет по умолчанию в зависимости от слоя
    if (selectedLayer === 3) {
      setColor('gray'); // Серый для слоя 3
    } else {
      setColor('red'); // Красный для слоев 1 и 2
    }

    // Сбрасываем кастомный цвет при изменении слоя
    setCustomColor('');
    setIsCustomMode(false);
  };

  // Обработчик изменения настроек игры
  const handleGameSettingChange = (key, value) => {
    setGameSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Обработчик включения/выключения кастомного режима
  const handleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      setCustomColor(''); // Сбрасываем кастомный цвет при включении режима
    }
  };

  // Обработчик применения кастомного цвета
  const handleApplyCustomColor = () => {
    if (customColor) {
      setColor(customColor); // Устанавливаем кастомный цвет
    }
  };

  return (
    <>
      {/* Блок настроек игры */}
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

      {/* Информация о последнем добавленном квадрате */}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        {lastSquareInfo}
      </Typography>

      <ButtonGroup>
        <Button startIcon={<Inventory />} onClick={() => { setColor('red'); setIsCustomMode(false); }} disabled={layer === 3}>Сундук (красный)</Button>
        <Button startIcon={<CalendarViewMonthRounded />} onClick={() => { setColor('blue'); setIsCustomMode(false); }} disabled={layer === 3}>Клетка (синий)</Button>
        <Button startIcon={<DoorSliding />} onClick={() => { setColor('green'); setIsCustomMode(false); }} disabled={layer === 3}>Точка эвакуации (зеленый)</Button>
        <Button startIcon={<EmojiPeople />} onClick={() => { setColor('gray'); setIsCustomMode(false); }} disabled={layer !== 3}>Точка спавна (серый)</Button>
        <Button startIcon={<GppBad />} onClick={() => { setColor('black'); setIsCustomMode(false); }} disabled={layer !== 3}>Коллизия (черный)</Button>
        <Button startIcon={<AutoAwesomeIcon />} onClick={handleCustomMode}>Кастом</Button>
      </ButtonGroup>

      {/* Поля для кастомного цвета */}
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
      <Button variant="contained" color="secondary" onClick={handleRemoveLastSquare}>
        Удалить последний квадрат
      </Button>
      <Button variant="contained" color="error" onClick={handleRemoveAllSquares}>
        Удалить всё
      </Button>

      {/* Поля ввода для ширины и высоты */}
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

      {/* Поле ввода имени */}
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

      {/* Textarea для конфига */}
      <Box sx={{ marginTop: 2 }}>
        <TextareaAutosize
          minRows={3}
          placeholder="Конфиг"
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </Box>

      {/* Выбор слоя */}
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
            <MenuItem value={3}>Слой 3 (Коллизии и спавн)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button startIcon={<Save />} variant="contained" color="primary" onClick={handleSave}>
        Сохранить JSON
      </Button>

      {/* Компонент Canvas */}
      <Canvas
        ref={canvasRef}
        fillColor={color}
        size={size}
        onSquareFill={(color, x, y, size) => handleSquareFill(color, x, y, size, layer, name, config)} // Передаем слой, имя и конфиг
        filledSquares={filledSquares.filter(square => square.layer === layer)} // Фильтруем квадраты по слою
      />
    </>
  );
}

export default App;