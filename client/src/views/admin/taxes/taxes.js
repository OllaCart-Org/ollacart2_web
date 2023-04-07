import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, TextField, Input, Checkbox, ListItemText } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import api from '../../../api';
import { Add, Save } from '@material-ui/icons';
import { Country, State }  from 'country-state-city';
import {JsonEditor} from "react-jsondata-editor"

const Categories = ({ categories }) => {
  const { addToast } = useToasts();

  const [taxJson, setTaxJson] = useState({});
  const [tempJson, setTempJson] = useState('');
  const [category, setCategory] = useState('');
  const [countries] = useState(Country.getAllCountries());
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchTaxes = useCallback(() => {
    if (!category) return;
    api.getTaxes({ category })
      .then((data) => {
        setTaxJson(data.tax?.taxJson || {});
      })
      .catch(err => showToast(err.message));
  }, [category, showToast])

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  useEffect(() => {
    setTempJson(JSON.stringify(taxJson, undefined, 4));
  }, [taxJson]);

  const addNewAll = () => {
    console.log(taxJson);
    countries.map(c => {
      const cCode = c.isoCode;
      if(!taxJson[cCode]) {
        taxJson[cCode] = { taxRate: 0 }
      }
      if (cCode === 'CA' || cCode === 'US') {
        const states = State.getStatesOfCountry(cCode);
        states.map(s => {
          const sCode = s.isoCode;
          if(!taxJson[cCode][sCode]) {
            taxJson[cCode][sCode] = {
              taxRate: 0
            }
          }
          return null;
        })
      }
      return null;
    });
    setTaxJson({ ...taxJson });
  }

  const taxChanged = (data) => {
    console.log('tax changed');
    setTaxJson(JSON.parse(data));
  }

  const updateTaxes = () => {
    api.updateTax({ category, taxJson })
      .then()
      .catch(err => showToast(err.message));
  }

  const textTaxChanged = (e) => {
    setTempJson(e.target.value);
    try {
      JSON.parse(e.target.value);
    } catch(ex) {
      return;
    }
    taxChanged(e.target.value);
  }

  const countryChanged = (e) => {
    const arr = e.target.value;
    const keys = Object.keys(taxJson);
    for (const key of arr) {
      if(keys.indexOf(key) === -1) {
        taxJson[key] = { taxRate: 0 };
      }
    }
    for (const key of keys) {
      if(arr.indexOf(key) === -1) {
        delete taxJson[key];
      }
    }
    setTaxJson({ ...taxJson });
  }

  return (
    <Box mt={2}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <FormControl variant="outlined" style={{minWidth: 130}} size='small'>
          <InputLabel id="category-label">Category</InputLabel>
          <Select labelWidth={70} labelId='category-label' value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map((c, idx) => (
              <MenuItem key={idx} value={c._id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display='flex' alignItems='center' gridGap={5}>
          <Box width='200px'>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                labelWidth={70}
                multiple
                value={Object.keys(taxJson)}
                onChange={countryChanged}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
              >
                {countries.map((c) => (
                  <MenuItem key={c.isoCode} value={c.isoCode}>
                    <Checkbox checked={Object.keys(taxJson).indexOf(c.isoCode) > -1} />
                    <ListItemText primary={c.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant='contained' startIcon={<Add />} color='primary' onClick={addNewAll}>Add All</Button>
          <Button variant='contained' startIcon={<Save />} color='primary' onClick={updateTaxes}>Update</Button>
        </Box>
      </Box>
      <Box mt={2} display='flex' justifyContent='space-between'>
        <Box width='45%'>
          <JsonEditor
            jsonObject={JSON.stringify(taxJson)}
            onChange={taxChanged}
          />
        </Box>
        <Box width='45%'>
          <TextField multiline rows={20} fullWidth variant='outlined' value={tempJson} onChange={textTaxChanged} />
        </Box>
      </Box>
    </Box>
  )
}

export default Categories;