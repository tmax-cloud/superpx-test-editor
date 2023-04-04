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
import { sendMessage } from '../../utils/service-utils';
import { useNavigate } from 'react-router-dom';
export default function CreateTemplate() {
  const { t } = useTranslation();
  const [projectDescription, setProjectDescription] = React.useState('');
  const [buildSystem, setBuildSystem] = React.useState('');
  const [group, setGroup] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [jdk, setJdk] = React.useState('');
  const [isImport, setIsImport] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');
  const [visibilityLevel, setVisibilityLevel] = React.useState('Public');
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
  const handlevisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVisibilityLevel((event.target as HTMLInputElement).value);
  };
  const navigate = useNavigate();

  return (
    <div className="project-page-parent">
      <div className="create-page-blank-head">
        <h1>{t('CREATENEWPROJECT')}</h1>
        <Button
          variant="contained"
          onClick={() => {
            sendMessage('project', 'GenerateService', {
              project: {
                build_system: buildSystem,
                name: projectName,
                group: group,
                version: version,
                jdk: jdk,
                is_import: isImport,
              },
            });
            navigate(`/projects/${projectName}`);
          }}
        >
          Create project
        </Button>
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
        <h3>Build System</h3>
        <TextField
          helperText={'Enter Build System'}
          id={'demo-helper-text-aligned'}
          label={'Enter Build System'}
          value={buildSystem}
          onChange={(event) => {
            setBuildSystem(event.target.value);
          }}
        />
      </div>
      <div className="create-page-blank">
        <h3>Group</h3>
        <TextField
          helperText={'Enter Build Group'}
          id={'demo-helper-text-aligned'}
          label={'Enter Build Group'}
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
          }}
        />
      </div>
      <div className="create-page-blank">
        <h3>Version</h3>
        <TextField
          helperText={'Enter Version'}
          id={'demo-helper-text-aligned'}
          label={'Enter Version'}
          value={version}
          onChange={(event) => {
            setVersion(event.target.value);
          }}
        />
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Jdk</h3>
        </div>
        <TextField
          helperText={'Enter Jdk'}
          id={'demo-helper-text-aligned'}
          label={'Enter Jdk'}
          value={jdk}
          onChange={(event) => {
            setJdk(event.target.value);
          }}
        />
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Is import</h3>
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={isImport}
            onChange={(event) => {
              setIsImport(event.target.value === 'true');
            }}
            name="Is import"
          >
            <FormControlLabel value={false} control={<Radio />} label="false" />
            <FormControlLabel value={true} control={<Radio />} label="true" />
          </RadioGroup>
        </FormControl>
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
            value={visibilityLevel}
            onChange={handlevisibilityChange}
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
