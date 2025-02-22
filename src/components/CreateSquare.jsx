import {
  ButtonGroup,
  Button,
  TextField,
  Box,
  TextareaAutosize,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowDownward,
  AutoAwesome,
  CalendarViewMonthRounded,
  DoorSliding,
  EmojiPeople,
  GppBad,
  Inventory,
} from "@mui/icons-material";

export const CreateSquare = (props) => {
  const {
    setColor,
    setIsCustomMode,
    layer,
    handleCustomMode,
    setConfig,
    handleApplySize,
    config,
    widthInput,
    setWidthInput,
    setHeightInput,
    heightInput,
    name,
    setName,
    isCustomMode,
  } = props;
  return (<Box
    sx={{
      backgroundColor: "#f5f5f5",
      padding: 2,
      borderRadius: 2,
      marginBottom: 2,
    }}
  >
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownward />}>
        Настройки квадрата
      </AccordionSummary>
      <AccordionDetails>
        <ButtonGroup>
          <Button
            startIcon={<Inventory />}
            onClick={() => {
              setColor("red");
              setIsCustomMode(false);
            }}
            disabled={layer === 6}
          >
            Сундук (красный)
          </Button>
          <Button
            startIcon={<CalendarViewMonthRounded />}
            onClick={() => {
              setColor("blue");
              setIsCustomMode(false);
            }}
            disabled={layer === 6}
          >
            Клетка (синий)
          </Button>
          <Button
            startIcon={<DoorSliding />}
            onClick={() => {
              setColor("green");
              setIsCustomMode(false);
            }}
            disabled={layer === 6}
          >
            Точка эвакуации (зеленый)
          </Button>
          <Button
            startIcon={<EmojiPeople />}
            onClick={() => {
              setColor("gray");
              setIsCustomMode(false);
            }}
            disabled={layer !== 6}
          >
            Точка спавна (серый)
          </Button>
          <Button
            startIcon={<GppBad />}
            onClick={() => {
              setColor("black");
              setIsCustomMode(false);
            }}
            disabled={layer !== 6}
          >
            Коллизия (черный)
          </Button>
          <Button startIcon={<AutoAwesome />} onClick={handleCustomMode}>
            Кастом
          </Button>
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
            style={{ width: "100%", padding: "8px" }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
    </Box>
  );
};
