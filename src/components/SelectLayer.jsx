import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from "@mui/material";


export const SelectedLayer = (props)=> {
    const {layer, handleLayerChange} = props;
    return (
        <Box sx={{ marginTop: 2}}>
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <FormControl>
          <InputLabel>Слой (Z)</InputLabel>
          <Select sx={{backgroundColor: 'white'}} value={layer} label="Слой (Z)" onChange={handleLayerChange}>
            <MenuItem value={1}>Слой 1 (Основной)</MenuItem>
            <MenuItem value={2}>Слой 2 (Дополнительный)</MenuItem>
            <MenuItem value={3}>Слой 3 (Дополнительный)</MenuItem>
            <MenuItem value={4}>Слой 4 (Дополнительный)</MenuItem>
            <MenuItem value={5}>Слой 5 (Дополнительный)</MenuItem>
            <MenuItem value={6}>Слой 6 (Коллизии и спавн)</MenuItem>
          </Select>
        </FormControl>
        </Box>
      </Box>
    )
}