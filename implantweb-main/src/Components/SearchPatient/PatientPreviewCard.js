import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const PatientPreviewCard = ({ patient }) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Patient Details Preview
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Registration Number
            </Typography>
            <Typography variant="body1">{patient.registrationNumber}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Patient Name
            </Typography>
            <Typography variant="body1">{patient.patientName}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Age
            </Typography>
            <Typography variant="body1">{patient.age}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Gender
            </Typography>
            <Typography variant="body1">
              {patient.gender || 'M'} {/* Default value when gender is not provided */}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Selected Implants
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {patient.implantTypes.map((implant, index) => (
                <Chip key={index} label={implant} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Operation Side
            </Typography>
            <Typography variant="body1">{patient.operationSide}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Operation Date
            </Typography>
            <Typography variant="body1">
              {patient.operationDate ? new Date(patient.operationDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientPreviewCard;