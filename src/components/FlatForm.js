import React, { useState, useRef } from "react";
import { Box, Switch, Card, CardContent, CardMedia, Typography, Button, Grid, TextField } from "@mui/material";
import { Api } from "../services/api";

const styles = {
  root: {
    display: "flex",
    maxWidth: 600,
    margin: "auto",
    marginTop: 16,
  },
  media: {
    width: 200,
    objectFit: "cover",
  },
  content: {
    flex: "1 0 auto",
  },
  button: {
    marginTop: 16,
  },
};

export default function FlatForm({ type, id }) {
  const [errorAlert, setErrorAlert] = useState("");
  const currentDate = new Date().toJSON().slice(0, 10);
  const [flatLoaded, setFlatLoaded] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flats, setFlats] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: currentDate
  });

  const cityRef = useRef();
  const streetNameRef = useRef();
  const streetNumberRef = useRef();
  const areaSizeRef = useRef();
  const hasACRef = useRef();
  const yearBuiltRef = useRef();
  const rentPriceRef = useRef();
  const dateAvailableRef = useRef();
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    setIsProgress(true);

    // Verifica que el ref hasACRef esté definido antes de acceder a sus propiedades
    const hasAC = hasACRef.current ? hasACRef.current.checked : false;

    const areaSizeValue = areaSizeRef.current.value;
    const cityValue = cityRef.current.value;
    const dateAvailableValue = dateAvailableRef.current.value;
    const rentPriceValue = rentPriceRef.current.value;
    const streetNameValue = streetNameRef.current.value;
    const streetNumberValue = streetNumberRef.current.value;
    const yearBuiltValue = yearBuiltRef.current.value;
    const userValue = JSON.parse(localStorage.getItem('user_logged'));

    try {
      const api = new Api();
      const result = await api.post('flats/', {
        areaSize: areaSizeValue,
        city: cityValue,
        dateAvailable: dateAvailableValue,
        hasAC: hasAC, // Enviar directamente el valor obtenido
        rentPrice: rentPriceValue,
        streetName: streetNameValue,
        streetNumber: streetNumberValue,
        yearBuilt: yearBuiltValue,
        user: userValue
      });
      console.log(result);
      if (result.data) {
        console.log(result.data.flats);
        setFlats(result.data.flats);
      } else {
        setError('No se encontraron Flats');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
      setIsProgress(false);
    }
  };

  return (
    <Box maxWidth="700px" margin="auto" bgcolor="rgba(255, 255, 255, 0.5)" p={4} sx={{ borderRadius: 3 }}>
      <form className="max-w-md mx-auto my-4" onSubmit={handleSubmit}>
        <>
          {type !== "create" && type !== "update" && (
            <Card style={styles.root}>
              <CardMedia
                component="img"
                style={styles.media}
                image={"flat.imgFlat"}
                title="Flat image"
              />
              <CardContent style={styles.content}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Flat Details
                </Typography>
                {flats && (
                  <>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Price:</strong> ${flats.rentPrice}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>Year Built:</strong> {flats.yearBuilt}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>City:</strong> {flats.city}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>Street:</strong> {flats.streetName}, No. {flats.streetNumber}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>Area Size:</strong> {flats.areaSize} sqft
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>Date Available:</strong> {flats.dateAvailable}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      <strong>AC:</strong> {flats.hasAC ? 'Yes' : 'No'}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          {(type === 'create' || type === 'update') && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="city"
                  label="City"
                  variant="outlined"
                  inputRef={cityRef}
                  defaultValue={flats?.city || ''}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="streetName"
                  label="Street Name"
                  variant="outlined"
                  inputRef={streetNameRef}
                  defaultValue={flats?.streetName|| ''}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="streetNumber"
                  label="Street Number"
                  variant="outlined"
                  type="number"
                  inputRef={streetNumberRef}
                  defaultValue={flats?.streetNumber|| ''}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="areaSize"
                  label="Area Size"
                  variant="outlined"
                  type="number"
                  inputRef={areaSizeRef}
                  defaultValue={flats?.areaSize|| ''}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" marginBottom="16px">
                  <label htmlFor="hasAC" style={{ marginRight: "8px" }}>Has AC</label>
                  <Switch 
                    disabled={type === 'view'} 
                    checked={flats?.hasAC || false} 
                    id="hasAC" 
                    inputRef={hasACRef} 
                    color="primary" 
                    onChange={() => {}} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="yearBuilt"
                  label="Year Built"
                  variant="outlined"
                  type="number"
                  inputRef={yearBuiltRef}
                  defaultValue={flats?.yearBuilt|| ''}
                  inputProps={{ min: 1900, max: 2050 }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="rentPrice"
                  label="Rent Price"
                  variant="outlined"
                  type="number"
                  inputRef={rentPriceRef}
                  defaultValue={flats?.rentPrice|| ''}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled={type === 'view'}
                  fullWidth
                  id="dateAvailable"
                  label="Date Available"
                  variant="outlined"
                  type="date"
                  inputRef={dateAvailableRef}
                  defaultValue={flats?.dateAvailable|| ''}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input 
                  disabled={type === 'view'} 
                  type="file" 
                  id="file" 
                  placeholder="Add photo" 
                  className="form-control" 
                  ref={fileRef} 
                  onChange={() => {}} 
                />
              </Grid>
              <Grid item xs={12}>
                <div className="justify-center flex">
                  <Button type='submit' variant="contained" sx={{ backgroundColor: 'black' }}>{type === 'create' ? 'Create' : 'Update'}</Button>
                  {type === 'update' && (
                    <Button variant="contained" color="error" sx={{ marginLeft: '8px' }} onClick={""}>Delete</Button>
                  )}
                </div>
              </Grid>
            </Grid>
          )}
        </>
      </form>
    </Box>
  );
}
