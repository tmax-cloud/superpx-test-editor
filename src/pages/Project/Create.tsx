import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Create() {
  const navigate = useNavigate();
  const handleCardClick = (path) => {
    navigate(path);
  };
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="create-page-head">{t('CREATENEWPROJECT')}</h1>
      <Card
        sx={{
          boxSizing: 'borderBox',
          position: 'absolute',
          width: '500px',
          height: '205px',
          left: '277px',
          top: '339px',
          background: '#FFFFFF',
          border: '1px solid #BDBDBD',
          borderRadius: '8px',
        }}
        onClick={() => handleCardClick('/px/create/blank')}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Create blank project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a blank project to store your files, plan your work, and
              collaborate on code, among other things
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        sx={{
          boxSizing: 'borderBox',
          position: 'absolute',
          width: '500px',
          height: '205px',
          left: '797px',
          top: '339px',
          background: '#FFFFFF',
          border: '1px solid #BDBDBD',
          borderRadius: '8px',
        }}
        onClick={() => handleCardClick('/px/create/fromTemplate')}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Create from template
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a project pre-populated with the necessary files to get you
              started quickly
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
