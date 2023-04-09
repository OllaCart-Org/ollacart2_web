import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, TextField, ListItemText, TableContainer, Paper, Table, TableHead, TableRow, TableCell, IconButton, TableBody } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import {JsonEditor} from "react-jsondata-editor";
import api from '../../../api';
import { Add, Delete, Update } from '@material-ui/icons';
import { Country, State }  from 'country-state-city';
import AdminDialog from '../../../components/Admin/modal';

const Categories = ({ categories }) => {
  const { addToast } = useToasts();

  const [taxJson, setTaxJson] = useState({});
  const [tempJson, setTempJson] = useState('');
  const [category, setCategory] = useState(-1);
  const [countries] = useState(Country.getAllCountries());
  const [modalInfo, setModalInfo] = useState({open: false});
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchTaxes = useCallback(() => {
    api.getTaxes({ category })
      .then((data) => {
        const json = data.tax?.taxJson || {};
        setTaxJson(json);
        setTempJson(JSON.stringify(json, undefined, 4));
      })
      .catch(err => showToast(err.message));
  }, [category, showToast])

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  const taxChanged = (data) => {
    console.log('tax changed');
    const json = JSON.parse(data);
    setTaxJson(json);
    setTempJson(JSON.stringify(json, undefined, 4));
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

  const sortLocation = arr => {
    arr.sort((a, b) => {
      if (a.country > b.country) return 1;
      if (a.country < b.country) return -1;
      if (a.state > b.state) return 1;
      if (a.state < b.state) return -1;
      if (a.zipcode > b.zipcode) return 1;
      if (a.zipcode < b.zipcode) return -1;
      return 0;
    })
  }

  const openModal = () => {
    const locations = [];
    const cKeys = Object.keys(taxJson);
    for (const cKey of cKeys) {
      const country = cKey;
      const idx = countries.findIndex(c => c.isoCode === cKey);
      if (idx === -1) continue;
      const cDetail = taxJson[cKey];

      let itemCount = 0;
      if (typeof cDetail === 'object') {
        const sKeys = Object.keys(cDetail);
        const states = State.getStatesOfCountry(country);
        
        for (const sKey of sKeys) {
          if (sKey.toLocaleLowerCase() === 'taxrate') continue;
          if(sKey.length < 5) {
            const idx = states.findIndex(s => s.isoCode === sKey);
            if (idx === -1) continue;

            const state = sKey;
            const sDetail = cDetail[sKey];
            let sItemCount = 0;
            const zKeys = Object.keys(sDetail);
            for (const zKey of zKeys) {
              if (zKey.toLocaleLowerCase() === 'taxrate') continue;
              sItemCount ++;
              itemCount ++;
              locations.push({ country, state, zipcode: zKey });
            }
            if (!sItemCount) {
              itemCount ++;
              locations.push({ country, state });
            }
          } else {
            locations.push({ country, zipcode: sKey });
            itemCount ++;
          }
        }
      }
      if(!itemCount) {
        locations.push({ country });
      }
    }
    sortLocation(locations);
    setModalInfo({
      open: true,
      locations
    });
    console.log(locations);
  };

  const closeModal = () => {
    setModalInfo({ open: false });
  }

  const removeLocation = (idx) => {
    modalInfo.locations.splice(idx, 1);
    setModalInfo({ ...modalInfo });
  }

  const modalInfoChanged = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if(name === 'country') {
      modalInfo.states = State.getStatesOfCountry(value);
    }
    modalInfo[name] = value;
    setModalInfo({ ...modalInfo });
  }

  const addNewLocation = () => {
    const { country, state, zipcode } = modalInfo;
    if (!country) return showToast('Invalid Country');
    if (zipcode && zipcode.length < 5) return showToast('Invalid zipcode');
    modalInfo.locations.push({ country, state, zipcode });
    setModalInfo({ ...modalInfo });
  }

  const updateLocations = () => {
    const locations = modalInfo.locations;
    const cKeys = Object.keys(taxJson);
    for (const cKey of cKeys) {
      if (locations.findIndex(l => l.country === cKey) === -1) {
        delete taxJson[cKey];
        continue;
      }
      const sKeys = Object.keys(taxJson[cKey]);
      for (const sKey of sKeys) {
        if (sKey.toLocaleLowerCase() === 'taxrate') continue;
        if(sKey.length < 5) {
          if(locations.findIndex(l => l.country === cKey && l.state === sKey) === -1) {
            delete taxJson[cKey][sKey];
            continue;
          }
          const zKeys = Object.keys(taxJson[cKey][sKey]);
          for (const zKey of zKeys) {
            if (zKey.toLocaleLowerCase() === 'taxrate') continue;
            if(locations.findIndex(l => l.country === cKey && l.state === sKey && l.zipcode === zKey) === -1) {
              delete taxJson[cKey][sKey][zKey];
              continue;
            }
          }
        } else {
          if(locations.findIndex(l => l.country === cKey && l.zipcode === sKey) === -1) {
            delete taxJson[cKey][sKey];
            continue;
          }
        }
      }
    }
    for (const l of locations) {
      const { country, state, zipcode } = l;
      if (!country) continue;
      if (!state) {
        if (!zipcode) {
          if (taxJson[country] && typeof taxJson[country] !== 'object') continue;
          taxJson[country] = { taxRate: 0, ...(taxJson[country] || {}) };
        } else {
          if (taxJson[country] && taxJson[country][zipcode]) continue;
          taxJson[country] = { ...(taxJson[country] || {}), [zipcode]: 0 };
        }
      } else {
        if (!zipcode) {
          if (taxJson[country] && taxJson[country][state] && typeof taxJson[country][state] !== 'object') continue;
          taxJson[country] = { ...(taxJson[country] || {}) };
          taxJson[country] = { ...taxJson[country], [state]: { ...(taxJson[country][state] || {}), taxRate: 0 } };
        } else {
          if (taxJson[country] && taxJson[country][state] && taxJson[country][state][zipcode]) continue;
          taxJson[country] = { ...(taxJson[country] || {}) };
          taxJson[country] = { ...taxJson[country], [state]: { ...(taxJson[country][state] || {}) } };
          taxJson[country] = { ...taxJson[country], [state]: { ...taxJson[country][state], [zipcode]: 0 } };
        }
      }
    }
    setTaxJson({ ...taxJson });
    setTempJson(JSON.stringify(taxJson, undefined, 4));
    closeModal();
  }

  return (
    <Box mt={2}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <FormControl variant="outlined" style={{minWidth: 130}} size='small'>
          <InputLabel id="category-label">Category</InputLabel>
          <Select labelWidth={70} labelId='category-label' value={category} placeholder='All' onChange={e => setCategory(e.target.value)}>
            <MenuItem value={-1}>All</MenuItem>
            {categories.map((c, idx) => (
              <MenuItem key={idx} value={c._id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display='flex' alignItems='center' gridGap={5}>
          <Box width='200px'>
          </Box>
          <Button variant='contained' startIcon={<Add />} color='primary' onClick={openModal}>Manage Locations</Button>
          <Button variant='contained' startIcon={<Update />} color='secondary' onClick={updateTaxes}>Update</Button>
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
      <AdminDialog title='Manage Locations' open={modalInfo.open} onClose={closeModal}>
        <Box width={600}>
          <Box mt={2}>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select labelId="country-label" labelWidth={70} value={modalInfo.country || ''} name='country' onChange={modalInfoChanged}>
                {countries.map((c) => (
                  <MenuItem key={c.isoCode} value={c.isoCode}>
                    <ListItemText primary={c.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mt={1}>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel id="state-label">State</InputLabel>
              <Select labelId="state-label" labelWidth={60} value={modalInfo.state || ''} name='state' onChange={modalInfoChanged}>
                {modalInfo.states && modalInfo.states.map((c) => (
                  <MenuItem key={c.isoCode} value={c.isoCode}>
                    <ListItemText primary={c.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mt={1}>
            <TextField label='ZipCode' size='small' variant='outlined' fullWidth name='zipcode' onChange={modalInfoChanged} />
          </Box>
          <Box mt={1} display='flex' justifyContent='flex-end' gridGap={15}>
            <Button variant='contained' startIcon={<Add />} color='primary' onClick={addNewLocation}>Add</Button>
            <Button variant='contained' startIcon={<Update />} color='secondary' onClick={updateLocations}>Update</Button>
          </Box>
          <Box mt={1}>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Country</TableCell>
                    <TableCell align="center">State</TableCell>
                    <TableCell align="center">ZipCode</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modalInfo.locations && modalInfo.locations.map((location, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="left">{location.country} - {Country.getCountryByCode(location.country)?.name || '-'}</TableCell>
                      <TableCell align="left">{location.state} - {State.getStateByCodeAndCountry(location.state, location.country)?.name || '-'}</TableCell>
                      <TableCell align="center">{location.zipcode || '-'}</TableCell>
                      <TableCell align="center">
                        <Box display='flex' justifyContent='center' gridGap={5}>
                          <IconButton size='small' color='secondary' onClick={() => removeLocation(idx)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </AdminDialog>
    </Box>
  )
}

export default Categories;