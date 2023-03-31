import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@mui/icons-material/Help';
export default function CreateBlank() {
  const { t } = useTranslation();
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectName, setProjectName] = React.useState('');

  const [characterCount, setCharacterCount] = React.useState(0);
  const [invalidProjectNameHelp, setinValidProjectNameHelp] =
    React.useState('');
  const handleProjectDescriptionChange = (event) => {
    setProjectDescription(event.target.value);
    setCharacterCount(event.target.value.length);
  };
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };
  React.useEffect(() => {
    if (!projectName) {
      setinValidProjectNameHelp('content is empty');
    } else if (!/^[^/\\:*?"<>|\s]+$/.test(projectName)) {
      setinValidProjectNameHelp('Must not contain ", /:?"<>|" characters');
    } else {
      setinValidProjectNameHelp('');
    }
  }, [projectName]);
  return (
    <div className="project-page-parent">
      <div className="create-page-blank-head">
        <h1>{t('CREATENEWPROJECT')}</h1>
        <Button variant="contained">Create project</Button>
      </div>
      <div className="create-page-blank">
        <h3>Project Name</h3>
        <TextField
          helperText={
            invalidProjectNameHelp
              ? invalidProjectNameHelp
              : 'Project slug will be created automatically.'
          }
          id={
            invalidProjectNameHelp
              ? 'outlined-error'
              : 'demo-helper-text-aligned'
          }
          label={'My awesome project'}
          error={!!invalidProjectNameHelp}
          value={projectName}
          onChange={handleProjectNameChange}
        />
      </div>

      <div className="create-page-blank">
        <div>
          <h3>Project Description</h3>
          <h5>(optional)</h5>
        </div>
        <Box
          sx={{
            width: '550px',
          }}
        >
          <TextField
            label="This project is awesome."
            multiline
            rows={4}
            value={projectDescription}
            onChange={handleProjectDescriptionChange}
            variant="outlined"
            fullWidth
          />
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <small>{characterCount} / 200</small>
          </Box>
        </Box>
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Visibility Level</h3>
          <Tooltip title="More information">
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Public"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Public"
              control={<Radio />}
              label="Public"
            />
            <FormHelperText>
              The project can be cloned without any authentication.
            </FormHelperText>
            <FormControlLabel
              value="Internal"
              control={<Radio />}
              label="Internal"
            />
            <FormHelperText>
              The project can be cloned by any logged in user.
            </FormHelperText>
            <FormControlLabel
              value="Private"
              control={<Radio />}
              label="Private"
            />
            <FormHelperText>
              Project access must be granted explicitly for each user.
            </FormHelperText>
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
