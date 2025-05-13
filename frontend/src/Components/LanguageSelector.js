import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LanguageSelector = ({ sourceLang, setSourceLang }) => {
  return (
    <FormControl fullWidth size="small" sx={{ mt: 2, minWidth: 180 }}>
      <InputLabel id="lang-label" sx={{ color: 'white' }}>Caption/Translation</InputLabel>
      <Select
        labelId="lang-label"
        value={sourceLang}
        label="Spoken Language"
        onChange={(e) => setSourceLang(e.target.value)}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '.MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        <MenuItem value="off">OFF- No Captions</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="de">German</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
