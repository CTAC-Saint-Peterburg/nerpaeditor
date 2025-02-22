import {
    TextField,
    Box,
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary,
  } from "@mui/material";
  import {
    Settings,
    ArrowDownward,
  } from "@mui/icons-material";


export const SettingsOption = (props)=> {
    const {gameSettings, handleGameSettingChange} = props;
    return (<Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Settings />
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Настройки игры
          </Typography>
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDownward />}>
            Настройки игры
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Количество игроков"
                type="number"
                value={gameSettings.playerCount}
                onChange={(e) =>
                  handleGameSettingChange("playerCount", e.target.value)
                }
              />
              <TextField
                label="Мирные игроки"
                type="number"
                value={gameSettings.peacefulPlayers}
                onChange={(e) =>
                  handleGameSettingChange("peacefulPlayers", e.target.value)
                }
              />
              <TextField
                label="Предатели"
                type="number"
                value={gameSettings.traitorPlayers}
                onChange={(e) =>
                  handleGameSettingChange("traitorPlayers", e.target.value)
                }
              />
              <TextField
                label="Перезарядка способностей"
                type="number"
                value={gameSettings.abilityCooldown}
                onChange={(e) =>
                  handleGameSettingChange("abilityCooldown", e.target.value)
                }
              />
              <TextField
                label="Жизни игроков"
                type="number"
                value={gameSettings.playerHealth}
                onChange={(e) =>
                  handleGameSettingChange("playerHealth", e.target.value)
                }
              />
              <TextField
                label="Жизни предателей"
                type="number"
                value={gameSettings.traitorHealth}
                onChange={(e) =>
                  handleGameSettingChange("traitorHealth ", e.target.value)
                }
              />
              <TextField
                label="Скорость игроков"
                type="number"
                value={gameSettings.playerSpeed}
                onChange={(e) =>
                  handleGameSettingChange("playerSpeed", e.target.value)
                }
              />
              <TextField
                label="Скорость предателей"
                type=" number "
                value={gameSettings.traitorSpeed}
                onChange={(e) =>
                  handleGameSettingChange("traitorSpeed", e.target.value)
                }
              />
              <TextField
                label=" КД на удар "
                type=" number "
                value={gameSettings.attackCooldown}
                onChange={(e) =>
                  handleGameSettingChange("attackCooldown ", e.target.value)
                }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>)
}